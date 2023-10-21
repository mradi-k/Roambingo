import Dropdown from "./Dropdown"
import Button from "./Button";
import styles from "../wordsearch.module.css"

export default function WordsearchHeader({chosenList, wordListOptions, handleWordListSelection, gridSizeDisplay, incrementGridSize, decrementGridSize}){


const gridSizeBarStyle={
        width: `${Math.floor(100/14 * gridSizeDisplay - (100/14 * 6))}%`,
        height: "22px",
        backgroundColor: "black",
        }
    

    return     <div className={styles.heading}>
    <h1>{chosenList.current.name}</h1>
    <div className={styles.gridOptionsContainer}>

        <div className={styles.gridSizeContainer}>
            <h3>Grid Size</h3>
            <div className={styles.gridSizeBackground}>
                <div style={gridSizeBarStyle}>
                </div>
            </div>
            <div className={styles.gridButtonsContainer}>
                <Button handleClick={incrementGridSize} text="+"/>
                <Button handleClick={decrementGridSize} text="-"/>
            </div>
        </div>
        <div className={styles.gridWordListContainer}>
            <h3>Word List</h3>
            <Dropdown onSelectChange={handleWordListSelection} selected={chosenList.current.name} options={wordListOptions}/>
        </div>
    </div>
</div>
}