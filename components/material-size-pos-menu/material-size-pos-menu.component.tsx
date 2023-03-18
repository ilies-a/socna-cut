import { MutableRefObject, TouchEventHandler, useEffect, useMemo, useRef, useState } from 'react';
import styles from './material-size-pos-menu.module.scss'
import { useDispatch, useSelector } from 'react-redux';
import { selectIsRecording, selectTouches } from '@/redux/screen-event/screen-event.selectors';
import { KONVA_HEIGHT_SCALE, KONVA_WIDTH_SCALE, MaterialData, getMaterialDataArray, getSelectedMaterialDataArray } from '@/global';
import { updateMaterialData } from '@/redux/konva/konva.actions';
import { selectMaterialDataDict } from '@/redux/konva/konva.selectors';
import { setIsRecording } from '@/redux/screen-event/screen-event.actions';
import DirectionalButton from '../directional-button/directional-button.component';
// import DoubleRangeSlider from '../double-range-slider/double-range-slider.component';

const MaterialSizePosMenu: React.FC = () => {
    // const [directionButtonInitialPos, setDirectionButtonInitialPos] = useState<[number, number]>([0, 0]);
    const [directionalButtonPos, setDirectionalButtonPos] = useState<[number, number]>([10000, 0]);
    const touches:React.TouchList | null = useSelector(selectTouches);
    const dispatch = useDispatch();
    const materialDataDict:{ [key: string]: MaterialData } = useSelector(selectMaterialDataDict);
    // const [draggable, setDraggable] = useState<boolean>(false);
    const initialPosScreenRatio = [0.5, 0.7];
    const [materialWidthInputVal, setMaterialWidthInputVal ] = useState<string>("0");
    const [materialHeightInputVal, setMaterialHeightInputVal ] = useState<string>("0");

    const minWidth = "1";
    const maxWidth = "100";

    const minHeight = "1";
    const maxHeight = "200";

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



    //  const handleMaterialWidthInputOnChange = (e:React.FormEvent<HTMLInputElement>) => {
    //     let inputValueFloat: number = parseFloat(e.currentTarget.value);
    //     if(!inputValueFloat) {
    //         setMaterialWidthInputVal(minWidth);
    //         setSelectedMaterialsWidthRatio(parseFloat(minWidth) / 100);
    //         return;
    //     };

    //     let minWidthFloat: number = parseFloat(minWidth);
    //     let maxWidthFloat: number = parseFloat(maxWidth);

    //     let nextValue: string;

    //     if(inputValueFloat < minWidthFloat){
    //         nextValue = minWidth;
    //     } else if(inputValueFloat > maxWidthFloat){
    //         nextValue = maxWidth;
    //     } else{
    //         nextValue = e.currentTarget.value;
    //     }
    //     setMaterialWidthInputVal(nextValue);
    //     setSelectedMaterialsWidthRatio(parseFloat(nextValue) / 100);
    // }

    // const handleMaterialHeightInputOnChange = (e:React.FormEvent<HTMLInputElement>) => {
    //     let inputValueFloat: number = parseFloat(e.currentTarget.value);
    //     if(!inputValueFloat) {
    //         setMaterialHeightInputVal(minHeight);
    //         setSelectedMaterialsHeight(parseFloat(minHeight) / 100);
    //         return;
    //     };

    //     let minHeightFloat: number = parseFloat(minHeight);
    //     let maxHeightFloat: number = parseFloat(maxHeight);

    //     let nextValue: string;

    //     if(inputValueFloat < minHeightFloat){
    //         nextValue = minHeight;
    //     } else if(inputValueFloat > maxHeightFloat){
    //         nextValue = maxHeight;
    //     } else{
    //         nextValue = e.currentTarget.value;
    //     }
    //     setMaterialHeightInputVal(nextValue);
    //     setSelectedMaterialsHeight(parseFloat(nextValue) / 100);

    // }
    // // const preventNotTouchEvents = (e:React.PointerEvent | React.DragEvent | React.MouseEvent) => {
    // //     e.preventDefault();
    // //     e.stopPropagation();
    // // }

    // // function stopPropagation(event:React.MouseEvent | React.KeyboardEvent | React.FocusEvent | React.TouchEvent | React.PointerEvent) {
    // //     event.stopPropagation();
    // //     event.preventDefault();
    // //   }

    // const setSelectedMaterialsWidthRatio = (widthRatio: number) => {
    //     const selectedMaterialDataList = getSelectedMaterialDataList(materialDataDict);
    //     for(let i=0; i<selectedMaterialDataList.length; i++){
    //         selectedMaterialDataList[i].setWidthRatio(widthRatio);
    //         dispatch(updateMaterialData(selectedMaterialDataList[i]));
    //     }
    //     return;
    // }

    // const setSelectedMaterialsHeight = (height: number) => {
    //     const selectedMaterialDataList = getSelectedMaterialDataList(materialDataDict);
    //     for(let i=0; i<selectedMaterialDataList.length; i++){
    //         selectedMaterialDataList[i].setHeight(height);
    //         dispatch(updateMaterialData(selectedMaterialDataList[i]));
    //     }
    //     return;
    // }


    const handleMaterialWidthInputOnChange = useMemo(function () {
        return function (e:React.FormEvent<HTMLInputElement>) {
            const setSelectedMaterialsWidthRatio = (widthRatio: number) => {
                const selectedMaterialDataList = getSelectedMaterialDataArray(materialDataDict);
                for(let i=0; i<selectedMaterialDataList.length; i++){
                    selectedMaterialDataList[i].setWidthRatio(widthRatio);
                    dispatch(updateMaterialData(selectedMaterialDataList[i]));
                }
                return;
            }

            let inputValueFloat: number = parseFloat(e.currentTarget.value);
            if(!inputValueFloat) {
                setMaterialWidthInputVal(minWidth);
                setSelectedMaterialsWidthRatio(parseFloat(minWidth) / 100);
                return;
            };
    
            let minWidthFloat: number = parseFloat(minWidth);
            let maxWidthFloat: number = parseFloat(maxWidth);
    
            let nextValue: string;
    
            if(inputValueFloat < minWidthFloat){
                nextValue = minWidth;
            } else if(inputValueFloat > maxWidthFloat){
                nextValue = maxWidth;
            } else{
                nextValue = e.currentTarget.value;
            }
            setMaterialWidthInputVal(nextValue);
            setSelectedMaterialsWidthRatio(parseFloat(nextValue) / 100);
        }
      }, [dispatch, materialDataDict]);
     

    const handleMaterialHeightInputOnChange = useMemo(function () {
        return function (e:React.FormEvent<HTMLInputElement>) {
                const updateMaterialsAfterMaterialResizing = () => {
                    const sortMaterialDataArrayByY = () => {
                        return getMaterialDataArray(materialDataDict).sort((a, b) => a.getY() - b.getY());
                    }
                    const sortedMaterialDataArr = sortMaterialDataArrayByY();
                    for(let i=0; i<sortedMaterialDataArr.length-1; i++){
                        const currentMaterialData = sortedMaterialDataArr[i];
                        const nextMaterialData = sortedMaterialDataArr[i+1];
                        const dy = nextMaterialData.getY() - (currentMaterialData.getY() + currentMaterialData.getHeight());
                        nextMaterialData.setY(nextMaterialData.getY() - dy);
                        dispatch(updateMaterialData(nextMaterialData));
                    }
                    
                    // for(const v = thereisvoidbetween(); !v;){

                    // }

                    // for(const id1 in  materialDataDict){
                    //     const id1Bottom = materialDataDict[id1].getY() + materialDataDict[id1].getHeight();
                    //     const nextPointBelowBottom = id1Bottom + 1;
                    //     const distances: [MaterialData,number][] = [];
                    //     for(const id2 in  materialDataDict){
                    //         //we ignore the same element
                    //         if(id1 === id2 ) continue;
                    //         //check if next point below bottom of materialDataDict[id1] is between materialDataDict[id2].y and materialDataDict[id2].y + materialDataDict[id2].height if not it is void
                    //         if(nextPointBelowBottom < materialDataDict[id2].getY()) continue;
                    //         //there is void
                    //         distances.push([materialDataDict[id2], materialDataDict[id2].getY() - id1Bottom])
                    //     }
                    //     //determine what is the material below void
                    //     const materialBelowVoid = distances.filter((value) => value[1] === Math.min(...distances.map((val)=> val[1])))[0][0];
                    //     materialBelowVoid.setY(id1Bottom);    
                    // }
                    // return;
                }
                const updateMaterialsAfterBottomChange = (changedMaterial:MaterialData, shift:number) => {
                if(shift<=0) return //testing

                //finding materials having their top lower than resizingMaterialId's top

                for(const id in  materialDataDict){
                    if(id === changedMaterial.getId()) continue;
                    if(changedMaterial.getY() < materialDataDict[id].getY() && 
                        changedMaterial.getY() + changedMaterial.getHeight() > materialDataDict[id].getY()){
                        materialDataDict[id].setY(materialDataDict[id].getY() + shift);
                        dispatch(updateMaterialData(materialDataDict[id]));
                        updateMaterialsAfterBottomChange(materialDataDict[id], shift);
                    }
                }
                return;
            // const updateOtherMaterialsAfterVericalMaterialResizing = (resizingMaterialId:string, resizingMaterialBottomBeforeResizing:number, shift:number) => {
            //     if(shift<=0) return //testing

            //     //finding materials having their top touching resizing material's bottom
            //     //const materialsBelow:{[key: string]: MaterialData;} =  {};

            //     for(const id in  materialDataDict){
            //         if(id === resizingMaterialId) continue;
            //         if(resizingMaterialBottomBeforeResizing === materialDataDict[id].getY()){
            //             //this material had its top touching resizing material's bottom
            //             materialDataDict[id].setY(materialDataDict[id].getY() + shift);
            //             dispatch(updateMaterialData(materialDataDict[id]));
            //         }
            //     }
            //     return;
            }

            const setSelectedMaterialsHeight = (height: number) => {
                const selectedMaterialDataList = getSelectedMaterialDataArray(materialDataDict);
                for(let i=0; i<selectedMaterialDataList.length; i++){
                    const heightDifference = height - selectedMaterialDataList[i].getHeight();
                    selectedMaterialDataList[i].setHeight(height);
                    dispatch(updateMaterialData(selectedMaterialDataList[i]));
                    updateMaterialsAfterBottomChange(selectedMaterialDataList[i], heightDifference);
                    updateMaterialsAfterMaterialResizing();
                }
                return;
            }

            let inputValueFloat: number = parseFloat(e.currentTarget.value);
            if(!inputValueFloat) {
                setMaterialHeightInputVal(minHeight);
                setSelectedMaterialsHeight(parseFloat(minHeight));
                return;
            };
    
            let minHeightFloat: number = parseFloat(minHeight);
            let maxHeightFloat: number = parseFloat(maxHeight);
    
            let nextValue: string;
    
            if(inputValueFloat < minHeightFloat){
                nextValue = minHeight;
            } else if(inputValueFloat > maxHeightFloat){
                nextValue = maxHeight;
            } else{
                nextValue = e.currentTarget.value;
            }
            setMaterialHeightInputVal(nextValue);
            setSelectedMaterialsHeight(parseFloat(nextValue));
        }
      }, [dispatch, materialDataDict]);
      

    return (
        <div className={`${styles['main-wrapper']}`} style={{"left":""+ directionalButtonPos[0] +"px", "top":""+ directionalButtonPos[1] +"px"}}>
            <DirectionalButton/>
            <div className={`${styles['material-size-input-wrappers']}`}>
                <div className={`${styles['material-size-input-wrapper']} ${styles['material-width-input-wrapper']}`}>
                    {/* <DoubleRangeSlider/> */}
                    <input className={`${styles['material-size-range-input']} ${styles['material-width-range-input']}`} name="material-width-range-input" type="range" min={minWidth} max={maxWidth} value={materialWidthInputVal} onChange={handleMaterialWidthInputOnChange} />

                    {/* <MultiRangeSlider
                    minValue={-100}
                    maxValue={100}
                    step={10}
                    stepOnly
                    onInput={(e) => {
                        // setMinValue(e.minValue);
                        // setMaxValue(e.maxValue);
                    }}
                    style={{"border": 'none', "boxShadow": 'none', "padding": '15px 10px'}}
                    label='false'
                    ruler='false'
                    /> */}
                    
                    <input className={`${styles['material-size-number-input']} ${styles['material-width-number-input']}`} name="material-width-input" type="number" value={materialWidthInputVal} onChange={handleMaterialWidthInputOnChange} />
                    <span className={`${styles['size-unit']}`}>%</span>
                </div>
                <div className={`${styles['material-size-input-wrapper']} ${styles['material-height-input-wrapper']}`}>
                    <input className={`${styles['material-size-number-input']} ${styles['material-height-number-input']}`} name="material-height-input" type="number" value={materialHeightInputVal} onChange={handleMaterialHeightInputOnChange}/>
                    <span className={`${styles['size-unit']}`}>px</span>
                    <input className={`${styles['material-size-range-input']} ${styles['material-height-range-input']}`} name="material-height-range-input" type="range" min={minHeight} max={maxHeight} value={materialHeightInputVal} onChange={handleMaterialHeightInputOnChange} />
                </div>
            </div>
        </div>
        );
  };
  
  export default MaterialSizePosMenu;