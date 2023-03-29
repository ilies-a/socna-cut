import { StateSpace, blockTypes } from "@/global";
import styles from './add-material-menu.module.scss';
import AddMaterialIconButton from "../add-material-icon-button/add-material-icon-button.component";
import { useCallback, useEffect, useRef, useState } from "react";
import { setAddBlockMenuStateSpace, setDraggableIcon } from "@/redux/konva/konva.actions";
import { setIsRecording } from "@/redux/screen-event/screen-event.actions";
import { useDispatch } from "react-redux";

const AddMaterialMenu: React.FC = () => {
    const dispatch = useDispatch();
    const ref = useRef<HTMLDivElement>(null);

    useEffect(()=>{
        if(!ref || !ref.current) return;
        dispatch(setAddBlockMenuStateSpace(new StateSpace(
            ref.current.getBoundingClientRect().width,
            ref.current.getBoundingClientRect().height,
            ref.current.getBoundingClientRect().x,
            ref.current.getBoundingClientRect().y,
        )))
    }, [dispatch]);
    
    const handleScroll = useCallback((e:React.UIEvent<HTMLDivElement>)=>{
        //On scroll, we disable icon dragging. Otherwise, it lags.
        dispatch(setDraggableIcon({}));
        dispatch(setIsRecording(false));

    },[dispatch])


    return <div ref = {ref} className={styles['buttons-wrapper']}
        onScroll={handleScroll}>
        {   
            Object.entries(blockTypes).map(([_, blockType]) =>{
                return <AddMaterialIconButton blockType={blockType} key={blockType['name']} />
            })
        }
    </div>
}

export default AddMaterialMenu;