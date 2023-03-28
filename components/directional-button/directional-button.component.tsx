import { MutableRefObject, TouchEventHandler, useEffect, useRef, useState } from 'react';
import styles from './directional-button.module.scss'
import { useDispatch, useSelector } from 'react-redux';
import { selectIsRecording, selectTouches } from '@/redux/screen-event/screen-event.selectors';
import { KONVA_HEIGHT_SCALE, KONVA_WIDTH_SCALE, MaterialData } from '@/global';
import { setDraggingBlockDimMenu, updateMaterialData } from '@/redux/konva/konva.actions';
import { selectMaterialDataDict } from '@/redux/konva/konva.selectors';
import { setIsRecording } from '@/redux/screen-event/screen-event.actions';

const DirectionalButton: React.FC = () => {
    const dispatch = useDispatch();

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

    return (
            <div className={`${styles['directional-button']}`}
                onTouchStart={startDragAndStartRecordingTouches}
                onTouchEnd={endDragEndRecordingTouches}></div>
        );
  };
  
  export default DirectionalButton;