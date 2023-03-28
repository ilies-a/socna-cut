import { MutableRefObject, TouchEventHandler, useCallback, useEffect, useRef, useState } from 'react';
import styles from './directional-button.module.scss'
import { useDispatch, useSelector } from 'react-redux';
import { selectIsRecording, selectTouches } from '@/redux/screen-event/screen-event.selectors';
import { KONVA_HEIGHT_SCALE, KONVA_WIDTH_SCALE, MaterialData } from '@/global';
import { setDraggingBlockDimMenu, setPadPosition, updateMaterialData } from '@/redux/konva/konva.actions';
import { selectMaterialDataDict, selectPadPosition } from '@/redux/konva/konva.selectors';
import { setIsRecording } from '@/redux/screen-event/screen-event.actions';
import Draggable from 'react-draggable';

const PadInitialPos: React.FC = () => {
    const outOfScreenPos = -1000;

    const [padInitialPos, setPadInitialPos] = useState<[number, number]>([outOfScreenPos, outOfScreenPos]);
    const dispatch = useDispatch();
    const directionalButtonRef = useRef<HTMLDivElement>(null);
    const padPosition:[number, number] = useSelector(selectPadPosition);

    useEffect(()=>{
        if(!padPosition){
            dispatch(setPadPosition([window.innerWidth * 0.5, window.innerHeight * 0.5]));
            setPadInitialPos([window.innerWidth * 0.5, window.innerHeight * 0.5]);
            return;
        }
        setPadInitialPos(padPosition);
    },[])

    const startDragAndStartRecordingTouches = (e:React.TouchEvent | React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        dispatch(setDraggingBlockDimMenu(true));
        dispatch(setIsRecording(true));
    }
    const endDragEndRecordingTouches = (e:React.TouchEvent | React.MouseEvent) => {
        e.stopPropagation();
        dispatch(setDraggingBlockDimMenu(false));
        dispatch(setIsRecording(false));
    }

    const recordPosition = useCallback(()=>{
        if(!directionalButtonRef.current) return;
        dispatch(setPadPosition([directionalButtonRef.current.getBoundingClientRect().left, directionalButtonRef.current.getBoundingClientRect().top]))
    },[dispatch]);

    return (
        <Draggable onDrag={recordPosition} onStop={(e) => {e.stopPropagation()}}> 
            <div style={{"left":""+ padInitialPos[0] +"px", "top":""+ padInitialPos[1] +"px"}} ref={directionalButtonRef} className={`${styles['directional-button']}`}
                onTouchStart={startDragAndStartRecordingTouches}
                onTouchEnd={endDragEndRecordingTouches}></div>
        </Draggable>
        );
  };
  
  export default PadInitialPos;