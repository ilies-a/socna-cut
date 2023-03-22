import { MutableRefObject, TouchEventHandler, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import styles from './material-size-pos-menu.module.scss'
import { useDispatch, useSelector } from 'react-redux';
import { selectIsRecording, selectScreenSize, selectTouches } from '@/redux/screen-event/screen-event.selectors';
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
    const screenSize: [number, number] = useSelector(selectScreenSize);
    const materialDataDict:{ [key: string]: MaterialData } = useSelector(selectMaterialDataDict);
    // const [draggable, setDraggable] = useState<boolean>(false);
    // const initialPosScreenRatio = [0.5, 0.7];
    const [materialWidthInputVal, setMaterialWidthInputVal ] = useState<string>("0");
    const [materialHeightInputVal, setMaterialHeightInputVal ] = useState<string>("0");

    // const [konvaSize, setKonvaSize ] = useState<[number, number]>([0, 0]);
    // const [konvaPos, setKonvaPos ] = useState<[number, number]>([0, 0]);

    const minWidth = "1";
    const maxWidth = "100";

    const minHeight = "1";
    const maxHeight = "200";

    // const [draggable, setDraggable ] = useState<boolean>(true);

    const isRecording: boolean = useSelector(selectIsRecording);
    
    // const [widthChangeDirection, setWidthChangeDirection] = useState<boolean>(false); //true if direction to right, otherwise false
    // const [widthHeightDirection, setHeightChangeDirection] = useState<boolean>(true); //true if direction to bottom, otherwise false

    useEffect(()=>{
        setDirectionalButtonPos([screenSize[0] * 0.5, screenSize[1] * 0.6]);
    }, [screenSize]);

    useEffect(()=>{
        if(!touches || !isRecording){
            return
        }
        const konvaPos = [(screenSize[0] - screenSize[0] * KONVA_WIDTH_SCALE) * 0.5, (screenSize[1] - screenSize[1] * KONVA_HEIGHT_SCALE) * 0.5] as [number, number];
        const touchPos = getTouchPos(touches[0], konvaPos);
        setDirectionalButtonPos(touchPos);

    },[touches, isRecording, screenSize]);

    const getTouchPos = (touch:React.Touch, konvaPos:[number, number]): [number, number] => {
        const touchX = touch.clientX - konvaPos[0];
        const touchY = touch.clientY - konvaPos[1];
        return [touchX, touchY]
      }

    const handleMaterialWidthInputOnChange = useCallback((e:React.FormEvent<HTMLInputElement>, rightToLeft:boolean)=>{
      
            const sortTowardsMoveDirection = () => {
                return getMaterialDataArray(materialDataDict).sort((a, b) => a.getXRatio() + a.getWidthRatio() - (b.getXRatio() + b.getWidthRatio()));
            }

            const pushRightMaterialsAfterLeftMaterialRightChange = (changedMaterial:MaterialData, sortedTowardsMoveDirection:MaterialData[]) => {
                const changedMaterialIndex = sortedTowardsMoveDirection.findIndex(materialData => materialData.getId() === changedMaterial.getId());
                const rightMaterialArr = sortedTowardsMoveDirection.slice(changedMaterialIndex+1);

                const nextCollidedRightMaterial = rightMaterialArr.find(materialData =>
                    changedMaterial.getXRatio() + changedMaterial.getWidthRatio() > materialData.getXRatio() && !(changedMaterial.getY() + changedMaterial.getHeight()  <= materialData.getY() ||
                    changedMaterial.getY() >= materialData.getY() + materialData.getHeight())                            
                )
                if(!nextCollidedRightMaterial){
                    return;
                }
                
                nextCollidedRightMaterial.setXRatio(changedMaterial.getXRatio() + changedMaterial.getWidthRatio());
                dispatch(updateMaterialData(nextCollidedRightMaterial));
                pushRightMaterialsAfterLeftMaterialRightChange(nextCollidedRightMaterial, sortedTowardsMoveDirection);
            }

            const setSelectedMaterialsWidthRatio = (widthRatio: number) => {
                const selectedMaterialDataList = getSelectedMaterialDataArray(materialDataDict);
                for(let i=0; i<selectedMaterialDataList.length; i++){
                    if(rightToLeft){
                        selectedMaterialDataList[i].setXRatio( selectedMaterialDataList[i].getXRatio() - (widthRatio - selectedMaterialDataList[i].getWidthRatio()));
                    }
                    selectedMaterialDataList[i].setWidthRatio(widthRatio);
                    dispatch(updateMaterialData(selectedMaterialDataList[i]));
                    pushRightMaterialsAfterLeftMaterialRightChange(selectedMaterialDataList[i], sortTowardsMoveDirection())
                }
                return;
            }


            let inputValueFloat: number = parseFloat(e.currentTarget.value);
            if(!inputValueFloat) {
                setMaterialWidthInputVal("");
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
        
    },[dispatch, materialDataDict])

    // const handleMaterialWidthInputOnChange = useMemo(function () {
    //     return function (e:React.FormEvent<HTMLInputElement>) {
    //         const sortTowardsMoveDirection = () => {
    //             return getMaterialDataArray(materialDataDict).sort((a, b) => a.getXRatio() + a.getWidthRatio() - (b.getXRatio() + b.getWidthRatio()));
    //         }

    //         const pushRightMaterialsAfterLeftMaterialRightChange = (changedMaterial:MaterialData, sortedTowardsMoveDirection:MaterialData[]) => {
    //             const changedMaterialIndex = sortedTowardsMoveDirection.findIndex(materialData => materialData.getId() === changedMaterial.getId());
    //             const rightMaterialArr = sortedTowardsMoveDirection.slice(changedMaterialIndex+1);

    //             const nextCollidedRightMaterial = rightMaterialArr.find(materialData =>
    //                 changedMaterial.getXRatio() + changedMaterial.getWidthRatio() > materialData.getXRatio() && !(changedMaterial.getY() + changedMaterial.getHeight()  <= materialData.getY() ||
    //                 changedMaterial.getY() >= materialData.getY() + materialData.getHeight())                            
    //             )
    //             if(!nextCollidedRightMaterial){
    //                 return;
    //             }
                
    //             nextCollidedRightMaterial.setXRatio(changedMaterial.getXRatio() + changedMaterial.getWidthRatio());
    //             dispatch(updateMaterialData(nextCollidedRightMaterial));
    //             pushRightMaterialsAfterLeftMaterialRightChange(nextCollidedRightMaterial, sortedTowardsMoveDirection);
    //         }

    //         const setSelectedMaterialsWidthRatio = (widthRatio: number) => {
    //             const selectedMaterialDataList = getSelectedMaterialDataArray(materialDataDict);
    //             for(let i=0; i<selectedMaterialDataList.length; i++){
    //                 if(!widthChangeDirection){
    //                     selectedMaterialDataList[i].setXRatio( selectedMaterialDataList[i].getXRatio() - (widthRatio - selectedMaterialDataList[i].getWidthRatio()));
    //                 }
    //                 selectedMaterialDataList[i].setWidthRatio(widthRatio);
    //                 dispatch(updateMaterialData(selectedMaterialDataList[i]));
    //                 pushRightMaterialsAfterLeftMaterialRightChange(selectedMaterialDataList[i], sortTowardsMoveDirection())
    //             }
    //             return;
    //         }


    //         let inputValueFloat: number = parseFloat(e.currentTarget.value);
    //         if(!inputValueFloat) {
    //             setMaterialWidthInputVal("");
    //             setSelectedMaterialsWidthRatio(parseFloat(minWidth) / 100);
    //             return;
    //         };
    
    //         let minWidthFloat: number = parseFloat(minWidth);
    //         let maxWidthFloat: number = parseFloat(maxWidth);
    
    //         let nextValue: string;
    
    //         if(inputValueFloat < minWidthFloat){
    //             nextValue = minWidth;
    //         } else if(inputValueFloat > maxWidthFloat){
    //             nextValue = maxWidth;
    //         } else{
    //             nextValue = e.currentTarget.value;
    //         }
    //         setMaterialWidthInputVal(nextValue);
    //         setSelectedMaterialsWidthRatio(parseFloat(nextValue) / 100);
    //     }
    //   }, [dispatch, materialDataDict]);


    const pushUpMaterialsMemo = useMemo(function () {
        return function () {
            const sortTowardsMoveDirection = () => {
                return getMaterialDataArray(materialDataDict).sort((a, b) => b.getY() - a.getY());
            }
        
            const pushUpMaterials = (sortedTowardsMoveDirection:MaterialData[], sortedOppositeMoveDirection:MaterialData[], index:number) => {               
                //pseudo code
                //check for upper material
                //if exists set y to bottom of upper material else to 0 (floor)
                //run same function with shifted remainSortedMaterialDataArrayByY
                const currentMaterial = sortedOppositeMoveDirection[index] as MaterialData;
                // alert("currentMaterial id= "+currentMaterial.getId()+", sortedMaterialDataArrayByY[0].getId()= "+sortedMaterialDataArrayByY[0].getId()+", index= "+index)

                let collidableMaterialAbove = (() => {
                    for(const loopMaterial of sortedTowardsMoveDirection){
                        if (currentMaterial.getY() >= loopMaterial.getY() + loopMaterial.getHeight() && !(currentMaterial.getXRatio() + currentMaterial.getWidthRatio()  <= loopMaterial.getXRatio() ||
                        currentMaterial.getXRatio() >= loopMaterial.getXRatio() + loopMaterial.getWidthRatio())){
                            return loopMaterial;
                        }
                    }
                    return null;
                })();

                if(collidableMaterialAbove){
                    currentMaterial.setY(collidableMaterialAbove.getY() + collidableMaterialAbove.getHeight());
                }else{
                    currentMaterial.setY(0);
                }
                dispatch(updateMaterialData(currentMaterial));
                if(index === sortedOppositeMoveDirection.length -1) return;

                sortedTowardsMoveDirection.sort((a, b) => b.getY() - a.getY());
                pushUpMaterials(sortedTowardsMoveDirection, sortedTowardsMoveDirection.slice().reverse(), index + 1);
            }


            const sortedTowardsMoveDirection = sortTowardsMoveDirection();
            pushUpMaterials(sortedTowardsMoveDirection, sortedTowardsMoveDirection.slice().reverse(), 0)

        }
    }, [materialDataDict, dispatch]);

    const pushRightMaterialsMemo = useMemo(function () {
        return function () {
            const sortTowardsMoveDirection = () => {
                return getMaterialDataArray(materialDataDict).sort((a, b) => a.getXRatio() + a.getWidthRatio() - (b.getXRatio() + b.getWidthRatio()));
            }
        
            const pushRightMaterials = (sortedTowardsMoveDirection:MaterialData[], sortedOppositeMoveDirection:MaterialData[], index:number) => {               
                //pseudo code
                //check for upper material
                //if exists set y to bottom of upper material else to 0 (floor)
                //run same function with shifted remainSortedMaterialDataArrayByY
                const currentMaterial = sortedOppositeMoveDirection[index] as MaterialData;
                // alert("currentMaterial id= "+currentMaterial.getId()+", sortedMaterialDataArrayByY[0].getId()= "+sortedMaterialDataArrayByY[0].getId()+", index= "+index)

                let collidableMaterialAtRight = (() => {
                    for(const loopMaterial of sortedTowardsMoveDirection){
                        if (currentMaterial.getXRatio() + currentMaterial.getWidthRatio() <= loopMaterial.getXRatio() && !(currentMaterial.getY() + currentMaterial.getHeight()  <= loopMaterial.getY() ||
                        currentMaterial.getY() >= loopMaterial.getY() + loopMaterial.getHeight())){
                            return loopMaterial;
                        }
                    }
                    return null;
                })();

                if(collidableMaterialAtRight){
                    currentMaterial.setXRatio(collidableMaterialAtRight.getXRatio() - currentMaterial.getWidthRatio());
                }else{
                    currentMaterial.setXRatio(1 - currentMaterial.getWidthRatio());
                }

                dispatch(updateMaterialData(currentMaterial));
                if(index === sortedOppositeMoveDirection.length -1) return;

                sortedTowardsMoveDirection.sort((a, b) => a.getXRatio() + a.getWidthRatio() - (b.getXRatio() + b.getWidthRatio()));
                pushRightMaterials(sortedTowardsMoveDirection, sortedTowardsMoveDirection.slice().reverse(), index + 1);
            }

            const sortedTowardsMoveDirection = sortTowardsMoveDirection();

            pushRightMaterials(sortedTowardsMoveDirection, sortedTowardsMoveDirection.slice().reverse(), 0)

        }}, [materialDataDict, dispatch]);


    const handleMaterialHeightInputOnChange = useCallback((e:React.FormEvent<HTMLInputElement>, bottomToTop:boolean) => {
    
                const sortOppositeMoveDirection = () => {
                    return getMaterialDataArray(materialDataDict).sort((a, b) => a.getY() - b.getY());
                }

                const pushDownMaterialsAfterUpperMaterialBottomChange = (changedMaterial:MaterialData, sortedOppositeMoveDirection:MaterialData[]) => {
                    const changedMaterialIndex = sortedOppositeMoveDirection.findIndex(materialData => materialData.getId() === changedMaterial.getId());
                    const lowerMaterialArr = sortedOppositeMoveDirection.slice(changedMaterialIndex+1);
                    const changedMaterialBottom = changedMaterial.getY() + changedMaterial.getHeight();
                    const nextCollidedLowerMaterial = lowerMaterialArr.find(materialData => 
                        changedMaterialBottom > materialData.getY() && !(changedMaterial.getXRatio() + changedMaterial.getWidthRatio()  < materialData.getXRatio() ||
                        changedMaterial.getXRatio() > materialData.getXRatio() + materialData.getWidthRatio())                    
                    )
                    if(!nextCollidedLowerMaterial) return;

                    nextCollidedLowerMaterial.setY(changedMaterialBottom);
                    dispatch(updateMaterialData(nextCollidedLowerMaterial));
                    pushDownMaterialsAfterUpperMaterialBottomChange(nextCollidedLowerMaterial, sortedOppositeMoveDirection);

                }

            const setSelectedMaterialsHeight = (height: number) => {
                const selectedMaterialDataList = getSelectedMaterialDataArray(materialDataDict);
                for(let i=0; i<selectedMaterialDataList.length; i++){
                    if(bottomToTop){
                        selectedMaterialDataList[i].setY( selectedMaterialDataList[i].getY() - (height - selectedMaterialDataList[i].getHeight()));
                    }
                    selectedMaterialDataList[i].setHeight(height);
                    dispatch(updateMaterialData(selectedMaterialDataList[i]));
                    pushDownMaterialsAfterUpperMaterialBottomChange(selectedMaterialDataList[i], sortOppositeMoveDirection());
                }
                return;
            }

            let inputValueFloat: number = parseFloat(e.currentTarget.value);
            if(!inputValueFloat) {
                setMaterialHeightInputVal("");
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
      }, [dispatch, materialDataDict]);

    // const handleMaterialHeightInputOnChange = useMemo(function () {
    //     return function (e:React.FormEvent<HTMLInputElement>) {
    //             const sortOppositeMoveDirection = () => {
    //                 return getMaterialDataArray(materialDataDict).sort((a, b) => a.getY() - b.getY());
    //             }

    //             const pushDownMaterialsAfterUpperMaterialBottomChange = (changedMaterial:MaterialData, sortedOppositeMoveDirection:MaterialData[]) => {
    //                 const changedMaterialIndex = sortedOppositeMoveDirection.findIndex(materialData => materialData.getId() === changedMaterial.getId());
    //                 const lowerMaterialArr = sortedOppositeMoveDirection.slice(changedMaterialIndex+1);
    //                 const changedMaterialBottom = changedMaterial.getY() + changedMaterial.getHeight();
    //                 const nextCollidedLowerMaterial = lowerMaterialArr.find(materialData => 
    //                     changedMaterialBottom > materialData.getY() && !(changedMaterial.getXRatio() + changedMaterial.getWidthRatio()  < materialData.getXRatio() ||
    //                     changedMaterial.getXRatio() > materialData.getXRatio() + materialData.getWidthRatio())                    
    //                 )
    //                 if(!nextCollidedLowerMaterial) return;

    //                 nextCollidedLowerMaterial.setY(changedMaterialBottom);
    //                 dispatch(updateMaterialData(nextCollidedLowerMaterial));
    //                 pushDownMaterialsAfterUpperMaterialBottomChange(nextCollidedLowerMaterial, sortedOppositeMoveDirection);

    //             }

    //         const setSelectedMaterialsHeight = (height: number) => {
    //             const selectedMaterialDataList = getSelectedMaterialDataArray(materialDataDict);
    //             for(let i=0; i<selectedMaterialDataList.length; i++){
    //                 selectedMaterialDataList[i].setHeight(height);
    //                 dispatch(updateMaterialData(selectedMaterialDataList[i]));
    //                 pushDownMaterialsAfterUpperMaterialBottomChange(selectedMaterialDataList[i], sortOppositeMoveDirection());
    //             }
    //             return;
    //         }

    //         let inputValueFloat: number = parseFloat(e.currentTarget.value);
    //         if(!inputValueFloat) {
    //             setMaterialHeightInputVal("");
    //             setSelectedMaterialsHeight(parseFloat(minHeight));
    //             return;
    //         };
    
    //         let minHeightFloat: number = parseFloat(minHeight);
    //         let maxHeightFloat: number = parseFloat(maxHeight);
    
    //         let nextValue: string;
    
    //         if(inputValueFloat < minHeightFloat){
    //             nextValue = minHeight;
    //         } else if(inputValueFloat > maxHeightFloat){
    //             nextValue = maxHeight;
    //         } else{
    //             nextValue = e.currentTarget.value;
    //         }
    //         setMaterialHeightInputVal(nextValue);
    //         setSelectedMaterialsHeight(parseFloat(nextValue));
    //     }
    //   }, [dispatch, materialDataDict]);
      

    const handleOnBlur = (e:React.FormEvent<HTMLInputElement>) => {
        let inputValueFloat: number = parseFloat(e.currentTarget.value);
        if(!inputValueFloat) {
            switch(e.currentTarget.name){
                case("material-width-number-input"):
                    setMaterialWidthInputVal(minWidth);
                    break;
                default:
                    setMaterialHeightInputVal(minHeight);
                    break;
            }
            // setMaterialHeightInputVal(minHeight);
            // setSelectedMaterialsHeight(parseFloat(minHeight));
            return;
        };
    }


    const stopEventPropagation = useMemo(function () {
        return function (e:React.TouchEvent<HTMLDivElement>) {
          e.stopPropagation();
        }
       }, []);

    return (
        <div className={`${styles['main-wrapper']}`} style={{"left":""+ directionalButtonPos[0] +"px", "top":""+ directionalButtonPos[1] +"px"}} onTouchEnd={stopEventPropagation}>
            <DirectionalButton/>
            <div className={`${styles['material-size-input-wrappers']}`}>
                <div className={`${styles['material-size-input-wrapper']} ${styles['material-width-input-wrapper']}`}>
                    {/* <DoubleRangeSlider/> */}
                    <div className={`${styles['material-size-range-inputs-wrapper']}`}>
                        <input className={`${styles['material-size-range-input']} ${styles['material-size-range-input-rtl']} ${styles['material-width-range-input']}`} 
                            name="material-width-range-input-rtl" 
                            type="range" 
                            min={minWidth} 
                            max={maxWidth} 
                            value={materialWidthInputVal ? materialWidthInputVal : 0} 
                            onChange={(e) => {handleMaterialWidthInputOnChange(e, true)}} />
                        <input className={`${styles['material-size-range-input']} ${styles['material-size-range-input-ltr']} ${styles['material-width-range-input']}`} 
                            name="material-width-range-input-ltr" 
                            type="range" 
                            min={minWidth} 
                            max={maxWidth} 
                            value={materialWidthInputVal ? materialWidthInputVal : 0} 
                            onChange={(e) => {handleMaterialWidthInputOnChange(e, false)}} />
                    </div>
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
                    <span>w</span>
                    <input className={`${styles['material-size-number-input']} 
                        ${styles['material-width-number-input']}`} 
                        name="material-width-number-input" type="number" 
                        value={materialWidthInputVal} 
                        onChange={(e) => {handleMaterialWidthInputOnChange(e, false)}}
                        onBlur={handleOnBlur}/>
                    <span className={`${styles['size-unit']}`}>%</span>
                </div>
                <div className={`${styles['material-size-input-wrapper']} ${styles['material-height-input-wrapper']}`}>
                    <div className={`${styles['material-size-range-inputs-wrapper']}`}>
                        <input className={`${styles['material-size-range-input']} ${styles['material-size-range-input-rtl']} ${styles['material-height-range-input']}`} 
                            name="material-height-range-input-rtl" 
                            type="range" 
                            min={minHeight} 
                            max={maxHeight} 
                            value={materialHeightInputVal? materialHeightInputVal : 0}
                            onChange={(e) => {handleMaterialHeightInputOnChange(e, true)}}/>
                        <input className={`${styles['material-size-range-input']} ${styles['material-size-range-input-ltr']} ${styles['material-height-range-input']}`} 
                            name="material-height-range-input-ltr" 
                            type="range" 
                            min={minHeight} 
                            max={maxHeight} 
                            value={materialHeightInputVal? materialHeightInputVal : 0} 
                            onChange={(e) => {handleMaterialHeightInputOnChange(e, false)}}/>
                    </div>
                    <span>h</span>
                    <input className={`${styles['material-size-number-input']} ${styles['material-height-number-input']}`}
                        name="material-height-number-input" 
                        type="number" 
                        value={materialHeightInputVal} 
                        onChange={(e) => {handleMaterialHeightInputOnChange(e, false)}}
                        onBlur={handleOnBlur}/>
                    <span className={`${styles['size-unit']}`}>px</span>
                </div>
                <div className={`${styles['push-buttons-wrapper']}`} >
                    <button className={`${styles['push-button']} ${styles['push-up-button']}`} onTouchEnd={pushUpMaterialsMemo}>&#8593;</button>
                    <div className={`${styles['push-left-right-buttons-wrapper']}`}>
                        <button className={`${styles['push-button']} ${styles['push-left-button']}`} onTouchEnd={pushUpMaterialsMemo}>&#8592;</button>
                        <button className={`${styles['push-button']} ${styles['push-right-button']}`} onTouchEnd={pushRightMaterialsMemo}>&#8594;</button>
                    </div>
                    <button className={`${styles['push-button']} ${styles['push-down-button']}`} onTouchEnd={pushUpMaterialsMemo}>&#8595;</button>
                </div>
            </div>
        </div>
        );
  };
  
  export default MaterialSizePosMenu;