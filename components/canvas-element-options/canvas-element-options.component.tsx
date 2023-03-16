import { useEffect, useState } from 'react';
import styles from './canvas-element-options.module.scss';

type CanvasElementOptionsProps = {
    element: JSX.Element | undefined,
    canvasRef: React.MutableRefObject<HTMLCanvasElement | null>,
    touches: React.TouchList | undefined
  };


const CanvasElementOptions: React.FC<CanvasElementOptionsProps> = ({ element, canvasRef, touches }) => {
    const [directionButtonInitialPos, setDirectionButtonInitialPos] = useState<[number, number]>([0, 0]);
    const [directionalButtonPos, setDirectionalButtonPos] = useState<[number, number]>([0, 0]);

    useEffect(()=>{
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;
        setDirectionButtonInitialPos([screenWidth * 0.5, screenHeight * 0.6]);

    }, []);

    useEffect(()=>{
        const canvas = canvasRef.current;
        if(canvas === null) return;

        if(touches === undefined){
            setDirectionalButtonPos(directionButtonInitialPos);
            return
        }

        const canvasPos = canvas.getBoundingClientRect();
        const touchPos = getTouchPos(touches[0], canvasPos);
        setDirectionalButtonPos(touchPos);
    },[touches]);

    const getTouchPos = (touch:React.Touch, canvasPos:DOMRect): [number, number] => {
        const touchX = touch.clientX - canvasPos.left;
        const touchY = touch.clientY - canvasPos.top;
        return [touchX, touchY]
      }

    return (
        <div className={styles["main-wrapper"]}>
            <div className={`${styles['directional-button']}`} style={{"left":""+directionalButtonPos[0]+"px", "top":""+directionalButtonPos[1]+"px"}}></div>
            {/* <div className={styles["directional-buttons-wrapper"]}>
                <div className={`${styles['directional-button']}`}></div>
            </div> */}
        </div>)
  };
  
  export default CanvasElementOptions;