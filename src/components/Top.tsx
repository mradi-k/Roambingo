

export default function Top({ text, headtext, img }: any) {
    return (
        <>
            <div className='md:w-10/12 w-11/12 mx-auto my-6 flex justify-between items-center md:flex-row flex-col'>
                <div>
                <p className='text-red-500 text-[32px] md:text-[60px]' >
                    {headtext}
                </p>
                <p className='text-blue-700 text-[20px] md:text-[28px]' >
                    {text}
                </p>
                </div>
                <img src={img} alt={text} className='w-11/12 md:w-1/2' />
            </div>
     

        </>
    )
}

