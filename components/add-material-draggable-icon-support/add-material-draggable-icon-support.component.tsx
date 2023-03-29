import { KONVA_HEIGHT_SCALE, KONVA_WIDTH_SCALE, MaterialData, OUT_OF_SCREEN_POSITION, StateSpace, blockTypes, createBlockByTypeName } from "@/global";
import styles from './add-material-draggable-icon-support.module.scss';
import { Dispatch, SetStateAction, useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectIsRecording, selectScreenSize, selectTouches } from "@/redux/screen-event/screen-event.selectors";
import { setIsRecording } from "@/redux/screen-event/screen-event.actions";
import { selectAddBlockMenuStateSpace, selectDraggableIcon, selectMaterialDataDict, selectPlanStateSpace, selectTappingOnIconButton } from "@/redux/konva/konva.selectors";
import { addMaterialData, setDraggableIcon, updateDraggableIconPosition } from "@/redux/konva/konva.actions";
import { Rect, rectContainsRect, rectOverlapsRect, totalOfKeys } from "@/utils";

type Props = {
    children: JSX.Element
  };

const AddMaterialDraggableIconSupport: React.FC<Props> = ({ children }) => {

    const [iconPos, setIconPos] = useState<[number, number]>(OUT_OF_SCREEN_POSITION);
    const touches:React.TouchList | null = useSelector(selectTouches);
    const isRecording: boolean = useSelector(selectIsRecording);
    const screenSize: [number, number] = useSelector(selectScreenSize);
    const draggableIcon: {[key: string]: any} = useSelector(selectDraggableIcon);
    const planStateSpace:StateSpace = useSelector(selectPlanStateSpace) 
    const materialDataDict:{ [key: string]: MaterialData } = useSelector(selectMaterialDataDict) 
    const tappingOnIconButton:boolean = useSelector(selectTappingOnIconButton);
    const addBlockMenuStateSpace = useSelector(selectAddBlockMenuStateSpace);

    // const [draggableIcon, setDraggableIcon] = useState(false);
    const [clientPos, setClientPos] = useState<[number, number] | null>(null);

    const touchableRef = useRef<HTMLDivElement>(null);

    const dispatch = useDispatch();

    const recordClientPos = useCallback((e: React.TouchEvent) => {
        // dispatch(updateDraggableIconPosition(OUT_OF_SCREEN_POSITION));
        setIconPos(OUT_OF_SCREEN_POSITION);
        setClientPos([e.touches[0].clientX, e.touches[0].clientY]);
    }, []);


    const dragIcon = useCallback((e:React.TouchEvent) => {
        if(!touchableRef || !touchableRef.current || !totalOfKeys(draggableIcon) || !clientPos) return;
        setClientPos([e.touches[0].clientX, e.touches[0].clientY]);

        // let deltaX;
        // let deltaY;
    
        // deltaX = e.changedTouches[0].clientX - clientPos[0];
        // deltaY = e.changedTouches[0].clientY - clientPos[1];

        // const deltaYmin= 10;
        // if(Math.abs(deltaY) < deltaYmin) return;

        const shiftForBetterUserExperience = 45;
        setIconPos([clientPos[0] - shiftForBetterUserExperience, clientPos[1] - shiftForBetterUserExperience]);
        // dispatch(setDraggableIcon(draggableIcon));

    },[draggableIcon, clientPos])

    // useEffect(()=>{
    //     if(!touches || !isRecording || !totalOfKeys(draggableIcon)){
    //         setIconPos([outOfScreenPos, outOfScreenPos]);
    //         return
    //     }
    //     // const konvaPos = [(screenSize[0] - screenSize[0] * KONVA_WIDTH_SCALE) * 0.5, (screenSize[1] - screenSize[1] * KONVA_HEIGHT_SCALE) * 0.5] as [number, number];
    //     // const touchPos = getTouchPos(touches[0], konvaPos);
    //     const shiftForBetterUserExperience = 50;
    //     setIconPos([clientPos[0] - shiftForBetterUserExperience, clientPos[1] - shiftForBetterUserExperience]);

    // },[touches, isRecording, screenSize, draggableIcon, outOfScreenPos, clientPos]);
    
    // const getTouchPos = (touch:React.Touch, konvaPos:[number, number]): [number, number] => {
    //     const touchX = touch.clientX - konvaPos[0];
    //     const touchY = touch.clientY - konvaPos[1];
    //     return [touchX, touchY]
    //   }

    // const preventDefault = (e:React.TouchEvent) => {
    //     e.preventDefault();
    // }

    const addMaterialOnDrop = useCallback((e:React.TouchEvent) => {
        if(!totalOfKeys(draggableIcon)) return;
        const konvaPos = [(screenSize[0] - screenSize[0] * KONVA_WIDTH_SCALE) * 0.5, (screenSize[1] - screenSize[1] * KONVA_HEIGHT_SCALE) * 0.5] as [number, number];
        const draggableIconPositionOnPlan = [iconPos[0] - planStateSpace.x, iconPos[1] - planStateSpace.y];

        const newBlockSize = 20;

        const newBlockRect = new Rect(newBlockSize / planStateSpace.width * 100, newBlockSize, draggableIconPositionOnPlan[0] / planStateSpace.width * 100, draggableIconPositionOnPlan[1]);

        //DOES NOT OVERLAP MENU CHECK
        if(rectOverlapsRect(
            new Rect(
                newBlockSize,
                newBlockSize,
                iconPos[0],
                iconPos[1] 
            ),
            new Rect(
                addBlockMenuStateSpace.width,
                addBlockMenuStateSpace.height,
                addBlockMenuStateSpace.x,
                addBlockMenuStateSpace.y,
            )
            )) return;

        // alert("Does not overlaps menu")
        //PLAN CONTAINS BLOCK
 
        if(!rectContainsRect(
            new Rect(
                planStateSpace.width,
                planStateSpace.height,
                planStateSpace.x,
                planStateSpace.y,
            ),
            new Rect(
                newBlockSize,
                newBlockSize,
                iconPos[0],
                iconPos[1] 
            ),
        )) return;

        // alert("Plan contains block")

        //DOES NOT OVERLAP ANOTHER BLOCK
        for(const blockId in materialDataDict){
            const block = materialDataDict[blockId];
            if(rectOverlapsRect(
                newBlockRect, 
                new Rect(
                block.getWidthRatio(),
                block.getHeight(),
                block.getXRatio(),
                block.getY()
                )
                )){
                return;
            }
        }
        // alert("does not overlaps with other block")

        const newMaterialData = createBlockByTypeName(draggableIcon['name'], newBlockRect.w, newBlockRect.h, newBlockRect.x, newBlockRect.y);

        dispatch(addMaterialData(newMaterialData));
        

    },[draggableIcon, screenSize, iconPos, planStateSpace.x, planStateSpace.y, planStateSpace.width, planStateSpace.height, addBlockMenuStateSpace.width, addBlockMenuStateSpace.height, addBlockMenuStateSpace.x, addBlockMenuStateSpace.y, dispatch, materialDataDict]);

    const unsetDraggableIconAndStopRecordClientPos = useCallback((e:React.TouchEvent) => {
        e.preventDefault();
        addMaterialOnDrop(e);
        setClientPos(null);
        dispatch(setDraggableIcon({}));
    },[dispatch, addMaterialOnDrop]);


    return <div className={styles['main']}
        onTouchStart={recordClientPos}
        onTouchMove={dragIcon}
        onTouchEnd={unsetDraggableIconAndStopRecordClientPos}
        >
        {children}
        {
            totalOfKeys(draggableIcon)? <div
            ref = {touchableRef}
            className={styles['draggable-icon']}
            style={{"backgroundColor":""+ draggableIcon['colorForTests'] +"", "left":""+ iconPos[0]+"px", "top":""+ iconPos[1]+"px"}}
            ></div>:null
        }
    </div>
           
}

export default AddMaterialDraggableIconSupport;