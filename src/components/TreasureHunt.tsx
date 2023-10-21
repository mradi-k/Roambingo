
// @ts-nocheck
import React from "react";
import "../styles/ping-container.css";
import Header from './Header';
import Footer from './Footer';
import { API_BASE_URL } from '../constants/data';
import axios from "axios";
//@ts-ignore
import timeicon from '../assets/timeicon.png';


import { useParams } from "react-router-dom";
import { LoginContext } from "../context/Context";
import Loading from "./Loader";
import Complete from "./Complete";


export default function TreasureHunt() {

    const { user, setLoading, decrypt, encrypt, setMessageType, setMessage, setShow } = React.useContext<any>(LoginContext);

    const [data, setData] = React.useState(null);
    const [completed, setCompleted] = React.useState(false);
    const [destMoved, setDestMoved] = React.useState(0);

    const { destination } = useParams<any>();


    const ApiCall = React.useRef(() => { })
    // stopwatch
    let sec: number = 0
    let min: number = 0
    const [a, setA] = React.useState(0);
    const [b, setB] = React.useState(0);
    const startWatch = React.useRef<any>(null)

    startWatch.current = () => {
        setInterval(() => {
            if (sec === 59) {
                min += 1
                sec = 0
            } else {
                sec += 1
            }
            setA(sec)
            setB(min)

        }, 1000);
    }







    ApiCall.current = async () => {
        setLoading(true)
        let { data } = await axios.get(`${API_BASE_URL}game/${destination}/treasure-hunt`, {
            headers: {
                'Authorization': 'Bearer ' + user.token,
            },
        });
        data = decrypt(data.result)
        if (!data.isError) {
            setData(data.modal);
            startWatch.current();
            setLoading(false)
        }
        else {
            setMessageType('error')
            setMessage('Something went wrong. Please try again later.')
            setShow(true)
        }
    }
    React.useEffect(() => {
        ApiCall.current()
    }, [])



    async function lastApiCall() {
        const collection: any = {
            destination_id: data.game_levels[0].destination_id,
            game_id: data.game_levels[0].game_id,
            level: data.game_levels[0].level,
            level_complete_timing: b
        }


        let response = await axios.post(`${API_BASE_URL}game/level/save`, encrypt(collection), {
            headers: {
                'Authorization': 'Bearer ' + user.token,
                'Content-Type': 'text/plain'
            },
        });
        response = decrypt(response.data.result)
        if (!response.isError) {
            setCompleted(true)
        }
    }

    const handleDragStart = (event: any, id: number) => {
        event.dataTransfer.setData("id", id);
    };

    const handleDragOver = (event: any) => {
        event.preventDefault();
    };
    function getOffset(el: any) {
        const rect = el.getBoundingClientRect();
        return {
            left: rect.left,
            top: rect.top
        };
    }

    const [element, SetElement] = React.useState('')

    function atTouch(event: any) {
        SetElement(event.target.classList[0])
    }

    function atEndTouch(event: any) {
        const positionId = event.target.id
        if (element === positionId) {
            const ping = data.game_levels[0].positions.find((ping) => ping.name.replace(/ /g, "-") === element);
            const position = data.game_levels[0].positions.find((position) => position.name.replace(/ /g, "-") === positionId);
            let displaceElement = getOffset(document.getElementById(positionId))
            let displaceParent = getOffset(document.getElementsByClassName(`pingContainer-${positionId}`)[0])
            if (ping && position) {
                setDestMoved(destMoved + 1)
                ping.x = displaceElement.left - displaceParent.left + 0.5;
                ping.y = displaceElement.top - displaceParent.top + 0.5;
            }
        }
        if (destMoved === data.game_levels[0].positions.length - 1) {
            lastApiCall();
            clearInterval(startWatch.current);
        }
    };


    const handleDrop = (event: any, positionId: number) => {
        const id = event.dataTransfer.getData("id");
        if (id === positionId) {
            const ping = data.game_levels[0].positions.find((ping) => ping.name.replace(/ /g, "-") === id);
            const position = data.game_levels[0].positions.find((position) => position.name.replace(/ /g, "-") === positionId);
            let displaceElement = getOffset(document.getElementById(positionId))
            let displaceParent = getOffset(document.getElementsByClassName(`pingContainer-${positionId}`)[0])
            if (ping && position) {
                setDestMoved(destMoved + 1)
                ping.x = displaceElement.left - displaceParent.left + 0.5;
                ping.y = displaceElement.top - displaceParent.top + 0.5;
            }
        }
        if (destMoved === data.game_levels[0].positions.length - 1) {
            lastApiCall();
            clearInterval(startWatch.current);
        }
    };

    return (
        <>
            <Header />
            <div className='w-full  bg-[#f5f5f5]'>
                {
                    data ?
                        data.game_completed_status ?

                            <div className="fixed z-[10000] w-full h-screen top-0 left-0 bg-[#2f2f8f] flex justify-center items-center">
                                <p className="px-10 py-4 bg-red-500 text-white text-[18px]">You have already Completed this game. <a href={`/destination/${destination}`} className="underline hover:text-yellow-400">Go Back</a>  </p>
                            </div>

                            :
                            <div className="tscontainer"  >
                                <div className="main-ping w-[95%] md:w-[25%] bg-white p-[10px]" style={{  border: '1px solid rgba(0, 0, 0, 0.175)', borderRadius: 20,}}>
                                    <img src={data.game_detail.image_path} alt={data.game_detail.game_name} style={{ width: '100%', borderRadius: 20 }} />
                                    <p className="text-black">Drag and drop the destinations to correct places </p>
                                    <div className="placeContainer" >
                                        {data.game_levels[0].positions.map((ping: any) => (
                                            <div key={ping.name.replace(/ /g, "-")} className={`pingContainer-${ping.name.replace(/ /g, "-")} pingContainer`} style={{ position: 'relative', margin: '10px' }}>
                                                <img src={ping.icon} alt={ping.name} draggable
                                                    onDragStart={(event) => handleDragStart(event, ping.name.replace(/ /g, "-"))}
                                                    style={{ left: ping.x, top: ping.y, zIndex: completed ? 0 : 100 }}
                                                    onTouchStart={e => atTouch(e)}
                                                    className={`${ping.name.replace(/ /g, "-")} ping`} />
                                            </div>
                                        ))}
                                    </div>
                                    <br />

                                    {
                                        completed ?
                                            <Complete message="You have completed the level" link={`/destination/${destination}`} />
                                            :
                                            <>
                                                <div className="point-level">
                                                    <h2 className='left-subheading text-start flex justify-start text-black ' style={{ marginRight: '10px', alignItems: 'center' }}>
                                                        <img src={timeicon} alt='clock' style={{ width: "40px", marginLeft: "-10px" }} />
                                                        <p id="mins" style={{ paddingTop: 3, marginBottom: 0, fontWeight: "700" }}>
                                                            {b / 10 >= 1 ? b : "0" + b}
                                                        </p>
                                                        :
                                                        <p id="sec" style={{ paddingTop: 3, marginBottom: 0, fontWeight: "700" }}>
                                                            {a / 10 >= 1 ? a : "0" + a}
                                                        </p>
                                                    </h2>
                                                    <h2 className='left-subheading text-start flex text-black justify-start ' style={{ marginRight: '10px', alignItems: 'center' }}>
                                                        Level : <span className="font-bold">{data.game_levels[0].level}</span>
                                                    </h2>
                                                </div>
                                                <div className="point-level">
                                                    <h2 className='left-subheading text-start flex text-black justify-start ' style={{ marginRight: '10px', alignItems: 'center' }}>
                                                        Maximum Points : <span className="font-bold">{data.game_levels[0].max_point}</span>
                                                    </h2>

                                                    <h2 className='left-subheading text-start flex text-black justify-start ' style={{ marginRight: '10px', alignItems: 'center' }}>
                                                        Minimum Points : <span className="font-bold">{data.game_levels[0].min_point}</span>
                                                    </h2>
                                                </div>
                                            </>
                                    }

                                </div>

                                <div className="imgcontainer my-4 lg:my-1">
                                    <img src={data.game_levels[0].position_image} alt="map" style={{
                                        width: "100%",
                                        border: '1px solid #000',
                                        zIndex: -1,
                                    }} />
                                    {data.game_levels[0].positions.map((position: any) => (
                                        <div
                                            key={position.name.replace(/ /g, '-')}
                                            id={position.name.replace(/ /g, '-')}
                                            onDragOver={handleDragOver}
                                            onTouchStart={e => atEndTouch(e)}
                                            onDrop={(event) => handleDrop(event, position.name.replace(/ /g, '-'))}
                                            style={{ left: `${position.left}%`, top: `${position.top}%` }}
                                            className="dropPosition"
                                        />
                                    ))}
                                </div>
                            </div>

                        : <Loading />
                }
            </div>
            <Footer />
        </>

    );
};




