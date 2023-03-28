import { KONVA_HEIGHT_SCALE, KONVA_WIDTH_SCALE, blockTypes } from "@/global";
import styles from './add-material-icon-button.module.scss';
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectIsRecording, selectScreenSize, selectTouches } from "@/redux/screen-event/screen-event.selectors";
import { setIsRecording } from "@/redux/screen-event/screen-event.actions";
import { setDraggableIcon } from "@/redux/konva/konva.actions";

type Props = {
    key: number,
    blockType: { [key: string]: any }
  };

const AddMaterialIconButton: React.FC<Props> = ({blockType}) => {
    const dispatch = useDispatch();

    const setDraggableIconAndStartRecordingTouches = (e:React.TouchEvent | React.MouseEvent) => {
        dispatch(setDraggableIcon(blockType));
        dispatch(setIsRecording(true));
    }

    return <div className={styles['main-wrapper']} style={{'backgroundColor': `${blockType['colorForTests']}`}}
        onTouchMove={setDraggableIconAndStartRecordingTouches}
        >
            <div className={styles['block-name']}>{blockType['name']}</div>
        </div>
}

export default AddMaterialIconButton;