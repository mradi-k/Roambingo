import useWordSearch from '../hooks/useWordSearch';
import React, { useEffect } from 'react'
import Grid from './Wordsearch/Grid'
import axios from 'axios';
import { API_BASE_URL } from '../../../constants/data';
import { LoginContext } from '../../../context/Context';


export default function Wordsearch2({ answerWords, setCompleted, currentLevel, data, b }) {
  const { user, decrypt, encrypt } = React.useContext(LoginContext);
  const wordList = [
    { id: 1, name: "Fruits", words: answerWords },
  ]

  const lastApiCall = React.useRef(() => { })

  lastApiCall.current = async () => {
    const collection = {
      destination_id: data.game_levels[currentLevel].destination_id,
      game_id: data.game_levels[currentLevel].game_id,
      level: data.game_levels[currentLevel].level,
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

  const gridSize = 10
  const {
    grid,
    wordLocations,
    setWordsRemaining,

    selectedCells,
    completedCells,
    handleCellSelected,
  } = useWordSearch(gridSize, wordList);


  useEffect(() => {
    setWordsRemaining(wordLocations)
    
  }, [grid, setWordsRemaining, wordLocations]);

  useEffect(() => {
    const joined = answerWords.join("");
    if (joined.length === completedCells.length) {
      lastApiCall.current()
    }
  }, [completedCells,answerWords])

  return (
    <>
      <Grid grid={grid} selectedCells={selectedCells} completedCells={completedCells} onSelect={handleCellSelected} />
    </>

  )
}
