import { MutableRefObject, TouchEventHandler, useEffect, useMemo, useRef, useState } from 'react';
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

    useEffect(()=>{
        setDirectionalButtonPos([screenSize[0] * 0.5, screenSize[1] * 0.6]);
        // setKonvaSize([screenWidth * KONVA_WIDTH_SCALE, screenHeight * KONVA_HEIGHT_SCALE]);
        // setKonvaPos([(screenWidth - konvaSize[0]) * 0.5, (screenHeight - konvaSize[1]) * 0.5]);
    }, [screenSize]);

    useEffect(()=>{
        if(!touches || !isRecording){
            return
        }
        const konvaPos = [(screenSize[0] - screenSize[0] * KONVA_WIDTH_SCALE) * 0.5, (screenSize[1] - screenSize[1] * KONVA_HEIGHT_SCALE) * 0.5] as [number, number];
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

        
    },[touches, isRecording, screenSize]);

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
        }
      }, [dispatch, materialDataDict]);
     


    //   const pushUpMaterialsMemoOldVersion = useMemo(function () {
    //     return function () {
    //         const sortMaterialDataArrayByY = () => {
    //             return getMaterialDataArray(materialDataDict).sort((a, b) => a.getY() - b.getY());
    //         }
        
    //         const pushUpMaterials = (sortedMaterialDataArrayByY:MaterialData[], sortedMaterialDataArrayByYDesc:MaterialData[], index:number) => {               
    //             //pseudo code
    //             //check for upper material
    //             //if exists set y to bottom of upper material else to 0 (floor)
    //             //run same function with shifted remainSortedMaterialDataArrayByY
    //             const currentMaterial = sortedMaterialDataArrayByY[index] as MaterialData;
    //             // alert("currentMaterial id= "+currentMaterial.getId()+", sortedMaterialDataArrayByY[0].getId()= "+sortedMaterialDataArrayByY[0].getId()+", index= "+index)

    //             let collidableMaterialAbove = (() => {
    //                 for(const loopMaterial of sortedMaterialDataArrayByYDesc){
    //                     if (currentMaterial.getY() >= loopMaterial.getY() + loopMaterial.getHeight() && !(currentMaterial.getXRatio() + currentMaterial.getWidthRatio()  <= loopMaterial.getXRatio() ||
    //                     currentMaterial.getXRatio() >= loopMaterial.getXRatio() + loopMaterial.getWidthRatio())){
    //                         return loopMaterial;
    //                     }
    //                 }
    //                 return null;
    //             })();

    //             if(collidableMaterialAbove){
    //                 currentMaterial.setY(collidableMaterialAbove.getY() + collidableMaterialAbove.getHeight());
    //             }else{
    //                 currentMaterial.setY(0);
    //             }
    //             dispatch(updateMaterialData(currentMaterial));
    //             if(index === sortedMaterialDataArrayByY.length -1) return;

    //             sortedMaterialDataArrayByY.sort((a, b) => a.getY() - b.getY());
    //             sortedMaterialDataArrayByYDesc.sort((a, b) => b.getY() - a.getY());

    //             pushUpMaterials(sortedMaterialDataArrayByY, sortedMaterialDataArrayByYDesc, index + 1);
    //         }

    //         const sortedMaterialDataArrayByY = sortMaterialDataArrayByY();

    //         pushUpMaterials(sortedMaterialDataArrayByY, sortedMaterialDataArrayByY.slice().reverse(), 0)

    //     }
    // }, [materialDataDict, dispatch]);


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


    //   const pushUpMaterials = (remainSortedMaterialDataArrayByYDesc:MaterialData[], materialLinksDict:{ [key: string]: MaterialData[] }) => {               
    //     //pseudo code
    //     //a material can be linked to the floor (top 0) or a material
    //     //we start from the bottom

    //     //create a materialLinksDict like id: {materialData:MaterialData, linkedMaterialDataArray:MaterialData[]}
    //     //while(oneMaterialIsStillNotChained){
    //         //checkColision between lower materialData (sortedMaterialDataArrayByYDesc[0])

    //     //}

    //     //check colision between lower materialData (remainSortedMaterialDataArrayByYDesc[0]) and material above.
    //     //if no collision link material to the floor (top 0)
    //     //if collision link material to collided material

    //     //move up material to the bottom of collided material
    //     //move up linked material of this material by the distance of the previous move
    //     //pop this material from remainSortedMaterialDataArrayByYDesc

    //     //pass remainSortedMaterialDataArrayByYDesc and materialLinksDict to pushUpMaterialsToRemoveVoidBetweenMaterials


    //     const lowestMaterialData = remainSortedMaterialDataArrayByYDesc.shift() as MaterialData;
        
    //     let collidableMaterialAbove = (() => {
    //         for(const upperMaterialData of remainSortedMaterialDataArrayByYDesc){
    //             if (!(lowestMaterialData.getXRatio() + lowestMaterialData.getWidthRatio()  < upperMaterialData.getXRatio() ||
    //             lowestMaterialData.getXRatio() > upperMaterialData.getXRatio() + upperMaterialData.getWidthRatio())){
    //                 return upperMaterialData;
    //             }
    //         }
    //         return null;
    //     })();

    //     let lowestMaterialDataYBeforeUpdate = lowestMaterialData.getY();
    //     if(collidableMaterialAbove){
    //         materialLinksDict[collidableMaterialAbove.getId()].push(lowestMaterialData);
    //         lowestMaterialData.setY(collidableMaterialAbove.getY() + collidableMaterialAbove.getHeight());
    //     }else{
    //         lowestMaterialData.setY(0);
    //     }
    //     dispatch(updateMaterialData(lowestMaterialData));

    //     const updateLinkedMaterials = (materialDataId:string, dy:number) => {
    //         for(const linkedMaterial of materialLinksDict[materialDataId]){
    //             linkedMaterial.setY(linkedMaterial.getY() - dy);
    //             dispatch(updateMaterialData(linkedMaterial));
    //             updateLinkedMaterials(linkedMaterial.getId(), dy);
    //         }
    //     }

    //     updateLinkedMaterials(lowestMaterialData.getId(), lowestMaterialDataYBeforeUpdate - lowestMaterialData.getY());

    //     if(!remainSortedMaterialDataArrayByYDesc.length) return;
    //     pushUpMaterials(remainSortedMaterialDataArrayByYDesc, materialLinksDict)
    // }

    const handleMaterialHeightInputOnChange = useMemo(function () {
        return function (e:React.FormEvent<HTMLInputElement>) {
                const sortMaterialDataArrayByY = () => {
                    return getMaterialDataArray(materialDataDict).sort((a, b) => a.getY() - b.getY());
                }
                const sortOppositeMoveDirection = () => {
                    return getMaterialDataArray(materialDataDict).sort((a, b) => a.getY() - b.getY());
                }
                const sortMaterialDataArrayByYDesc = () => {
                    return getMaterialDataArray(materialDataDict).sort((a, b) => b.getY() - a.getY());
                }
                // const pushUpMaterialsToRemoveVoidBetweenMaterials = (materialData:MaterialData, sortedMaterialDataArrayByY:MaterialData[]) => {               
                //     //we check if materialData has a material above him if not move it to the top
                //     const materialDataIndex = sortedMaterialDataArrayByY.findIndex(materialDataArg => materialDataArg.getId() === materialData.getId());
                //     const upperMaterialArr = sortedMaterialDataArrayByY.slice(0, materialDataIndex);

                //     let collisionIfMovedUp = false;
                //     for(const materialDataArg of upperMaterialArr){
                //         collisionIfMovedUp = !(materialData.getXRatio() + materialData.getWidthRatio()  < materialDataArg.getXRatio() ||
                //         materialData.getXRatio() > materialDataArg.getXRatio() + materialDataArg.getWidthRatio())
                //         // alert("materialData.getId(): " + materialData.getId() + ", collisionIfMovedUp: "+collisionIfMovedUp);
                //         if(collisionIfMovedUp) break;
                //     }
                //     alert(materialData.getId()+" hey ")

                //     if(materialData.getY() && !collisionIfMovedUp){
                //         // alert(materialData.getId())
                //         materialData.setY(0);
                //         dispatch(updateMaterialData(materialData));
                //     }

                //     const lowerMaterialArr = sortedMaterialDataArrayByY.slice(materialDataIndex+1);
                //     const materialDataBottom = materialData.getY() + materialData.getHeight();
                //     const nextCollidedLowerMaterial = lowerMaterialArr.find(materialDataArg => 
                //         materialDataBottom <= materialDataArg.getY() && !(materialData.getXRatio() + materialData.getWidthRatio()  < materialDataArg.getXRatio() ||
                //         materialData.getXRatio() > materialDataArg.getXRatio() + materialDataArg.getWidthRatio())                    
                //     )
                //     if(!nextCollidedLowerMaterial) return;

                //     nextCollidedLowerMaterial.setY(materialDataBottom);
                //     dispatch(updateMaterialData(nextCollidedLowerMaterial));
                //     pushUpMaterialsToRemoveVoidBetweenMaterials(nextCollidedLowerMaterial, sortedMaterialDataArrayByY);
                // }

                // const pushUpMaterialsToRemoveVoidBetweenMaterials = (passedSortedMaterialDataArrayByY:MaterialData[], remainingSortedMaterialDataArrayByY:MaterialData[], first:boolean) => {               
                //     //we check if materialData has a material above him if not move it to the top
                //     // const materialDataIndex = sortedMaterialDataArrayByY.findIndex(materialDataArg => materialDataArg.getId() === materialData.getId());
                //     // const upperMaterialArr = sortedMaterialDataArrayByY.slice(0, materialDataIndex);

                //     // let collisionIfMovedUp = false;
                //     // for(const materialDataArg of upperMaterialArr){
                //     //     collisionIfMovedUp = !(materialData.getXRatio() + materialData.getWidthRatio()  < materialDataArg.getXRatio() ||
                //     //     materialData.getXRatio() > materialDataArg.getXRatio() + materialDataArg.getWidthRatio())
                //     //     // alert("materialData.getId(): " + materialData.getId() + ", collisionIfMovedUp: "+collisionIfMovedUp);
                //     //     if(collisionIfMovedUp) break;
                //     // }
                //     // alert(materialData.getId()+" hey ")

                //     // if(materialData.getY() && !collisionIfMovedUp){
                //     //     // alert(materialData.getId())
                //     //     materialData.setY(0);
                //     //     dispatch(updateMaterialData(materialData));
                //     // }

                //     const materialData = remainingSortedMaterialDataArrayByY.shift() as MaterialData;

                //     //if no collidable material above, move it to the top
                //     let collidableMaterialAbove = false;
                //     for(const materialDataArg of passedSortedMaterialDataArrayByY){
                //         collidableMaterialAbove = !(materialData.getXRatio() + materialData.getWidthRatio()  < materialDataArg.getXRatio() ||
                //         materialData.getXRatio() > materialDataArg.getXRatio() + materialDataArg.getWidthRatio())
                //         // alert("materialData.getId(): " + materialData.getId() + ", collisionIfMovedUp: "+collisionIfMovedUp);
                //         if(collidableMaterialAbove) break;
                //     }
                //     if(materialData.getY() && !collidableMaterialAbove){
                //         // alert(materialData.getId())
                //         materialData.setY(0);
                //         dispatch(updateMaterialData(materialData));
                //     }

                //     const materialDataBottom = materialData.getY() + materialData.getHeight();
                //     const nextCollidedLowerMaterial = remainingSortedMaterialDataArrayByY.find(materialDataArg => 
                //         materialDataBottom <= materialDataArg.getY() && !(materialData.getXRatio() + materialData.getWidthRatio()  < materialDataArg.getXRatio() ||
                //         materialData.getXRatio() > materialDataArg.getXRatio() + materialDataArg.getWidthRatio())                    
                //     )
                //     if(nextCollidedLowerMaterial){
                //         nextCollidedLowerMaterial.setY(materialDataBottom);
                //         dispatch(updateMaterialData(nextCollidedLowerMaterial));
                //     }

                //     if(remainingSortedMaterialDataArrayByY.length === 1) return;

                //     passedSortedMaterialDataArrayByY.push(materialData);
                //     pushUpMaterialsToRemoveVoidBetweenMaterials(passedSortedMaterialDataArrayByY, remainingSortedMaterialDataArrayByY, false);
                // }

                const pushUpMaterialsToRemoveVoidBetweenMaterials = (remainSortedMaterialDataArrayByYDesc:MaterialData[], materialLinksDict:{ [key: string]: MaterialData[] }) => {               
                    //pseudo code
                    //a material can be linked to the floor (top 0) or a material
                    //we start from the bottom

                    //create a materialLinksDict like id: {materialData:MaterialData, linkedMaterialDataArray:MaterialData[]}
                    //while(oneMaterialIsStillNotChained){
                        //checkColision between lower materialData (sortedMaterialDataArrayByYDesc[0])

                    //}

                    //check colision between lower materialData (remainSortedMaterialDataArrayByYDesc[0]) and material above.
                    //if no collision link material to the floor (top 0)
                    //if collision link material to collided material

                    //move up material to the bottom of collided material
                    //move up linked material of this material by the distance of the previous move
                    //pop this material from remainSortedMaterialDataArrayByYDesc

                    //pass remainSortedMaterialDataArrayByYDesc and materialLinksDict to pushUpMaterialsToRemoveVoidBetweenMaterials

  
                    const lowestMaterialData = remainSortedMaterialDataArrayByYDesc.shift() as MaterialData;
                    
                    let collidableMaterialAbove = (() => {
                        for(const upperMaterialData of remainSortedMaterialDataArrayByYDesc){
                            if (!(lowestMaterialData.getXRatio() + lowestMaterialData.getWidthRatio()  < upperMaterialData.getXRatio() ||
                            lowestMaterialData.getXRatio() > upperMaterialData.getXRatio() + upperMaterialData.getWidthRatio())){
                                return upperMaterialData;
                            }
                        }
                        return null;
                    })();

                    let lowestMaterialDataYBeforeUpdate = lowestMaterialData.getY();
                    if(collidableMaterialAbove){
                        materialLinksDict[collidableMaterialAbove.getId()].push(lowestMaterialData);
                        lowestMaterialData.setY(collidableMaterialAbove.getY() + collidableMaterialAbove.getHeight());
                    }else{
                        lowestMaterialData.setY(0);
                    }
                    dispatch(updateMaterialData(lowestMaterialData));

                    const updateLinkedMaterials = (materialDataId:string, dy:number) => {
                        for(const linkedMaterial of materialLinksDict[materialDataId]){
                            linkedMaterial.setY(linkedMaterial.getY() - dy);
                            dispatch(updateMaterialData(linkedMaterial));
                            updateLinkedMaterials(linkedMaterial.getId(), dy);
                        }
                    }

                    updateLinkedMaterials(lowestMaterialData.getId(), lowestMaterialDataYBeforeUpdate - lowestMaterialData.getY());

                    if(!remainSortedMaterialDataArrayByYDesc.length) return;
                    pushUpMaterialsToRemoveVoidBetweenMaterials(remainSortedMaterialDataArrayByYDesc, materialLinksDict)
                }

                const pushDownMaterialsAfterUpperMaterialBottomChange = (changedMaterial:MaterialData, sortedOppositeMoveDirection:MaterialData[]) => {
                    const changedMaterialIndex = sortedOppositeMoveDirection.findIndex(materialData => materialData.getId() === changedMaterial.getId());
                    const lowerMaterialArr = sortedOppositeMoveDirection.slice(changedMaterialIndex+1);
                    const changedMaterialBottom = changedMaterial.getY() + changedMaterial.getHeight();
                    const nextCollidedLowerMaterial = lowerMaterialArr.find(materialData => 
                        changedMaterialBottom > materialData.getY() && !(changedMaterial.getXRatio() + changedMaterial.getWidthRatio()  < materialData.getXRatio() ||
                        changedMaterial.getXRatio() > materialData.getXRatio() + materialData.getWidthRatio())                    
                    )
                    if(!nextCollidedLowerMaterial){
                        //finished, we update materialDataDict, we remove voids between materials and return
                        // pushUpMaterialsToRemoveVoidBetweenMaterials([], sortedMaterialDataArrayByY, true);
                        // const sortedMaterialDataArrayByYDesc = sortMaterialDataArrayByYDesc();

                        // const materialLinksDict:{ [key: string]: MaterialData[]; } = {};                   
                        // for(const materialData of sortedMaterialDataArrayByYDesc){
                        //     materialLinksDict[materialData.getId()] = [];
                        // }

                        // // pushUpMaterialsToRemoveVoidBetweenMaterials(sortedMaterialDataArrayByYDesc, materialLinksDict)
                        return;
                    }
                    nextCollidedLowerMaterial.setY(changedMaterialBottom);
                    dispatch(updateMaterialData(nextCollidedLowerMaterial));
                    pushDownMaterialsAfterUpperMaterialBottomChange(nextCollidedLowerMaterial, sortedOppositeMoveDirection);

                }

            const setSelectedMaterialsHeight = (height: number) => {
                const selectedMaterialDataList = getSelectedMaterialDataArray(materialDataDict);
                for(let i=0; i<selectedMaterialDataList.length; i++){
                    selectedMaterialDataList[i].setHeight(height);
                    dispatch(updateMaterialData(selectedMaterialDataList[i]));
                    pushDownMaterialsAfterUpperMaterialBottomChange(selectedMaterialDataList[i], sortOppositeMoveDirection());
                    // pushUpMaterialsToRemoveVoidBetweenMaterials();
                    // pushUpMaterialsToRemoveVoidBetweenMaterials(sortedMaterialDataArrayByY()[0], [], sortedMaterialDataArrayByY());
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
        }
      }, [dispatch, materialDataDict]);
      

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
                    <input className={`${styles['material-size-range-input']} ${styles['material-width-range-input']}`} 
                        name="material-width-range-input" 
                        type="range" 
                        min={minWidth} 
                        max={maxWidth} 
                        value={materialWidthInputVal ? materialWidthInputVal : 0} 
                        onChange={handleMaterialWidthInputOnChange} />

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
                        onChange={handleMaterialWidthInputOnChange}
                        onBlur={handleOnBlur}/>
                    <span className={`${styles['size-unit']}`}>%</span>
                </div>
                <div className={`${styles['material-size-input-wrapper']} ${styles['material-height-input-wrapper']}`}>
                    <span>h</span>
                    <input className={`${styles['material-size-number-input']} ${styles['material-height-number-input']}`}
                        name="material-height-number-input" 
                        type="number" 
                        value={materialHeightInputVal} 
                        onChange={handleMaterialHeightInputOnChange}
                        onBlur={handleOnBlur}/>
                    <span className={`${styles['size-unit']}`}>px</span>
                    <input className={`${styles['material-size-range-input']} ${styles['material-height-range-input']}`} 
                        name="material-height-range-input" 
                        type="range" 
                        min={minHeight} 
                        max={maxHeight} 
                        value={materialHeightInputVal? materialHeightInputVal : 0} 
                        onChange={handleMaterialHeightInputOnChange} />
                </div>
                <button onTouchEnd={pushUpMaterialsMemo}>^</button>
                <button onTouchEnd={pushRightMaterialsMemo}>&gt;</button>
                {/* <button onTouchEnd={pushUpMaterialsMemo}>&lt;</button> */}
            </div>
        </div>
        );
  };
  
  export default MaterialSizePosMenu;