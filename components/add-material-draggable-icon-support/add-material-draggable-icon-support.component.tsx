import { KONVA_HEIGHT_SCALE, KONVA_WIDTH_SCALE, blockTypes } from "@/global";
import styles from './add-material-draggable-icon-support.module.scss';
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectIsRecording, selectScreenSize, selectTouches } from "@/redux/screen-event/screen-event.selectors";
import { setIsRecording } from "@/redux/screen-event/screen-event.actions";
import { selectDraggableIcon } from "@/redux/konva/konva.selectors";
import { setDraggableIcon } from "@/redux/konva/konva.actions";
import { totalOfKeys } from "@/utils";

type Props = {
    children: JSX.Element
  };

const AddMaterialDraggableIconSupport: React.FC<Props> = ({ children }) => {
    const outOfScreenPos = -1000;

    const [iconPos, setIconPos] = useState<[number, number]>([outOfScreenPos, outOfScreenPos]);
    const touches:React.TouchList | null = useSelector(selectTouches);
    const isRecording: boolean = useSelector(selectIsRecording);
    const screenSize: [number, number] = useSelector(selectScreenSize);
    const draggableIcon: {[key: string]: any} = useSelector(selectDraggableIcon);

    // const [draggableIcon, setDraggableIcon] = useState(false);

    const dispatch = useDispatch();

    useEffect(()=>{
        setIconPos([outOfScreenPos, outOfScreenPos]);
    }, [screenSize, outOfScreenPos]);

    useEffect(()=>{
        if(!touches || !isRecording || !totalOfKeys(draggableIcon)){
            setIconPos([outOfScreenPos, outOfScreenPos]);
            return
        }
        const konvaPos = [(screenSize[0] - screenSize[0] * KONVA_WIDTH_SCALE) * 0.5, (screenSize[1] - screenSize[1] * KONVA_HEIGHT_SCALE) * 0.5] as [number, number];
        const touchPos = getTouchPos(touches[0], konvaPos);
        setIconPos(touchPos);

    },[touches, isRecording, screenSize, draggableIcon, outOfScreenPos]);
    
    const getTouchPos = (touch:React.Touch, konvaPos:[number, number]): [number, number] => {
        const touchX = touch.clientX - konvaPos[0];
        const touchY = touch.clientY - konvaPos[1];
        return [touchX, touchY]
      }

    const preventDefault = (e:React.TouchEvent) => {
        e.preventDefault();
    }

    const unsetDraggableIconAndEndRecordingTouches = (e:React.TouchEvent) => {
        e.preventDefault();
        dispatch(setDraggableIcon({}));
        dispatch(setIsRecording(false));
    }
    return <div className={styles['main']}
        onTouchStart={preventDefault}
        onTouchMove={preventDefault}
        onTouchEnd={unsetDraggableIconAndEndRecordingTouches}
        >
        {children}
        {
            totalOfKeys(draggableIcon)? <div className={styles['draggable-icon']}
            style={{"backgroundColor":""+ draggableIcon['colorForTests'] +"", "left":""+ iconPos[0]+"px", "top":""+ iconPos[1]+"px"}}
            ></div>:null
        }
    </div>
           
}

export default AddMaterialDraggableIconSupport;