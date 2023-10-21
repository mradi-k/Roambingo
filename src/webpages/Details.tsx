import React from 'react'
import { NavLink, useParams } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { API_BASE_URL, DESTINATION_DETAILS } from '../constants/data'
import axios from 'axios'
import { LoginContext } from '../context/Context'
import Loading from '../components/Loader'

export default function Details() {
  const { destination } = useParams()
  const { user, decrypt, setMessage, encrypt, setMessageType, setShow, setLoading } = React.useContext(LoginContext)

  const [data, setData] = React.useState<any>(null)

  const ApiCall = React.useRef(() => { })


  ApiCall.current = async function () {
    setLoading(true)
    let { data } = await axios.get(DESTINATION_DETAILS + destination, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': 'Bearer ' + user.token
      }
    })
    data = decrypt(data.result)
    if (!data.isError) {
      localStorage.setItem('destination-points', JSON.stringify(data.modal.destination_points))
      localStorage.setItem('destination-id', JSON.stringify(data.modal.id))
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

  async function destinationEarn(id: number, file_id: number = 0) {
    let collections: any;
    if (id === 4 || id === 3) {
      collections = {
        destination_id: data.id,
        type: id
      }
    }
    else {
      collections = {
        destination_id: data.id,
        type: id,
        destination_brochure_id: file_id
      }
    }
    let response = await axios.post(`${API_BASE_URL}destination/earn/point`, encrypt(collections), {
      headers: {
        'Authorization': 'Bearer ' + user.token,
      },
    });
    const res = decrypt(response.data.result)
    if (!res.isError) {
      if (res.message === 'Already Added point!') {
        setMessage('Already Added point!')
        setMessageType('info')
      }
      else {
        setMessage('You recieved points for this activity')
        setMessageType('success')
      }
      setShow(true)
    }
  }

  React.useEffect(() => {
    ApiCall.current()
  }, [])

  // console.log(data);
  

  return (
    <>
      <Header />
      <div className='w-full  bg-[#f5f5f5]'>
        {
          !data ? <Loading /> :
            <>
              {
                data.banner_path && (
                  <div className='w-full h-[400px]' style={{
                    background: `url(${data.banner_path}) no-repeat center center / cover`,
                  }}></div>
                  // <img src={data.banner_path} alt={`${data.name} Banner`} className='w-full' />
                )
              }
              <div className='pt-14 pb-6 w-11/12 md:w-10/12 flex flex-col md:flex-row justify-start items-start mx-auto'>
                {
                  data.description_img_vid_path && data.description_img_vid_file_type && (
                    <video width="400" className='w-full md:w-[49%]' controls onClick={() => destinationEarn(4)} onTouchStartCapture={() => destinationEarn(4)}>
                      <source src={data.description_img_vid_path} type={`video/mp4`} />
                      Your browser does not support HTML video.
                    </video>
                  )
                }

                <div className='md:ml-4 md:w-1/2 w-11/12 my-2 md:my-0'>
                  <p className='text-black text-[20px] md:text-[24px] font-[600] leading-6 '>About {data.name}</p>
                  <p className='text-black opacity-90 my-2 text-[18px] font-[400] leading-6 '>{data.description}</p>
                  <div className='flex justify-start items-center my-6'>
                    {
                      data.destination_files ?
                        data.destination_files.map((item: any, idx: number) => {
                          return (
                            <NavLink key={idx} rel="noreferrer" to={item.file_path} onClick={() => destinationEarn(6, item.id)} target='_blank' download={data.title + "-" + data.title + ".pdf"}>
                              <img src={item.file_type === 'pdf' ? require('../assets/pdf.png') : require('../assets/xls.png')} alt={data.title} className='w-[50px] mx-2' /> </NavLink>
                          )
                        })
                        : null
                    }
                  </div>
                </div>
              </div>
              <div className='w-11/12 md:w-10/12 mx-auto  md:mt-8'>
                <p className='text-black text-[20px] md:text-[28px] font-[600] leading-6 '>Games Available</p>
                <div className='my-6 mx-auto ' style={{
                  display: 'grid',
                  gap: '1rem',
                  gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,250px),1fr))',
                }}>
                  {
                    !data.destination_games ? 'No Games Available' :
                      data.destination_games.map((item: any, idx: number) => {
                        return (
                          <div key={idx} className="w-full h-auto ">
                            <p className={`text-[18px] w-full py-3 text-black my-1 rounded-t-md text-center font-[400]  ${item.game_point ? "" : "opacity-0"}`}> {item.game_point ? `You Won ${item.game_point} Points` : "You Won 0 Points"} </p>
                            <p className='text-[18px] w-full py-3 text-white bg-[#312f92] rounded-t-md text-center font-[700] '>{item.game_name}</p>
                            <img src={item.game_image_path} alt="jigsaw" className='h-[150px] w-full ' />
                            {
                              !item.game_completed_level && item.is_play ?
                                <NavLink to={`/destination/${destination}/game/${item.game_slug}`} className='text-[18px]  block w-full py-3 text-white bg-[#fc3532] rounded-b-md text-center font-[700] '>Play Now</NavLink>
                                : item.game_completed_level && item.is_play ?
                                  <p className='text-[18px] cursor-pointer block w-full py-3 text-white bg-[#fc3532] rounded-b-md text-center font-[700] '> Completed</p>
                                  : !item.game_completed_level && !item.is_play ?
                                    <p className='text-[18px] cursor-pointer block w-full py-3 text-white bg-[#fc3532] rounded-b-md text-center font-[700] '> Complete Previous Game</p> :
                                    null
                            }
                          </div>
                        )
                      })
                  }
                </div>
              </div>
            </>
        }
      </div>
      <Footer />
    </>
  )
}
