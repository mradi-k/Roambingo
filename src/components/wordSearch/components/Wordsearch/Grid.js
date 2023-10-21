import Row from './Row'
import styles from '../wordsearch.module.css'

export default function Grid({grid, selectedCells, completedCells, onSelect}){

    return  <div className={styles.grid}>
    <table  style={{marginTop: "20px"}} className={`${styles.box} ${styles.table}`}> 
      <tbody>

      {grid.map((arr, index)=>{    

        return <Row key={Math.random()} selectedCells={selectedCells} completedCells={completedCells} cells={arr} row={index} onSelect={onSelect}/>

      })}

      </tbody>
    </table>



</div>
}