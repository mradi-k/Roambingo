import Option from "./Option";
import styles from '../wordsearch.module.css'
function Dropdown({onSelectChange, selected, options}){

function handleSelect(e){
    onSelectChange(e.target.value);
}

return <select className={styles.dropdown} defaultValue={selected} onChange={handleSelect}>
        {options.map((option)=>{
            return <Option key={option.id} value={option.name}/>
        })}
    </select>
}

export default Dropdown;