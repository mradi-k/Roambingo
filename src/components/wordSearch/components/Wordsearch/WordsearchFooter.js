import styles from '../wordsearch.module.css'

export default function WordsearchFooter({wordLocations, wordsRemaining, onRegenerateGrid}){
    return     <> 
      <div className={styles.words}>
        {wordLocations.map((word, index)=>{
          return <h4 className={styles.h4} key={index} style={!wordsRemaining.find(remainingWord => remainingWord.id === word.id) ? {"textDecoration": "line-through", "textDecorationThickness": "3px"} : {}}>{word.insertedWord}</h4>
        })}
        </div>
        <br/>
        {wordsRemaining.length === 0 ? <p className={styles.winText}>All words found!</p> : ""}
      <button className={styles.restartButton} onClick={()=>{onRegenerateGrid()}}>Restart</button>
    </>

}