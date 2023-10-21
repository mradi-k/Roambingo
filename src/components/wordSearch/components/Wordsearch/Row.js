import Cell from "./Cell";


function Row({cells, row, onSelect, selectedCells, completedCells}){


    function isCellSelected(cells, row, cellIndex){
        const arr = cells.filter((cell)=>{
            return cell.row == row && cell.cell == cellIndex
        })
        return arr.length !== 0
    }

    function getCellCompletedDirection(cells, row, cellIndex){

        
        return cells.filter((cell)=>{
            return cell.row == row && cell.cell == cellIndex
        }).map((item)=>{
            return item.direction 
        })
    }

    const lineDirs = { 
        HORIZONTAL_NEG: "linear-gradient(0deg, transparent 25%, #1a8997 37%, #1a8997 63%, transparent 55%) 0",
        HORIZONTAL_POS: "linear-gradient(0deg, transparent 25%, #1a8997 37%, #1a8997 63%, transparent 55%) 0",
        VERTICAL_POS: "linear-gradient(90deg, transparent 25%, #1a8997 37%, #1a8997 63%, transparent 55%) 0",
        VERTICAL_NEG: "linear-gradient(90deg, transparent 25%, #1a8997 37%, #1a8997 63%, transparent 55%) 0",
        DIAGONAL_UP_NEG: "linear-gradient(45deg, transparent 25%, #1a8997 37%, #1a8997 63%, transparent 55%) 0",
        DIAGONAL_UP_POS: "linear-gradient(135deg, transparent 25%, #1a8997 37%, #1a8997 63%, transparent 55%) 0",
        DIAGONAL_DOWN_NEG: "linear-gradient(135deg, transparent 25%, #1a8997 37%, #1a8997 63%, transparent 55%) 0",
        DIAGONAL_DOWN_POS: "linear-gradient(45deg, transparent 25%, #1a8997 37%, #1a8997 63%, transparent 55%) 0"
   }

   function getLineDirections(index){
    if(!isCellSelected(completedCells, row, index)) return ""
       const directions = getCellCompletedDirection(completedCells, row, index)
       let linethroughs = "";
       if(directions.length  === 1) return lineDirs[directions[0]]
        for(let i = 0; i<directions.length; i++){
            
            linethroughs = [...linethroughs, lineDirs[directions[i]]]
        
        }
      return linethroughs.toString()
   }



    return <tr row={row}>
        {cells.map((letter, index)=>{
            return <Cell isSelected={isCellSelected(selectedCells, row,index)} isChecked={isCellSelected(completedCells, row, index)} linethroughs={getLineDirections(index)} row={row} cell={index} key={Math.random()} letter={letter} onSelect={onSelect}/>
        })}
    </tr>
}

export default Row;