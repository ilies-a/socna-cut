import styles from './double-range-slider.module.scss'


const DoubleRangeSlider: React.FC = () => {


    return (
        <div>
            <input className={`${styles['material-size-range-input']} ${styles['material-width-range-input']}`} name="material-width-range-input" type="range" min={0} max={0} style={{'direction':'rtl'}}/>
            <input className={`${styles['material-size-range-input']} ${styles['material-width-range-input']}`} name="material-width-range-input" type="range" min={0} max={0} value={0} />
        </div>
        );
  };
  
  export default DoubleRangeSlider;