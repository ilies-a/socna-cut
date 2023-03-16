import { useEffect, useState } from 'react';
import styles from './directional-button.module.scss'
import { useDispatch, useSelector } from 'react-redux';
import { selectTouches } from '@/redux/screen-event/screen-event.selectors';
import { KONVA_HEIGHT_SCALE, KONVA_WIDTH_SCALE, MaterialData } from '@/global';
import { updateMaterialData } from '@/redux/konva/konva.actions';
import { selectMaterialDataDict } from '@/redux/konva/konva.selectors';

const DirectionalButton: React.FC = () => {
    const [directionButtonInitialPos, setDirectionButtonInitialPos] = useState<[number, number]>([0, 0]);
    const [directionalButtonPos, setDirectionalButtonPos] = useState<[number, number]>([0, 0]);
    const touches:React.TouchList | null = useSelector(selectTouches);
    const dispatch = useDispatch();
    const materialDataDict:{ [key: string]: MaterialData } = useSelector(selectMaterialDataDict);

    useEffect(()=>{
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;
        setDirectionButtonInitialPos([screenWidth * 0.5, screenHeight * 0.6]);
    }, []);

    useEffect(()=>{
        if(!touches){
            setDirectionalButtonPos(directionButtonInitialPos);
            return
        }

        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;

        const konvaPos: [number, number] = [(screenWidth - screenWidth * KONVA_WIDTH_SCALE) * 0.5, (screenHeight - screenHeight * KONVA_HEIGHT_SCALE) * 0.5]; //DUMMY VALUES ! CHANGE WITH REAL KONVA POS
        const touchPos = getTouchPos(touches[0], konvaPos);
        setDirectionalButtonPos(touchPos);


        //testing
        for(let id in materialDataDict){
            if(!materialDataDict[id].getIsSelected()) continue;
            
            const updatedMaterialData:MaterialData | undefined = materialDataDict[id];
            if (!updatedMaterialData) return;
            // updatedMaterialData.path[1][0] += 0.001;
            // updatedMaterialData.path[2][0] += 0.001;
            const step = -0.001;
            updatedMaterialData.setWidthRatio(updatedMaterialData.getWidthRatio() + step);
            dispatch(updateMaterialData(updatedMaterialData));
        }

        
    },[directionButtonInitialPos, touches]);

    const getTouchPos = (touch:React.Touch, konvaPos:[number, number]): [number, number] => {
        const touchX = touch.clientX - konvaPos[0];
        const touchY = touch.clientY - konvaPos[1];
        return [touchX, touchY]
      }

    return (
        <div className={`${styles['directional-button']}`} style={{"left":""+directionalButtonPos[0]+"px", "top":""+directionalButtonPos[1]+"px"}}></div>
        );
  };
  
  export default DirectionalButton;