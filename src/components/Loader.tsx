import React from 'react'
import PulseLoader from "react-spinners/PulseLoader";
import { LoginContext } from "../context/Context";

export default function Loading() {
    return (
        <div className='w-full h-screen fixed z-[10000] top-0 left-0 flex justify-center items-center'>
            <div className="flex justify-center items-center flex-col">
                <PulseLoader color='#f5af19' loading={true} speedMultiplier={1} />
                <p className='text-[#f5af19] my-2'>Loading...</p>
            </div>
        </div>
    )
}

export function Loading2() {
    const { loading } = React.useContext(LoginContext)
    return (
        <>
            {
                loading &&
                <div className='w-full h-screen fixed z-[10000] top-0 left-0 flex justify-center items-center'>
                    <div className="flex justify-center items-center flex-col">
                        <PulseLoader color='#f5af19' loading={true} speedMultiplier={1} />
                        <p className='text-[#f5af19] my-2'>Loading...</p>
                    </div>
                </div>
            }
        </>
    )
}