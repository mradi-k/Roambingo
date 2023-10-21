
import React, { useEffect } from 'react';
import '../styles/word-search.css';
import { NavLink, useParams } from 'react-router-dom';
import axios from "axios";


import Wordsearch from '../components/wordSearch/components/Wordsearch'
import { LoginContext } from '../context/Context';
import { API_BASE_URL } from '../constants/data';
import Header from './Header';
import Footer from './Footer';
import Loading from './Loader';
// @ts-ignore
import timeicon from '../assets/timeicon.png';
import Complete from './Complete';

export default function WordSearch() {

  const { user, setLoading, decrypt, setMessageType, setMessage, setShow } = React.useContext<any>(LoginContext);

  const [answerWords, setAnswerWords] = React.useState<any>([]);

  const [data, setData] = React.useState<any>(null);
  const { destination } = useParams<any>();
  const [currentLevel, setCurrentLevel] = React.useState(0);
  const [completed, setCompleted] = React.useState(false);


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
    let { data } = await axios.get(`${API_BASE_URL}game/${destination}/word-search`, {
      headers: {
        'Authorization': 'Bearer ' + user.token,
      },
    });
    data = decrypt(data.result)
    if (!data.isError) {
      setData(data.modal);
      const level = parseInt(data.modal.game_levels.filter((item: any) => item.level_completed_status === false)[0].level) - 1
      setCurrentLevel(level)
      const words = data.modal.game_levels[level].questions.map((item: any) => item.question_correct_answer)
      setAnswerWords(words)
      startWatch.current();
      setLoading(false)
    }
    else {
      setMessageType('error')
      setMessage('Something went wrong. Please try again later.')
      setShow(true)
    }
    console.log(data);
    
  }
  React.useEffect(() => {
    ApiCall.current()
  }, [])




  

  return (
    <>
      <Header />
      <div className='w-full  bg-[#f5f5f5]'>
        {
          data ?
            data.game_completed_status ?

              <div className="fixed z-[10000] w-full h-screen top-0 left-0 bg-[#2f2f8f] flex justify-center items-center">
                <p className="px-10 py-4 bg-red-500 text-white text-[18px]">You have already Completed this level. <NavLink to={`/destination/${destination}`} className="underline hover:text-yellow-400">Go Back</NavLink>  </p>
              </div>

              :
              <div className="tscontainer">
                <div className="main-ping w-[95%] md:w-[35%] bg-white p-[10px]" style={{ border: '1px solid rgba(0, 0, 0, 0.175)', borderRadius: 20, }}>
                  <img src={data.game_levels[currentLevel].level_image} alt={data.game_detail.game_name} style={{ width: '100%', borderRadius: 20 }} />
                  <p className="text-black text-[18px] font-bold mx-auto w-fit my-2">Find the Words </p>
                  <br />

                  {
                    completed ?
                      <Complete message="You have completed this level." link={`/destination/${destination}/game/word-search`} btText='Next Level' />
                      :

                      <div className="point-level"  style={{height:"75vh", overflowY:'auto'}}>
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
                          Level : <span className="font-bold">{currentLevel+1}</span>
                        </h2>

                        <h2 className='left-subheading text-start flex text-black justify-start ' style={{ marginRight: '10px', alignItems: 'center' }}>
                          Maximum Points : <span className="font-bold">{data.game_levels[0].max_point}</span>
                        </h2>

                        <h2 className='left-subheading text-start flex text-black justify-start ' style={{ marginRight: '10px', alignItems: 'center' }}>
                          Minimum Points : <span className="font-bold">{data.game_levels[0].min_point}</span>
                        </h2>
                        {
                          data.game_levels[currentLevel].questions.map((item: any, index: number) => {
                            return (
                              <div className='w-11/12 text-start text-black text-[14px] my-2' key={index}>
                                <p className='font-bold '>{item.question_title}</p>
                                <div className='flex items-center' >
                                  {
                                    item.question_option.map((item: any, index: number) => {
                                      return (
                                        <p key={index} className='mx-2'>{index + 1 + ". " + item}</p>
                                      )
                                    })
                                  }
                                </div>
                              </div>
                            )
                          })
                        }
                      </div>
                  }
                </div>
                <Wordsearch answerWords={answerWords} setCompleted={setCompleted} b={b} data={data} currentLevel={currentLevel}  />
              </div>
            : <Loading />
        }
      </div >
      <Footer />

    </>
  );
}
