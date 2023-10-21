import React from 'react';
import { Button } from '@mui/material';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { LoginContext } from '../context/Context';
import axios from 'axios';
import { LOGIN_API } from '../constants/data';
import { useNavigate } from 'react-router-dom';



export default function Login() {
    const navigate = useNavigate()
    const { setMessage, setMessageType, setShow, encrypt, decrypt, setUser } = React.useContext(LoginContext)

    // const timeRef = React.useRef()

    const [displayForFirst, setDisplayForFirst] = React.useState(true)
    const [displayForSecond, setDisplayForSecond] = React.useState(false)
    const [otp, setOtp] = React.useState('');
    const [number, setNumber] = React.useState('')
    const [RealOTP, setRealOTP] = React.useState('')
    // const [resendTime, setResendTime] = React.useState(60)

    async function OTPSender() {
        setRealOTP('')
        // clearInterval(timeRef.current);
        // setResendTime(60);
        const items = {
            "mobile_number": `+91${number}`
        }
        let { data } = await axios.post(LOGIN_API, encrypt(items))

        data = decrypt(data.result)
        if (!data.isError) {
            setRealOTP(data.modal.otp)
            setShow(true)
            setMessage("OTP Sent")
            setMessageType('success')
            setDisplayForFirst((prevDisplay) => prevDisplay = false)
            setDisplayForSecond((prevDisplay) => prevDisplay = true)

            setUser({
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
            })

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
        }
        else {
            setMessage('Something Went Wrong. Please Try again Later')
            setMessageType('error')
            setShow(true)
        }


        // const response = await sendOTP(items)
        // if (response) {
        //     setRealOTP(response.slice(0, 6))
        // }
        // timeRef.current = setInterval(() => {
        //     setResendTime((time) => time - 1)
        // }, 1000);
    }
    // if (resendTime === 0) {
    //     clearInterval(timeRef.current)
    // }
    const verifyOTP = (enteredOtp: string) => {
        if (RealOTP === enteredOtp) {
            setMessage('OTP Verified')
            setMessageType('success')
            setShow(true)
            return true
        } else {
            setMessage('OTP is not correct')
            setMessageType('error')
            setShow(true)
            return false
        }
    }

    //---------------END--------------------------


    function afterVerifiedOTP() {
        setDisplayForFirst(false)
        setDisplayForSecond(false)
    }

    function forSecondButtonDisplay() {
        if (number.length < 10 || number.length > 10) {
            setShow(true);
            setMessage('Enter valid number')
            setMessageType('error')
        }
        else if (number.length === 10) {
            OTPSender()
        }
    }
    const handleNumChange = (e: any) => {
        if(e.target.value.length > 10){
            return
        }
        setNumber(e.target.value)
        if (e.target.value.length < 10 || number.length > 10) {
            setDisplayForSecond((prevDisplay) => prevDisplay = false)
            setDisplayForFirst((prevDisplay) => prevDisplay = true)
        }
    }
    const handleOTPChange = (num: any) => {
        setOtp(num.value)
    }


    // function onClickResend() {
    //     setRealOTP('')
    //     OTPSender()
    // }

    const onclickOTPButton = async () => {
        if (otp.length < 6 || otp.length > 6) {
            setShow(true)
            setMessage('OTP must be of 6 number.')
            setMessageType('error')
        }
        else if (otp.length === 6) {
            const success = verifyOTP(otp)
            if (success) {
                afterVerifiedOTP()
                navigate('/home')
            }
        }
    }

    // React.useEffect(() => {
    //     if (user.token) {
    //         navigate('/home')
    //     }
    // })

    return (
        <>
            <div className='w-full h-screen bg-[#2f2f8f] flex justify-center items-center'>
                <div className='w-11/12 md:w-8/12 rounded-sm shadow-md lg:w-1/2 mx-auto flex flex-col md:flex-row h-[70vh]'>
                    <div className='w-full md:w-[40%] py-3 md:py-[0] md:h-full text-center md:text-start bg-yellow-500 md:pl-[30px]'>
                        <img className=' md:mt-[9rem] mx-auto md:mx-0 w-[100px] h-[100px]' src={require('../assets/isLogin.png')} alt="Login" />
                        <Typography variant="h6" sx={{ fontSize: '18px', fontWeight: '600', ml: 1, color: 'white' }}>Login/Signup</Typography>
                    </div>
                    <div className='w-full relative md:w-[60%] h-full bg-white text-center md:text-start pt-8 pl-5'>
                        <Box
                            className="flex items-center justify-start w-[60%] md:w-[40%] "
                        >
                            <img src={require('../assets/logo-1.png')} style={{ width: '80px' }} alt="Roambingo" />
                            <Typography variant="h6" sx={{ fontSize: '24px', fontWeight: '600', color: '#312f92' }}>Roam</Typography>
                            <Typography variant="h6" sx={{ fontSize: '24px', fontWeight: '600', color: '#fc3532' }}>Bingo</Typography>

                        </Box>
                        <Typography sx={{ fontSize: '16px', fontWeight: '600', marginTop: 3, color: '#e65c00' }}>Enter phone to continue</Typography>
                        <Box sx={{
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: '1px solid #e5e5e5', width: '95%', my: 2, textAlign: 'center',
                        }}>
                            <Typography className='text-black  mx-[auto!important] mt-[3px!important]  text-center' sx={{ fontSize: '14px!important' }}> +91 </Typography>
                            <input type="number" name="number" id="number"
                                style={{
                                    userSelect: 'none',
                                    width: '90%',
                                    height: '40px',
                                    borderLeft: '1px solid #e5e5e5',
                                }}
                                className='focus:outline-none px-2 border-none text-[14px] text-black bg-white'
                                placeholder='Enter Mobile Number'
                                autoFocus
                                value={number}
                                onChange={handleNumChange}
                                onClick={handleNumChange}
                            />
                        </Box>
                        <Button sx={{
                            display: displayForFirst ? 'block' : 'none', my: 2, boxShadow: 0, width: '96%', background: 'rgb(253, 55, 82)', color: 'white', padding: '8px 0px', textTransform: 'none',
                            '&:hover': {
                                background: 'rgb(253, 55, 82)', color: 'white',
                            }
                        }} onClick={forSecondButtonDisplay} type="submit">
                            Continue
                        </Button>
                        <Box sx={{ display: displayForSecond ? 'block' : 'none', margin: '0px auto', }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Typography sx={{ color: '#e65c00', fontSize: '14px', fontWeight: '600', textALign: 'start' }}>Enter OTP : </Typography>
                                {/* <Box sx={{ textAlign: 'center' }}>
                                    <Typography sx={{ pointerEvents: resendTime === 0 ? 'auto' : 'none', opacity: resendTime === 0 ? '1' : '0.6', cursor: resendTime === 0 ? 'pointer' : 'no-drop', fontSize: '16px', mr: 1, color: '#e65c00' }} onClick={() => onClickResend()}>
                                        Resend {
                                            resendTime === 0 ? null :
                                                <span>0:{resendTime < 10 ? `0${resendTime}` : resendTime}</span>
                                        }
                                    </Typography>
                                </Box> */}
                            </Box>
                            <Box sx={{ textAlign: "center" }}>
                                <input
                                    placeholder='OTP'
                                    type='number'
                                    onChange={e => handleOTPChange(e.target)}
                                    style={{
                                        userSelect: 'none',
                                        height: '40px',
                                        borderLeft: '1px solid #e5e5e5',
                                    }}
                                    className='w-full focus:outline-none px-2 border-none text-[14px] text-black bg-white'
                                />
                            </Box>
                            <Button sx={{
                                my: 2,
                                boxShadow: 0,
                                width: '96%',
                                background: 'rgb(253, 55, 82)',
                                color: 'white',
                                padding: '8px 0px',
                                textTransform: 'none',
                                '&:hover': {
                                    background: 'rgb(253, 55, 82)',
                                    color: 'white',
                                }
                            }} onClick={onclickOTPButton}>
                                Continue
                            </Button>
                        </Box>
                        <Typography sx={{ fontSize: '11px', position: 'absolute', textAlign: 'start', bottom: 25 }}>By continuing, you agree to the <a href="/housedeck-partner-(Terms-of-Use)" style={{ color: 'black', textDecoration: 'none', fontWeight: '700' }}> Terms & Conditions</a></Typography>
                    </div>
                </div>
            </div>
        </>
    );
}




