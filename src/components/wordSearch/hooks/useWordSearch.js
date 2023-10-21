import { useState, useEffect, useRef } from 'react';
import useWordSearchWords from './useWordSearchWords'
import useWordSearchGrid from './useWordSearchGrid';
import useWordSearchSelection from './useWordSearchSelection';

export default function useWordSearch(gridSize, wordList){

  const debugMode = true;
  // console.log(gridSize, wordList);

const {
  handleDropdownChange, 
  chosenList, 
  words,
  regenerateWords
} = useWordSearchWords(
    wordList,
    gridSize, 
    handleRegenerateGrid);

const {
  grid, 
  regenerateGrid, 
  wordLocations,
  loaded
} = useWordSearchGrid(
    words, 
    gridSize,
    debugMode)

const {
  wordsRemaining,
  setWordsRemaining,
  selectedCells,
  completedCells,
  clearGrid,
  handleCellSelected,
} = useWordSearchSelection(grid, wordLocations)


function handleRegenerateGrid(){
  clearGrid();
  regenerateWords();
  regenerateGrid();
}


return {
  grid, 
  chosenList,
  wordLocations: wordLocations.current, 
  wordsRemaining, 
  setWordsRemaining, 
  selectedCells, 
  completedCells, 
  handleCellSelected, 
  handleRegenerateGrid, 
  handleDropdownChange, 
  loaded}


}