// @ts-nocheck
import React from 'react';
import CryptoJS from 'crypto-js'
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { API_BASE_URL, LOGIN_API, SECRET_KEY } from '../constants/data';
import axios from 'axios';


const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export const LoginContext = React.createContext<any>(null);

const ContextProvider = ({ children }: any) => {

    const [message, setMessage] = React.useState('')
    const [messageType, setMessageType] = React.useState('')
    const [show, setShow] = React.useState(false)
    const [user, setUser] = React.useState<any>(loadUserData())
    const [loading, setLoading] = React.useState<boolean>(false)
    const Login = React.useRef(() => { })
    const Profile = React.useRef(() => { })

    React.useEffect(() => {
        // Login.current()
        Profile.current()
        // setUser(loadUserData())
    }, [])

    const handleAlertClose = () => {
        setShow(false)
        setMessage('')
        setMessageType('')
    }


    function encrypt(text: any) {
        var ciphertext = CryptoJS.AES.encrypt(
            JSON.stringify(text),
            SECRET_KEY
        ).toString();
        return ciphertext
    }
    function decrypt(ciphertext: any) {
        var bytes = CryptoJS.AES.decrypt(ciphertext, SECRET_KEY);
        var decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
        return decryptedData
    }


    function loadUserData() {
        const serializedState = localStorage.getItem('user');
        if (serializedState === null) {
            if (window.location.pathname !== '/') window.location.href = '/'
            return '';
        }
        return decrypt(serializedState);

    }



    Login.current = async function () {
        if (user) {
            const items = {
                "mobile_number": user.mobile_number
            }
            let { data } = await axios.post(LOGIN_API, encrypt(items))

            data = decrypt(data.result)
            if (!data.isError) {
                localStorage.setItem('user', encrypt({
                    username: data.modal.username,
                    address: data.modal.address,
                    company_name: data.modal.company_name,
                    email: data.modal.email,
                    designation: data.modal.designation,
                    gender: data.modal.gender,
                    mobile_number: data.modal.mobile_number,
                    name: data.modal.name,
                    profile_image: data.modal.profile_image,
                    token: data.modal.token,
                    total_point: data.modal.total_point
                }))
                setUser(loadUserData())
                
                if (window.location.pathname === '/') window.location.href = '/home'
            }
        }
    }

    Profile.current = async function () {
        if (user) {
            let { data } = await axios.get(`${API_BASE_URL}profile/detail`, {
                headers: {
                    'Authorization': 'Bearer ' + user.token,
                },
            })

            data = decrypt(data.result)
            if (!data.isError) {
                localStorage.setItem('user', encrypt({
                    username: data.modal.username,
                    address: data.modal.address,
                    company_name: data.modal.company_name,
                    email: data.modal.email,
                    designation: data.modal.designation,
                    gender: data.modal.gender,
                    mobile_number: data.modal.mobile_number,
                    name: data.modal.name,
                    profile_image: data.modal.profile_image,
                    token: user.token,
                    total_point: data.modal.total_point
                }))
                setUser(loadUserData())
            }
        }
    }


    return (
        <LoginContext.Provider value={{
            message, setMessage, messageType,
            setMessageType, show, setShow, handleAlertClose, encrypt, decrypt,
            user, setUser, loading, setLoading
        }}>
            {children}
            < Snackbar open={show} autoHideDuration={6000} onClose={handleAlertClose}>
                <Alert onClose={handleAlertClose} severity={messageType} sx={{ width: '100%' }}>
                    {message}
                </Alert>
            </Snackbar>
        </LoginContext.Provider >
    )
}

export default ContextProvider;