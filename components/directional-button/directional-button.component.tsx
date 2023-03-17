import { MutableRefObject, TouchEventHandler, useEffect, useRef, useState } from 'react';
import styles from './directional-button.module.scss'
import { useDispatch, useSelector } from 'react-redux';
import { selectIsRecording, selectTouches } from '@/redux/screen-event/screen-event.selectors';
import { KONVA_HEIGHT_SCALE, KONVA_WIDTH_SCALE, MaterialData } from '@/global';
import { updateMaterialData } from '@/redux/konva/konva.actions';
import { selectMaterialDataDict } from '@/redux/konva/konva.selectors';
import Draggable from 'react-draggable';
import { setIsRecording } from '@/redux/screen-event/screen-event.actions';

const DirectionalButton: React.FC = () => {
    // const [directionButtonInitialPos, setDirectionButtonInitialPos] = useState<[number, number]>([0, 0]);
    const [directionalButtonPos, setDirectionalButtonPos] = useState<[number, number]>([10000, 0]);
    const touches:React.TouchList | null = useSelector(selectTouches);
    const dispatch = useDispatch();
    // const materialDataDict:{ [key: string]: MaterialData } = useSelector(selectMaterialDataDict);
    // const [draggable, setDraggable] = useState<boolean>(false);
    const initialPosScreenRatio = [0.5, 0.7];
    const [inputVal, setInputVal ] = useState<string>("0.1");
    // const [draggable, setDraggable ] = useState<boolean>(true);

    const isRecording: boolean = useSelector(selectIsRecording);

    useEffect(()=>{
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;
        setDirectionalButtonPos([screenWidth * 0.5, screenHeight * 0.6]);
    }, []);

    useEffect(()=>{
        if(!touches || !isRecording){
            // setDirectionalButtonPos(directionButtonInitialPos);
            return
        }

        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;

        const konvaPos: [number, number] = [(screenWidth - screenWidth * KONVA_WIDTH_SCALE) * 0.5, (screenHeight - screenHeight * KONVA_HEIGHT_SCALE) * 0.5]; //DUMMY VALUES ! CHANGE WITH REAL KONVA POS
        const touchPos = getTouchPos(touches[0], konvaPos);
        setDirectionalButtonPos(touchPos);


        // //testing
        // for(let id in materialDataDict){
        //     if(!materialDataDict[id].getIsSelected()) continue;
            
        //     const updatedMaterialData:MaterialData | undefined = materialDataDict[id];
        //     if (!updatedMaterialData) return;
        //     // updatedMaterialData.path[1][0] += 0.001;
        //     // updatedMaterialData.path[2][0] += 0.001;
        //     const step = -0.001;
        //     updatedMaterialData.setWidthRatio(updatedMaterialData.getWidthRatio() + step);
        //     dispatch(updateMaterialData(updatedMaterialData));
        // }

        
    },[touches, isRecording]);

    const getTouchPos = (touch:React.Touch, konvaPos:[number, number]): [number, number] => {
        const touchX = touch.clientX - konvaPos[0];
        const touchY = touch.clientY - konvaPos[1];
        return [touchX, touchY]
      }

    // const setDraggableTrue = () => {
    //     setDraggable(true);
    // }
    // const setDraggableFalse = () => {
    //     setDraggable(false);
    // }

    // const handleTouchStartWrapper = (e:React.TouchEvent | React.MouseEvent) => {
    //     setDraggable(true)
    // }
    const startRecordingTouches = (e:React.TouchEvent | React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        dispatch(setIsRecording(true));
    }
    const endRecordingTouches = (e:React.TouchEvent | React.MouseEvent) => {
        e.stopPropagation();
        dispatch(setIsRecording(false));
    }
    const test = (e:React.TouchEvent | React.MouseEvent) => {
        e.stopPropagation();
        // alert("test")
    }

    // const handleTouchStartInput = (e:React.TouchEvent | React.MouseEvent) => {

    //     e.preventDefault();
    //     e.stopPropagation();
    //     setDraggable(false)
    //     inputRef.current?.focus()
    // }
    // const handleTouchEnd = (e:React.TouchEvent) => {
    //     // setDraggable(true)
    //     // inputRef.current?.focus()
    // }
     const handleInputOnChange = (e:React.FormEvent<HTMLInputElement>) => {
        setInputVal(e.currentTarget.value)
    }
    // const preventNotTouchEvents = (e:React.PointerEvent | React.DragEvent | React.MouseEvent) => {
    //     e.preventDefault();
    //     e.stopPropagation();
    // }

    // function stopPropagation(event:React.MouseEvent | React.KeyboardEvent | React.FocusEvent | React.TouchEvent | React.PointerEvent) {
    //     event.stopPropagation();
    //     event.preventDefault();
    //   }


    return (
        <div className={`${styles['directional-button']}`} style={{"left":""+ directionalButtonPos[0] +"px", "top":""+ directionalButtonPos[1] +"px"}}
            onTouchStart={startRecordingTouches}
            onTouchEnd={endRecordingTouches}>
            <div className={`${styles['material-size-input-wrappers']}`}>
                <div className={`${styles['material-size-input-wrapper']} ${styles['material-width-input-wrapper']}`}>
                    <input className={`${styles['material-size-input']} ${styles['material-width-input']}`} name="material-width-input" type="number" value={inputVal} onChange={handleInputOnChange} 
                    onTouchStart={endRecordingTouches}/>
                    <span className={`${styles['size-unit']}`}>%</span>
                </div>
                <div className={`${styles['material-size-input-wrapper']} ${styles['material-height-input-wrapper']}`}>
                    <input className={`${styles['material-size-input']} ${styles['material-height-input']}`} name="material-height-input" type="number" value={inputVal} onChange={handleInputOnChange} 
                    onTouchStart={endRecordingTouches}/>
                    <span className={`${styles['size-unit']}`}>px</span>
                </div>
            </div>
        </div>
        );
  };
  
  export default DirectionalButton;