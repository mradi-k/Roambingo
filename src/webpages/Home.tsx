import React from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'

import '../styles/destinations.css'
import { DESTINATION_LIST} from '../constants/data'
import axios from 'axios'
import { LoginContext } from '../context/Context'
import Loading from '../components/Loader'
import { NavLink } from 'react-router-dom'

export default function Home() {

    const { setMessage, setMessageType, setShow, setLoading,  decrypt, user,  } = React.useContext(LoginContext)

    const [data, setData] = React.useState<any>(null)

    const ApiCall = React.useRef(() => { })


    ApiCall.current = async function () {
        setLoading(true)
        try{
            localStorage.removeItem('destination-points')
        }
        catch(e){}
        let { data } = await axios.get(DESTINATION_LIST, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': 'Bearer ' + user.token
            }
        })
        data = decrypt(data.result)
        if (!data.isError) {
            setData(data.modal)
            setLoading(false)
        }
        else {
            setLoading(false)
            setMessage('Something Went Wrong. Please Try again Later')
            setMessageType('error')
            setShow(true)
        }
        return
    }

  
    React.useEffect(() => {
        ApiCall.current()
    }, [])

    return (
        <>
            <Header />
            <div className='w-full lg:h-[80vh] bg-[#f5f5f5]'>
                <div className='py-14 w-11/12 md:w-10/12 mx-auto'>
                    <p className='text-black text-[20px] md:text-[28px] font-[600] leading-6 '>Destinations</p>
                    <div className='my-6 mx-auto' style={{
                        display: 'grid',
                        gap: '1rem',
                        gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,250px),1fr))',
                    }}>
                        {
                            !data ? <Loading />
                                : data.map((item: any, idx: number) => {
                                    return (
                                        <NavLink key={idx} to={`/destination/${item.slug}`}>
                                            <div className='w-full h-[200px] duration-150 ease-in text-center pt-8 rounded-md cursor-pointer bg-shadow' style={{
                                                backgroundImage: `url(${item.image_path})`,
                                                backgroundSize: 'cover',
                                                backgroundPosition: 'center',
                                                backgroundRepeat: 'no-repeat',
                                            }}>
                                                <p className='text-[18px] text-black font-[700] '>{item.name}</p>
                                            </div>
                                        </NavLink>
                                    )
                                })
                        }
                    </div>
                </div>
            </div>
            <Footer />
        </>
    )
}
