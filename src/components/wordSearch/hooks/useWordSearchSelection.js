import { useState, useEffect, useRef } from 'react';

export default function useWordSearchSelection(grid, wordLocations){

    const selectedCellsRef = useRef([]) 
    const [selectedCells, setSelectedCells] = useState([])
    const [completedCells, setCompletedCells] = useState([])
    const [wordsRemaining, setWordsRemaining] = useState(wordLocations);
    
function clearGrid(){
    setSelectedCells([])
    setCompletedCells([])
    setWordsRemaining([])
}
    
function handleCellSelected(e,row,cell){

    const gridPos = {
      row,
      cell
    } 
  
    selectedCellsRef.current  = [...selectedCellsRef.current, gridPos]
    setSelectedCells(selectedCellsRef.current)
    if(selectedCellsRef.current.length >= 2){
      const selectedCells = validateCellSelection(selectedCellsRef.current)
      if(!selectedCells){
        setSelectedCells([])
        selectedCellsRef.current = []
        return;
      };
      const isWord = validateWordFromSelectedCells(selectedCells)
      if(isWord){
        setCompletedCells((prev)=>{
          return [...prev, ...selectedCells]
        })
  
      }
      setSelectedCells(selectedCells)
      setTimeout(() => {
        setSelectedCells([])
      }, 200);
      selectedCellsRef.current = []
  
    }
  }
  
  
  
  function validateWordFromSelectedCells(cells){
    const words = wordLocations.current.map((word)=>{
      return word.insertedWord
    })
    const lettersSelected = cells.map((cell)=>{
      return cell.letter;
    }).join("")
    const reversedLetters = lettersSelected.split("").reverse().join("")
  
    if(!words.includes(lettersSelected)){
  
      if(!words.includes(reversedLetters)){
        return false;
      }
  
    } 
  
  
    // check word is "complete" and not just part of another word e.g apple in pineapple should return false.
      // Each word should have an object attached corresponding to its id coordinates in the grid
  
      
      const selectedStartPos = cells[0]
  
  
        // return true
  
        //does wordLocations have a word that matches the selectedLetters
        const foundWord = wordLocations.current.find((word)=>{
          return word.insertedWord === lettersSelected || word.insertedWord === reversedLetters
        })
        if(!foundWord) return false
  
  
        // does the found word have a row and cell that match start pos?
        if(foundWord.row !== selectedStartPos.row && foundWord.cell !== selectedStartPos.cell) return false
  
  
        // does the selectedstartpos direction match the found word's direction?
        if(selectedStartPos.direction !== foundWord.dir) return false
  
        
  
    //Finally, remove the found word from the words remaining
    setWordsRemaining((prev)=>{
      return prev.filter((prevWord)=>{
        return prevWord.id !== foundWord.id
      })
    })
  
    return true;
  }
  
  
  function validateCellSelection(selection){
    const startPos = {
      row: selection[0].row, 
      cell: selection[0].cell}
    const endPos = {
      row: selection[1].row,
      cell: selection[1].cell}
    const vector = {
      row:endPos.row - startPos.row,
      cell:endPos.cell - startPos.cell
    }
    if(!getDirection(vector)){
      return;
    }
    const arr = getSelectedCells(((Math.max(Math.abs(vector.row), Math.abs(vector.cell))) + 1),startPos.row,startPos.cell,getDirection(vector))
    return arr
    
  }
  
  function getDirection(vector){
  
    if(vector.row === 0){
      if(vector.cell > 0) return "HORIZONTAL_POS"
      if(vector.cell < 0) return "HORIZONTAL_NEG"
    }
    if(vector.cell === 0){
      if(vector.row > 0) return "VERTICAL_POS"
      if(vector.row < 0) return "VERTICAL_NEG"
    }
    if(vector.row > 0){
      if(Math.abs(vector.row) !== Math.abs(vector.cell)) return;
      if(vector.cell > 0) return "DIAGONAL_DOWN_POS"
      if(vector.cell < 0) return "DIAGONAL_DOWN_NEG"
    }
    if(vector.row < 0){
      if(Math.abs(vector.row) !== Math.abs(vector.cell)) return;
      if(vector.cell > 0) return "DIAGONAL_UP_POS"
      if(vector.cell < 0) return "DIAGONAL_UP_NEG"
    }
    else {
      return
    }
  
  }
  
  
  function getSelectedCells(count, row, cell, dir){
  
  //Takes in the length required, and the position to start at, as well as the direction,
  //Returns the total cells that will be selected.
  
    const cells = []
    switch(dir){
      case "HORIZONTAL_POS":
        for(let i = 0; i < count; i++){
          cells.push({
            direction: dir,          
            letter: grid[row][cell+i],
            row: row,
            cell: cell+i
          })
        } 
        break;
        case "HORIZONTAL_NEG":
          for(let i = 0; i < count; i++){
            cells.push({
              direction: dir,
              letter: grid[row][cell-i],
              row: row,
              cell: cell-i
            })
          } 
          break;
      case "VERTICAL_POS":
        for(let i = 0; i < count; i++){
          cells.push({
            direction: dir,
            letter: grid[row+i][cell],
            row: row+i,
            cell: cell
          })
        } 
        break;
        case "VERTICAL_NEG":
          for(let i = 0; i < count; i++){
            cells.push({
              direction: dir,
              letter: grid[row-i][cell],
              row: row-i,
              cell: cell
            })
          } 
          break;
      case "DIAGONAL_UP_NEG":
                      //Handle word placement if diagonal up left 
        for(let i = 0; i < count; i++){
          cells.push({
            direction: dir,
            letter: grid[row-i][cell-i],
            row: row-i,
            cell: cell-i
          })
        } 
        break;
      case "DIAGONAL_UP_POS":
                //Handle word placement if diagonal up right 
                for(let i = 0; i < count; i++){
                  cells.push({
                    direction: dir,
                    letter: grid[row-i][cell+i],
                    row: row-i,
                    cell: cell+i
                  })
                } 
                break;
    
        case "DIAGONAL_DOWN_NEG":
          //Handle word placement if diagonal down left 
          for(let i = 0; i < count; i++){
            cells.push({
              direction: dir,
              letter: grid[row+i][cell-i],
              row: row+i,
              cell: cell-i
            })
          } 
          break;
        case "DIAGONAL_DOWN_POS":
          //Handle word placement if diagonal down right 
          for(let i = 0; i < count; i++){
            cells.push({
                direction: dir,
              letter: grid[row+i][cell+i],
              row: row+i,
              cell: cell+i
            })
          } 
          break;
    }
    return cells
    }

    return {wordsRemaining, setWordsRemaining, selectedCells, setSelectedCells, completedCells, setCompletedCells, handleCellSelected, clearGrid}
}