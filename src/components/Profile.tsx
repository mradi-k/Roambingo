import React from 'react'
import Header from './Header'
import Footer from './Footer'
import { LoginContext } from '../context/Context'
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';
import { PROFILE_PIC_UPDATE, PROFILE_UPDATE } from '../constants/data';
import axios from 'axios';


export default function Profile() {

  const { user, setMessage, setMessageType, decrypt, setShow, encrypt } = React.useContext(LoginContext)
  const [isEditing, setIsEditing] = React.useState(false)
  const [data, setData] = React.useState<any>({
    "name": user.name,
    "email": user.email,
    "gender": user.gender,
    "designation": user.designation,
    "company_name": user.company_name,
    "address": user.address,
    "profile_image": user.profile_image
  })

  function updateProfilePicture() {
    let input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.click()
    input.onchange = async (e: any) => {
      let file = e.target.files[0]
      let formdata = new FormData()
      formdata.append("profile_image", file);
      await axios.post(PROFILE_PIC_UPDATE, formdata, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': 'Bearer ' + user.token
        }
      })
      window.location.reload()
    }
  }

  function filldata(type: string, event: any) {
    if (type === 'name') {
      setData({ ...data, name: event.value })
      return
    }
    if (type === 'email') {
      setData({ ...data, email: event.value })
      return
    }
    if (type === 'gender') {
      setData({ ...data, gender: event.value })
      return
    }
    if (type === 'designation') {
      setData({ ...data, designation: event.value })
      return
    }
    if (type === 'cname') {
      setData({ ...data, company_name: event.value })
      return
    }
    if (type === 'address') {
      setData({ ...data, address: event.value })
      return
    }
  }

  function checkValidate() {
    if (!(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(data.email))) {
      setMessage('Invalid Email')
      setMessageType('error')
      setShow(true)
      return false
    }
    if (data.name.length < 3) {
      setMessage('Name should be atleast 3 characters')
      setMessageType('error')
      setShow(true)
      return false
    }
    if (data.address.length < 3) {
      setMessage('Address should be atleast 3 characters')
      setMessageType('error')
      setShow(true)
      return false
    }
    if (data.designation.length < 3) {
      setMessage('Designation should be atleast 3 characters')
      setMessageType('error')
      setShow(true)
      return false
    }
    if (data.company_name.length < 3) {
      setMessage('Company Name should be atleast 3 characters')
      setMessageType('error')
      setShow(true)
      return false
    }
    if (data.name.gender === 'null') {
      setMessage('Please select one from Gender Fields')
      setMessageType('error')
      setShow(true)
      return false
    }
    return true
  }

  async function profileDetailsUpdate() {
    if (checkValidate()) {
      try {
         await axios.post(PROFILE_UPDATE, encrypt({ ...data, email_verified: "1" }), {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + user.token
          }
        })
        window.location.reload()
      } catch (err) {
        // @ts-ignore
        const res = decrypt(err.response.data.result)
          setMessage(res.message)
          setMessageType('error')
          setShow(true)
          return
      }
    }
  }

  return (
    <>
      <Header />
      <div className='w-full  bg-[#f5f5f5]'>
        <div className='py-14 w-11/12  mx-auto flex justify-between items-start flex-col md:flex-row'>
          <div className='md:w-[30%] w-full border-[2px] border-solid border-[#E6E8EC] rounded-xl p-4 bg-white'>
            <div className='flex items-center justify-between flex-col'>
              {
                user.profile_image ?
                  <img
                    src={user?.profile_image}
                    alt='profile'
                    className='w-full h-auto my-3 rounded-[50%]'
                  />
                  :
                  <AccountCircleIcon sx={{ color: '#000000', fontSize: '200px', fontWeight: '600', }} />
              }
              <button onClick={updateProfilePicture} className="w-full py-2 rounded-sm bg-[#9c27b0] text-white">Update Profile Photo</button>
            </div>
          </div>
          <div className='md:w-[69%] w-full border-[2px] border-solid border-[#E6E8EC] rounded-xl p-4 bg-white'>

            <div className='flex justify-between items-center'>
              <p className='leading-[32px] text-[24px] font-[700] text-[#23262F]'>Information about you</p>
              {
                !isEditing ?
                  <button className='flex justify-between items-center bg-blue-600 rounded-full text-[#fff] px-3 py-2 font-[700]' onClick={() => setIsEditing(!isEditing)}>
                    <EditIcon className='mr-2' />
                    Edit
                  </button>
                  :
                  <button className='flex justify-between items-center bg-red-600 rounded-full text-[#fff] px-3 py-2 font-[700]' onClick={() => setIsEditing(!isEditing)}>
                    <CloseIcon className='mr-2' />
                    Cancel
                  </button>
              }
            </div>

            <label htmlFor="user-name" className='text-[#777E90] text-[12px] block  my-2 mt-4 font-[700] uppercase'>Username</label>
            {
              isEditing ?
                <input type="text" disabled value={user.username === null ? '' : user.username} name='user-name' className="input w-full text-[14px] text-black font-medium placeholder:font-normal placeholder:text-[#777E91] bg-white" style={{ borderColor: 'rgb(189, 189, 189)' }} />
                : <p className='text-[14px] font-[700] text-[#23262F] ml-4'>{user.username === null ? 'Not Provided Yet' : user.username}</p>
            }



            <label htmlFor="full-name" className='text-[#777E90] text-[12px] block  my-2 mt-4 font-[700] uppercase'>Name</label>
            {
              isEditing ?
                <input type="text" defaultValue={user.name === null ? '' : user.name} name='full-name' placeholder={`e.g. "John Doe"`} onChange={(e) => filldata("name", e.target)} className="input w-full text-[14px] text-black font-medium placeholder:font-normal placeholder:text-[#777E91] bg-white" style={{ borderColor: 'rgb(189, 189, 189)' }} />
                : <p className='text-[14px] font-[700] text-[#23262F] ml-4'>{user.name === null ? 'Not Provided Yet' : user.name}</p>
            }

            <label htmlFor="email" className='text-[#777E90] text-[12px] block my-4 font-[700] uppercase'>Email address</label>
            {
              isEditing ?
                <input type="email" name='email' defaultValue={user.email === null ? '' : user.email} placeholder={`e.g. "example@gmail.com"`} onChange={(e) => filldata("email", e.target)} className="input w-full text-[14px] text-black font-medium placeholder:font-normal placeholder:text-[#777E91] bg-white" style={{ borderColor: 'rgb(189, 189, 189)' }} />
                : <p className='text-[16px ] font-[700] text-[#23262F] ml-4'>{user.email === null ? 'Not Provided Yet' : user.email}</p>
            }

            <label htmlFor="gender" className='text-[#777E90] text-[12px] block my-4 font-[700] uppercase'>Gender</label>
            {
              isEditing ?
                <select className="select text-black font-medium bg-white select-bordered w-full" onChange={(e) => filldata("gender", e.target)} name="gender" style={{ borderColor: 'rgb(189, 189, 189)' }}>
                  <option value='null' className='text-black'>---Select--</option>
                  <option value='Male' className='text-black'>Male</option>
                  <option value='Female' className='text-black'>Female</option>
                  <option value='Others' className='text-black'>Others</option>
                  <option value='Choose Not to Specify' className='text-black'>Choose Not to Specify</option>

                </select>
                : <p className='text-[16px ] font-[700] text-[#23262F] ml-4'>{user.gender}</p>
            }

            <label htmlFor="company-name" className='text-[#777E90] text-[12px] block  my-2 mt-4 font-[700] uppercase'>Company Name</label>
            {
              isEditing ?
                <input type="text" defaultValue={user.company_name === null ? '' : user.company_name} name='company-name' placeholder={`e.g. "John Doe"`} onChange={(e) => filldata("cname", e.target)} className="input w-full text-[14px] text-black font-medium placeholder:font-normal placeholder:text-[#777E91] bg-white" style={{ borderColor: 'rgb(189, 189, 189)' }} />
                : <p className='text-[14px] font-[700] text-[#23262F] ml-4'>{user.company_name === null ? 'Not Provided Yet' : user.company_name}</p>
            }

            <label htmlFor="designation" className='text-[#777E90] text-[12px] block  my-2 mt-4 font-[700] uppercase'>Designation</label>
            {
              isEditing ?
                <input type="text" defaultValue={user.designation === null ? '' : user.designation} name='designation' placeholder={`e.g. "John Doe"`} onChange={(e) => filldata("designation", e.target)} className="input w-full text-[14px] text-black font-medium placeholder:font-normal placeholder:text-[#777E91] bg-white" style={{ borderColor: 'rgb(189, 189, 189)' }} />
                : <p className='text-[14px] font-[700] text-[#23262F] ml-4'>{user.designation === null ? 'Not Provided Yet' : user.designation}</p>
            }


            <label htmlFor="phone" className='text-[#777E90] text-[12px] block my-4 font-[700] uppercase'>Phone number</label>
            {
              isEditing ?
                <input type="text" disabled value={user.mobile_number === null ? '' : `+${user.mobile_number}`} name='phone' className="input w-full text-[14px] text-black font-medium placeholder:font-normal placeholder:text-[#777E91] bg-white" style={{ borderColor: 'rgb(189, 189, 189)' }} />
                : <p className='text-[16px ] font-[700] text-[#23262F] ml-4'>+{user.mobile_number}</p>
            }

            <label htmlFor="address" className='text-[#777E90] text-[12px] block my-4 font-[700] uppercase' >Address</label>
            {
              isEditing ?
                <input type="text" name='address' defaultValue={user.address === null ? '' : user.address} placeholder={`e.g. "1227, Saket, New Delhi - 110044, Delhi"`} onChange={(e) => filldata("address", e.target)} className="input w-full  text-[14px] text-black font-medium placeholder:font-normal placeholder:text-[#777E91] bg-white" style={{ borderColor: 'rgb(189, 189, 189)' }} />
                : <p className='text-[16px ] font-[700] text-[#23262F] ml-4'>{user.address === null ? 'Not Provided Yet' : user.address}</p>
            }
            {
              isEditing ?
                <div className='flex justify-center w-full items-center mt-10'>
                  <button onClick={profileDetailsUpdate} className='bg-[#1B454D] w-full mx-auto rounded-md text-[#FCFCFD] text-[16px] font-[700] px-4 py-3 flex justify-center items-center'>Save Changes</button>
                </div>
                : null
            }
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
