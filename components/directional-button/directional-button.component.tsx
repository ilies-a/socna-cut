import { MutableRefObject, TouchEventHandler, useEffect, useRef, useState } from 'react';
import styles from './directional-button.module.scss'
import { useDispatch, useSelector } from 'react-redux';
import { selectIsRecording, selectTouches } from '@/redux/screen-event/screen-event.selectors';
import { KONVA_HEIGHT_SCALE, KONVA_WIDTH_SCALE, MaterialData } from '@/global';
import { updateMaterialData } from '@/redux/konva/konva.actions';
import { selectMaterialDataDict } from '@/redux/konva/konva.selectors';
import { setIsRecording } from '@/redux/screen-event/screen-event.actions';

const DirectionalButton: React.FC = () => {
    const dispatch = useDispatch();
    const isRecording: boolean = useSelector(selectIsRecording);

    const startRecordingTouches = (e:React.TouchEvent | React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        dispatch(setIsRecording(true));
    }
    const endRecordingTouches = (e:React.TouchEvent | React.MouseEvent) => {
        e.stopPropagation();
        dispatch(setIsRecording(false));
    }

    return (
            <div className={`${styles['directional-button']} ${isRecording ? styles['directional-button-pressed'] : null}`}
                onTouchStart={startRecordingTouches}
                onTouchEnd={endRecordingTouches}></div>
        );
  };
  
  export default DirectionalButton;