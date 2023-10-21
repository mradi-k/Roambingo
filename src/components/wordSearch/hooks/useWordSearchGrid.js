import { useState, useEffect, useRef } from 'react';

export default function useWordSearchGrid(words, gridSize, debugMode){


    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    const numCells = gridSize * gridSize;
    const [grid, setGrid] = useState([]);
    const wordsToInsert = useRef(words.map((word, index)=>{
      return {
        word,
        index
      }
    }))
    const wordLocations = useRef([])
    const usedWords = useRef([])
    const [loaded, setLoaded] = useState(false)

    function regenerateGrid(){
        setLoaded(false)
        wordLocations.current = []
        usedWords.current = []
        

        setGrid(()=>{
                
          const entireGrid = [];
          let gridRow = [];
          for(let i = 0; i < numCells; i++){
        
            gridRow.push("")
            if(gridRow.length === gridSize) 
            {
              entireGrid.push(gridRow);
              gridRow = [];
            }
        
          }
          
          return entireGrid;
        })

        
        
    }

    useEffect(() => {

        wordsToInsert.current = words.map((word, index)=>{
            return {
              word,
              index
            }
          })
          

          initWord();
      
    });
    
    

    function initWord(){


        const word = getNextWord();
    
    
        if(word === null) {
          //After all words have been added, fill remaining cells with random letters
    
          return addRandomLetters() === null ? addRandomLetters() : null
    
        };
    
        const wordToInsert = word.wordToInsert;
        const id = word.id
    
    
    
        //Handle automatic generation of the grid. 
          // Once a word is chosen, loop through every available cell.
          // On each iteration, run checks in each direction to validate/invalidate word placement.
          // Return this as an object with each directional boolean as a prop.
          // Finally, choose a random object from this list and a (true) direction to be used as the insertion position of the word.
          // If the returned list has no available spaces, but the word passed the pre-generation validation checks, clear all words, and restart the generation process   from the beginning.
        
          
          // Return the coordinates for the word to be inserted, as well as a direction.
          if(findWordInsertLocation(wordToInsert) === null) {
            regenerateGrid();
            return
          }
          const {row, cell, dir} = findWordInsertLocation(wordToInsert);
      
          
        insertWord(wordToInsert, row, cell, dir)
        const insertedWord = {
         id, insertedWord: wordToInsert, row, cell, dir
        }
        wordLocations.current = [...wordLocations.current, insertedWord]
    
    }

    function getNextWord(){

        const unusedWordIndexArr = wordsToInsert.current.map((word)=>{
          return word.index
        }).filter((wordIndex)=>{
          return !usedWords.current.includes(wordIndex)
        })
        if(unusedWordIndexArr.length === 0) return null
        usedWords.current = [...usedWords.current, unusedWordIndexArr[0]]
        
        return {
          id: unusedWordIndexArr[0],
          wordToInsert: wordsToInsert.current[unusedWordIndexArr[0]].word
        }
        
    }

    function findWordInsertLocation(wordToInsert){

        // Iterate through every cell in the grid and return a list of valid locations for the word to instantiate in, as well as its direction.
        const insertionPositions = grid.map((row, rowIndex)=>{
          return row.map((cell, cellIndex)=>{
            return {
              row: rowIndex,
              cell: cellIndex,
              directions:{
                // Only properties that evaluate to true will be returned.
                //spread operator is like a shorthand of Object.assign and have lower precedence than the && operator. It ignore value without property (boolean, null, undefined, number), and add all properties of the object after the ... in place. remember the && operator return the right value if true, or false otherwise. so if someCondition is true, {b : 5} will be passed to the ... operator, resulting in adding the property b to a with value 5. is someCondition is false, false will be passed to the ... operator. resulting in nothing added.
                ...(validateWordInsertion(wordToInsert, rowIndex, cellIndex, "HORIZONTAL_POS" ) && {HORIZONTAL_POS: true}),
                ...(validateWordInsertion(wordToInsert, rowIndex, cellIndex, "HORIZONTAL_NEG" ) && {HORIZONTAL_NEG: true}),
                ...(validateWordInsertion(wordToInsert, rowIndex, cellIndex, "VERTICAL_POS" ) && {VERTICAL_POS:true}), 
                ...(validateWordInsertion(wordToInsert, rowIndex, cellIndex, "VERTICAL_NEG" ) && {VERTICAL_NEG: true})
              }
            }
            
          }).filter((cell)=>{
            return Object.keys(cell.directions).length
          })
          
        
        }).filter((row)=>{
        return row.length > 0
        })
        
        //console.log("Grid insertion locations for word:", wordToInsert, insertionPositions)
        
        if(insertionPositions.length === 0) return null;
        
        const row = insertionPositions[Math.floor(Math.random() * insertionPositions.length)]
        const cell = row[Math.floor(Math.random() * row.length)]
        const directions = Object.keys(cell.directions);
        const dir = directions[Math.floor(Math.random() * directions.length)]
        return {
        row: cell.row,
        cell: cell.cell,
        dir
        }
    }

    function checkWordFits(word, row, cell, dir){

        const rowCount = grid.length; //The amount of rows in the grid..
        const rowLength = grid[row].length; //How many cells this row has..
        let sum;
        
        switch(dir){
          case "HORIZONTAL_POS":
              //Handle word placement if horizontal  
        
            
              // Add the length of the word to the cell index, if the word "fits", the sum will be <= the rowLength.
            
              sum = word.length + cell
            
              return sum <= rowLength ? true : false;
          case "HORIZONTAL_NEG":
              //Handle word placement if horizontal  
        
            
              // Subtract the length of the word from the cell index, if the word "fits", the sum will be >= 0.
            
              sum = cell - word.length
            
              return sum >= 0 ? true : false;
          case "VERTICAL_POS":
              //Handle word placement if vertical  
        
            
              // Add the length of the word to the row index, if the word "fits", the sum will be <= the rowCount.
            
              sum = word.length + row
            
              return sum <= rowCount ? true : false;
        
              case "VERTICAL_NEG":
                //Handle word placement if vertical  
        
              
                // Subtract the length of the word from the row index, if the word "fits", the sum will be >= 0.
              
                sum = row - word.length;
              
                return sum >= 0 ? true : false;
        
          case "DIAGONAL_UP_NEG":
              //Handle word placement if diagonal up left 
        
              // Subtract length of word from row. Must be >= 0. Subtract word length from cell, must be >= 0.
        
              sum = row - word.length;
              if(sum >= 0){
                sum = cell - word.length;
                if(sum >= 0){
                  return true
                }
              }
              return false
        
          case "DIAGONAL_UP_POS":
              //Handle word placement if diagonal up right
        
                // Subtract length of word from row. Must be >= 0. Add word length to cell, must be <= row length.
        
                sum = row - word.length;
                if(sum >= 0){
                  sum = word.length + cell;
                  if(sum <= rowLength){
                    return true
                  }
                }
                return false
        
              
        
              case "DIAGONAL_DOWN_NEG":
                //Handle word placement if diagonal down left 
                // Subtract length of word from the cell. Must be >= 0. Add word length to row, must be <= total rows.
        
                  sum = cell - word.length;
                  if(sum >= 0){
                    sum = row + word.length;
                    if(sum <= rowCount){
                      return true
                    }
                  }
                  return false
        
              case "DIAGONAL_DOWN_POS":
                //Handle word placement if diagonal down right 
                // Add length of word to both the row index and the cell index, sum must be <= both.
        
                sum = word.length + cell
                if(sum <= rowLength){
                  sum = word.length + row;
                  if(sum <= rowCount){
                    return true
                  }
                }
                return false

                default:
                  //Handle word placement if diagonal down right 
                  // Add length of word to both the row index and the cell index, sum must be <= both.
          
                  sum = word.length + cell
                  if(sum <= rowLength){
                    sum = word.length + row;
                    if(sum <= rowCount){
                      return true
                    }
                  }
                  return false
        }
        
    }

    function validateWordInsertion(word, row, cell, dir){

        if(!checkWordFits(word, row, cell, dir)) return false;
        
        const cellsToFill = getCellsToBeReplaced(word, row, cell, dir);
        
        let validated = true;
        let lettersOverwritten = 0;
        cellsToFill.forEach((item)=>{
        
          if(!isCellEmpty(item)){
        
            if(!isCellSame(item)){
              validated = false;
            }
            else{
              lettersOverwritten++;
              if(lettersOverwritten >= word.length-1){
                validated = false;
              }
            }
        
        
          }
        
        
          
        
        })
        return validated;
    }

    function insertWord(wordToInsert, row, cell, dir){



        switch(dir){
          case "HORIZONTAL_POS":
              //Handle word placement if horizontal  
        
              
              for(let i = 0; i < wordToInsert.length; i++){
              setGrid((prev)=>{
                return ([...prev.slice(0,row), [...prev[row].slice(0,cell+i), wordToInsert[i], ...prev[row].slice(cell+1+i)], ...prev.slice(row+1)])
              })
            }
        
            break;
          case "HORIZONTAL_NEG":
              //Handle word placement if horizontal  
        
              for(let i = 0; i < wordToInsert.length; i++){
              setGrid((prev)=>{
                return ([...prev.slice(0,row), [...prev[row].slice(0,cell-i), wordToInsert[i], ...prev[row].slice(cell+1-i)], ...prev.slice(row+1)])
              })
            }
        
            break;
        
        
          case "VERTICAL_POS":
              //Place letters vertically
              //Slice each row and replace one cell for every letter.
              for(let i = 0; i < wordToInsert.length; i++){
                setGrid((prev)=>{
             
                  return ([...prev.slice(0,row+i), [...prev[row+i].slice(0,cell), wordToInsert[i], ...prev[row+i].slice(cell+1)], ...prev.slice(row+1+i)])
        
              })
              }
            break;
            case "VERTICAL_NEG":
              //Handle word placement if vertical  
              //Place letters vertically
              //Slice each row and replace one cell for every letter.
              for(let i = 0; i < wordToInsert.length; i++){
                setGrid((prev)=>{
             
                  return ([...prev.slice(0,row-i), [...prev[row-i].slice(0,cell), wordToInsert[i], ...prev[row-i].slice(cell+1)], ...prev.slice(row+1-i)])
        
              })
              }
            break;
          case "DIAGONAL_UP_NEG":
              //Handle word placement if diagonal up left 
              //Slice each row and replace one cell for every letter. Decrement row, decrement cell.
              for(let i = 0; i < wordToInsert.length; i++){
                setGrid((prev)=>{
             
                  return ([...prev.slice(0,row-i), [...prev[row-i].slice(0,cell-i), wordToInsert[i], ...prev[row-i].slice(cell+1-i)], ...prev.slice(row+1-i)])
        
              })
              }
        
            break;
        
          case "DIAGONAL_UP_POS":
              //Handle word placement if diagonal up right
                //Slice each row and replace one cell for every letter. Decrement row, increment cell.
                for(let i = 0; i < wordToInsert.length; i++){
                  setGrid((prev)=>{
               
                    return ([...prev.slice(0,row-i), [...prev[row-i].slice(0,cell+i), wordToInsert[i], ...prev[row-i].slice(cell+1+i)], ...prev.slice(row+1-i)])
        
                })
                }
        
              break;
        
            case "DIAGONAL_DOWN_NEG":
              //Handle word placement if diagonal down left 
              //Place letters diagonally right
              //Slice each row and replace one cell for every letter. Increment both cell and row.
              for(let i = 0; i < wordToInsert.length; i++){
                setGrid((prev)=>{
             
                  return ([...prev.slice(0,row+i), [...prev[row+i].slice(0,cell-i), wordToInsert[i], ...prev[row+i].slice(cell+1-i)], ...prev.slice(row+1+i)])
        
              })
              }
        
            break;
            case "DIAGONAL_DOWN_POS":
              //Handle word placement if diagonal down right 
              //Place letters diagonally right
              //Slice each row and replace one cell for every letter. Increment both cell and row.
              for(let i = 0; i < wordToInsert.length; i++){
                setGrid((prev)=>{
             
                  return ([...prev.slice(0,row+i), [...prev[row+i].slice(0,cell+i), wordToInsert[i], ...prev[row+i].slice(cell+1+i)], ...prev.slice(row+1+i)])
        
              })
              }
        
            break;
            default:
              //Handle word placement if diagonal down right 
              //Place letters diagonally right
              //Slice each row and replace one cell for every letter. Increment both cell and row.
              for(let i = 0; i < wordToInsert.length; i++){
                setGrid((prev)=>{
             
                  return ([...prev.slice(0,row+i), [...prev[row+i].slice(0,cell+i), wordToInsert[i], ...prev[row+i].slice(cell+1+i)], ...prev.slice(row+1+i)])
        
              })
              }
        
            break;
        }
        
    }

    function getCellsToBeReplaced(word, row, cell, dir){

        const cells = []
        switch(dir){
          case "HORIZONTAL_POS":
            for(let i = 0; i < word.length; i++){
              cells.push({
                letter: word[i],
                row: row,
                cell: cell+i
              })
            } 
            break;
            case "HORIZONTAL_NEG":
              for(let i = 0; i < word.length; i++){
                cells.push({
                  letter: word[i],
                  row: row,
                  cell: cell-i
                })
              } 
              break;
          case "VERTICAL_POS":
            for(let i = 0; i < word.length; i++){
              cells.push({
                letter: word[i],
                row: row+i,
                cell: cell
              })
            } 
            break;
            case "VERTICAL_NEG":
              for(let i = 0; i < word.length; i++){
                cells.push({
                  letter: word[i],
                  row: row-i,
                  cell: cell
                })
              } 
              break;
          case "DIAGONAL_UP_NEG":
                          //Handle word placement if diagonal up left 
            for(let i = 0; i < word.length; i++){
              cells.push({
                letter: word[i],
                row: row-i,
                cell: cell-i
              })
            } 
            break;
          case "DIAGONAL_UP_POS":
                    //Handle word placement if diagonal up right 
                    for(let i = 0; i < word.length; i++){
                      cells.push({
                        letter: word[i],
                        row: row-i,
                        cell: cell+i
                      })
                    } 
                    break;
        
            case "DIAGONAL_DOWN_NEG":
              //Handle word placement if diagonal down left 
              for(let i = 0; i < word.length; i++){
                cells.push({
                  letter: word[i],
                  row: row+i,
                  cell: cell-i
                })
              } 
              break;
            case "DIAGONAL_DOWN_POS":
              //Handle word placement if diagonal down right 
              for(let i = 0; i < word.length; i++){
                cells.push({
                  letter: word[i],
                  row: row+i,
                  cell: cell+i
                })
              } 
              break;
              default:
                //Handle word placement if diagonal down right 
                for(let i = 0; i < word.length; i++){
                  cells.push({
                    letter: word[i],
                    row: row+i,
                    cell: cell+i
                  })
                } 
                break;
        }
        return cells
    }
        
    function isCellEmpty(cell){
    return grid[cell.row][cell.cell] === "" ? true : false;
    }
    
    function isCellSame(cell){
    return grid[cell.row][cell.cell] === cell.letter ? true : false;
    }

    function getRandomLetter(){
        return debugMode ? " " : alphabet[Math.floor(Math.random()*alphabet.length)];
    }

    function addRandomLetters(){

        const remainingCells = grid.map((row)=>{
          return row.filter((cell)=>{
            return cell === ""
          })
        }).filter((row)=>{
          return row.length !== 0;
        })
      
        if(remainingCells.length === 0){
          setLoaded(true)
          return null
        }
      
       setGrid((prev) => {
        return prev.map((row)=>{
          return row.map((cell)=>{
            return cell || getRandomLetter()
          })
        })
       }) 
      
    }





    return {grid, wordLocations, regenerateGrid, loaded, setLoaded}
}