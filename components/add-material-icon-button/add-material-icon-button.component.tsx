import { KONVA_HEIGHT_SCALE, KONVA_WIDTH_SCALE, MaterialData, OUT_OF_SCREEN_POSITION, blockTypes, createBlockByTypeName } from "@/global";
import styles from './add-material-icon-button.module.scss';
import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectIsRecording, selectScreenSize, selectTouches } from "@/redux/screen-event/screen-event.selectors";
import { setIsRecording } from "@/redux/screen-event/screen-event.actions";
import { addMaterialData, setDraggableIcon, setTappingOnIconButton } from "@/redux/konva/konva.actions";
import { selectMaterialDataDict } from "@/redux/konva/konva.selectors";
import { Point, Rect, pointInsideRect } from "@/utils";

type Props = {
    key: number,
    blockType: { [key: string]: any }
  };

const AddMaterialIconButton: React.FC<Props> = ({blockType}) => {
    const dispatch = useDispatch();
    const materialDataDict:{ [key: string]: MaterialData } = useSelector(selectMaterialDataDict);
    const touchableRef = useRef<HTMLDivElement>(null);
    const [clientPos, setClientPos] = useState<[number, number] | null>(null);

    const setDraggableIconAndStartRecordingTouches = useCallback((e:React.TouchEvent | React.MouseEvent) => {
        const draggableIcon = {...blockType, 'position': OUT_OF_SCREEN_POSITION};
        dispatch(setDraggableIcon(draggableIcon));
        // dispatch(setIsRecording(true));
    },[blockType, dispatch]);

    const recordClientPos = useCallback((e: React.TouchEvent) => {
        setClientPos([e.touches[0].clientX, e.touches[0].clientY]);
    }, []);

    const addMaterialDataMemo = useCallback((e:React.TouchEvent)=> {
        if(!touchableRef || !touchableRef.current || !clientPos) return;

        let deltaX;
        let deltaY;
    
        deltaX = e.changedTouches[0].clientX - clientPos[0];
        deltaY = e.changedTouches[0].clientY - clientPos[1];

        const tapLimit = 2;
        if(Math.abs(deltaX) > tapLimit || Math.abs(deltaY) > tapLimit) return;

        if(!pointInsideRect(new Point(e.changedTouches[0].clientX, e.changedTouches[0].clientY), 
            new Rect(touchableRef.current.getBoundingClientRect().width,
            touchableRef.current.getBoundingClientRect().height,
            touchableRef.current.getBoundingClientRect().left,
            touchableRef.current.getBoundingClientRect().top) )) return

      // The next material appears below the lowest material
      // const lowestMaterialBottom = () => {
      //   let lowestMaterial: MaterialData | undefined;
      //   Object.entries(materialDataDict).map(([_, value]) =>{
      //       if(!lowestMaterial){ //first iteration
      //         lowestMaterial = value;
      //       }
      //       else if (lowestMaterial.getY() + lowestMaterial.getHeight() < value.getY() + value.getHeight() ) {
      //         lowestMaterial = value;
      //       }
      //     });
      //   if(lowestMaterial){
      //     return lowestMaterial.getY() + lowestMaterial.getHeight();
      //   }
      //   return 0;
      // }




                    // context.moveTo(x, y);
            // context.lineTo(widthRatioMemo, 0);
            // context.lineTo(widthRatioMemo, height);
            // context.lineTo(x, height);
            // context.lineTo(x, y);

        const materialDataArray = Object.keys(materialDataDict).map(key => materialDataDict[key]);
        const lowestMaterial = materialDataArray.find((materialData) => materialData.getY() + materialData.getHeight() === Math.max(...materialDataArray.map((materialData)=> materialData.getY() + materialData.getHeight())));
        const lowestMaterialBottom = lowestMaterial? lowestMaterial.getY() + lowestMaterial.getHeight() : 0;

        const newMaterialData = createBlockByTypeName(blockType['name'], 100, 20, 0, lowestMaterialBottom);

        // const newMaterialData = new MaterialData(v4(), [
        //         [0, 0],
        //         [0.8, -1],
        //         [0.8, -1],
        //         [0, -1],
        //         [0, 0]parseInt
        //     ]);
        dispatch(addMaterialData(newMaterialData));

        //(test) add one material at right
        // if(materialDataArray.length === 1){
        //   const newMaterialData = new MaterialData(v4(), 0.5, 50, 0.2);
        //   dispatch(addMaterialData(newMaterialData));
        // }
      
    }, [clientPos, materialDataDict, dispatch, blockType]);

    return <div className={styles['main-wrapper']} style={{'backgroundColor': `${blockType['colorForTests']}`}}
        ref= {touchableRef}
        onTouchStart={recordClientPos}
        onTouchEnd = {addMaterialDataMemo}
        onTouchMove={setDraggableIconAndStartRecordingTouches}
        >
            <div className={styles['block-name']}>{blockType['name']}</div>
        </div>
}

export default AddMaterialIconButton;