import { MutableRefObject, TouchEventHandler, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import styles from './material-size-pos-menu.module.scss'
import { useDispatch, useSelector } from 'react-redux';
import { selectIsRecording, selectScreenSize, selectTouches } from '@/redux/screen-event/screen-event.selectors';
import { Direction, KONVA_HEIGHT_SCALE, KONVA_WIDTH_SCALE, MaterialData, getMaterialDataArray, getPlanLimit, getSelectedMaterialDataArray, KonvaPlanHandler } from '@/global';
import { updateMaterialData } from '@/redux/konva/konva.actions';
import { selectDraggingBlockDimMenu, selectMaterialDataDict, selectPadPosition } from '@/redux/konva/konva.selectors';
import { setIsRecording } from '@/redux/screen-event/screen-event.actions';
import DirectionalButton from '../directional-button/directional-button.component';
// import DoubleRangeSlider from '../double-range-slider/double-range-slider.component';

const MaterialSizePosMenu: React.FC = () => {
    // const [directionButtonInitialPos, setDirectionButtonInitialPos] = useState<[number, number]>([0, 0]);
    const outOfScreenPos = -1000;

    const [directionalButtonPos, setDirectionalButtonPos] = useState<[number, number]>([outOfScreenPos, outOfScreenPos]);
    const touches:React.TouchList | null = useSelector(selectTouches);
    const dispatch = useDispatch();
    const screenSize: [number, number] = useSelector(selectScreenSize);
    const materialDataDict:{ [key: string]: MaterialData } = useSelector(selectMaterialDataDict);
    const draggingBlockDimMenu = useSelector(selectDraggingBlockDimMenu);
    // const [draggable, setDraggable] = useState<boolean>(false);
    // const initialPosScreenRatio = [0.5, 0.7];
    const [materialWidthInputVal, setMaterialWidthInputVal ] = useState<string>("0");
    const [materialHeightInputVal, setMaterialHeightInputVal ] = useState<string>("0");
    const padPosition:[number, number] = useSelector(selectPadPosition);

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
        setDirectionalButtonPos([screenSize[0] * 0.7, screenSize[1] * 0.6]);
    }, [screenSize]);

    useEffect(()=>{
        if(!(draggingBlockDimMenu && touches && isRecording)){
            return
        }
        const konvaPos = [(screenSize[0] - screenSize[0] * KONVA_WIDTH_SCALE) * 0.5, (screenSize[1] - screenSize[1] * KONVA_HEIGHT_SCALE) * 0.5] as [number, number];
        const touchPos = getTouchPos(touches[0], konvaPos);
        // alert("touches[0].clientX = "+touches[0].clientX+", window.innerWidth = "+window.innerWidth);
        // setDirectionalButtonPos([touches[0].clientX, touches[0].clientY]);

    },[touches, isRecording, screenSize, draggingBlockDimMenu]);

    useEffect(()=>{
        if(!padPosition) return;
        setDirectionalButtonPos(padPosition);
    },[padPosition])

    const getTouchPos = (touch:React.Touch, konvaPos:[number, number]): [number, number] => {
        const touchX = touch.clientX - konvaPos[0];
        const touchY = touch.clientY - konvaPos[1];
        return [touchX, touchY]
      }

      const blocIsVerticallyInPath = (materialA:MaterialData, materialB:MaterialData ):boolean => {
        return !(materialA.getXRatio() + materialA.getWidthRatio()  <= materialB.getXRatio() ||
        materialA.getXRatio() >= materialB.getXRatio() + materialB.getWidthRatio())    
    }

    const blocIsHorizontallyInPath = (materialA:MaterialData, materialB:MaterialData ):boolean => {
        return !(materialA.getY() + materialA.getHeight()  <= materialB.getY() ||
        materialA.getY() >= materialB.getY() + materialB.getHeight())
    }



    const bloc1EndBeforeThanBloc2Start = (a:MaterialData, b: MaterialData, direction:Direction, strictly:boolean):boolean =>{
        switch(direction){
            case Direction.ToLeft:
            case Direction.ToTop:
                return strictly? a.getEnd(direction) > b.getStart(direction) : a.getEnd(direction) >= b.getStart(direction);
            case Direction.ToRight:
            case Direction.ToBottom:
                return strictly? a.getEnd(direction) < b.getStart(direction) : a.getEnd(direction) <= b.getStart(direction);
        }
    }
    // const setBlocPosition = (a:MaterialData, direction:Direction, newValue:number | null, overflow:number) =>{
    //     switch(direction){
    //         case Direction.ToRight:
    //         case Direction.ToLeft:
    //             a.setXRatio((newValue || a.getXRatio()) - overflow);
    //             break;
    //         default:
    //             return false;
    //     }

    // }

    const bloc1EndExceedsBloc2Start = (bloc1NextEnd:number, bloc2:MaterialData, direction:Direction): number =>{
        let shift;
        const tolerance = 0.1;
        switch(direction){
            case Direction.ToLeft:
            case Direction.ToTop:
                shift = bloc1NextEnd - bloc2.getStart(direction);
                return Math.abs(shift) > tolerance ? shift : 0;
            case Direction.ToRight:
            case Direction.ToBottom:
                shift = bloc2.getStart(direction) - bloc1NextEnd;
                return Math.abs(shift) > tolerance ? shift : 0;
        }
    }

    const bloc1StartMinusBloc2NextEnd = (bloc1: MaterialData, bloc1NextPos: number, direction:Direction ): number => {
        let block1WithNextPosEnd:number = 0;
        switch(direction){
            case Direction.ToLeft:
                block1WithNextPosEnd = bloc1NextPos;
                break;
            case Direction.ToRight:
                block1WithNextPosEnd = bloc1NextPos + bloc1.getWidthRatio();
                break;
            default:
                break;
        }
        return bloc1.getStart(direction) - block1WithNextPosEnd;

    }

    const sortBackwardsDirectionByEnd = (direction:Direction) =>{
        let aSign: number = 1;
        let bSign: number = 1;

        switch(direction){
            case Direction.ToLeft:
            case Direction.ToTop:
                aSign = 1;
                bSign = -1
            break;
            case Direction.ToRight:
            case Direction.ToBottom:
                aSign = -1;
                bSign = 1
            break;
            }

        return getMaterialDataArray(materialDataDict).sort((a, b) => a.getEnd(direction) * aSign + b.getEnd(direction) * bSign);
    }
    const calculateNextCollidableNextPos = (nextCollidable:MaterialData, pushingBlocNextEnd:number, direction:Direction): number =>{
        let shift:number = 0;
        let block1WithNextPosEnd:number = 0;
        
        switch(direction){
            case Direction.ToLeft:
                block1WithNextPosEnd = pushingBlocNextEnd;
                shift =  nextCollidable.getStart(direction) - block1WithNextPosEnd;
                return nextCollidable.getXRatio() - shift;
            case Direction.ToTop:
                block1WithNextPosEnd = pushingBlocNextEnd;
                shift =  nextCollidable.getStart(direction) - block1WithNextPosEnd;
                return nextCollidable.getY() - shift;
            case Direction.ToRight:
                shift = pushingBlocNextEnd - nextCollidable.getStart(direction);
                return nextCollidable.getXRatio() + shift;
            case Direction.ToBottom:
                shift = pushingBlocNextEnd - nextCollidable.getStart(direction);
                return nextCollidable.getY() + shift;
        }
    }

    const calculateValueMinusOverflowWithDirection = (value:number, overflow:number, direction:Direction):number => {
        switch(direction){
            case Direction.ToLeft:
            case Direction.ToTop:
                return value - overflow;
            case Direction.ToRight:
            case Direction.ToBottom:
                return value + overflow;
        }
    }

    const oppositeDirection = (direction:Direction):Direction =>{
        switch(direction){
            case Direction.ToLeft:
                return Direction.ToRight;
            case Direction.ToTop:
                return Direction.ToBottom;
            case Direction.ToRight:
                return Direction.ToLeft;
            case Direction.ToBottom:
                return Direction.ToTop;
        }
    }
    
    const handleMaterialSizeInputOnChange = useCallback((e:React.FormEvent<HTMLInputElement>, direction:Direction)=>{
            const sortTowardsMoveDirection = () => {
                return getMaterialDataArray(materialDataDict).sort((a, b) => a.getXRatio() + a.getWidthRatio() - (b.getXRatio() + b.getWidthRatio()));
            }
            const sortTowardsDirection = (direction:Direction):MaterialData[] =>{
                let aSign: number = 1;
                let bSign: number = 1;
        
                switch(direction){
                    case Direction.ToLeft:
                    case Direction.ToTop:
                        aSign = -1;
                        bSign = 1
                        return getMaterialDataArray(materialDataDict).sort((a, b) => a.getStart(direction) * aSign + b.getStart(direction) * bSign);
                    case Direction.ToRight:
                    case Direction.ToBottom:
                        aSign = 1;
                        bSign = -1
                        return getMaterialDataArray(materialDataDict).sort((a, b) => a.getStart(direction) * aSign + b.getStart(direction) * bSign);
                    }
            }
            const blocIsInPath = (materialA:MaterialData, materialB:MaterialData, direction: Direction):boolean => {
                if(direction === Direction.ToLeft || direction === Direction.ToRight){
                    return blocIsHorizontallyInPath(materialA, materialB);
                } else{
                    return blocIsVerticallyInPath(materialA, materialB);
        
                }
            }

            const pushWhenResizing = (resizingBloc:MaterialData, inputValue:number, pushDirection:Direction) => {
                class CollidableData{
                    shiftsAndPos:[number, number][] = [];
                    isAtExtremity:boolean = false; 
                }

                class CollidablesHandler{
                    collidables:{ [key: string]: CollidableData };
                    overflows:[MaterialData, number][];

                    constructor(collidables:{ [key: string]: CollidableData }, overflows:[MaterialData, number][]){
                        this.collidables = collidables;
                        this.overflows = overflows;
                    }
                }


                const pushNextBlocs = (pushingBloc:MaterialData, pushingBlocNextEnd:number, sortedTowardsPush:MaterialData[], blocToIgnoreId:string, pushDirection:Direction, collidablesHandler: CollidablesHandler) => {
                    const pushingBlocIndex = sortedTowardsPush.findIndex(bloc => bloc.getId() === pushingBloc.getId());
                    const nextBlocs = sortedTowardsPush.slice(pushingBlocIndex+1); 
    
                    const nextInPathBlocs = nextBlocs.filter(bloc => 
                        blocIsInPath(pushingBloc, bloc, pushDirection)
                    );
                    const nextInPathBackwardsPush = nextInPathBlocs.slice().reverse();
                    const nextCollidableBlocs:MaterialData[] = [];
                    
                    while(nextInPathBackwardsPush.length){
                        const nextlastBloc = nextInPathBackwardsPush.shift() as MaterialData;
                        let collidesPushingBloc = true;
                        for(let i=0; i<nextInPathBackwardsPush.length; i++){
                            if(blocIsInPath(nextlastBloc, nextInPathBackwardsPush[i], pushDirection)){
                                collidesPushingBloc = false;
                                break;
                            }
                        }
                        if(collidesPushingBloc){
                            nextCollidableBlocs.push(nextlastBloc);
                        }
                    }
                    if(!nextCollidableBlocs.length && collidablesHandler.collidables[pushingBloc.getId()]){
                        collidablesHandler.collidables[pushingBloc.getId()].isAtExtremity = true;
                    }

                    for(const nextCollidable of nextCollidableBlocs){
                        //if bloc1 next end before than bloc2 end
                        const shift = bloc1EndExceedsBloc2Start(pushingBlocNextEnd, nextCollidable, pushDirection);
                        if(shift < 0 && nextCollidable.getId() !== blocToIgnoreId){

                        // if(bloc1PoslowerThanBloc2End(pushingBlocNextPos, nextCollidable, pushDirection)){
                            // alert("ok")

                            // const shift = bloc1StartMinusBloc2NextEnd(nextCollidable, pushingBlocNextEnd, pushDirection);
                            // nextCollidable.getEnd(pushDirection) - shift;

                            if(!collidablesHandler.collidables[nextCollidable.getId()]){
                                collidablesHandler.collidables[nextCollidable.getId()] = new CollidableData(); 
                            }

                            const nextCollidableNextPos = calculateNextCollidableNextPos(nextCollidable, pushingBlocNextEnd,pushDirection);
                            collidablesHandler.collidables[nextCollidable.getId()].shiftsAndPos.push([Math.abs(shift), nextCollidableNextPos]);

                            const nextCollidableNextEnd = nextCollidable.calculateEndWithPosAndDirection(nextCollidableNextPos, pushDirection);
                            
                            const overflow = KonvaPlanHandler.valueOverflow(nextCollidableNextEnd, pushDirection);//nextCollidableNextPos < 0 ? nextCollidableNextPos : 0;
                            collidablesHandler.overflows.push([nextCollidable, overflow]);


                            // nextCollidable.setPos(nextCollidableNextPos, pushDirection);
                            // dispatch(updateMaterialData(nextCollidable));

                            // blocsToUpdate.push([nextCollidable, nextCollidableNextPos, overflow]);

                            pushNextBlocs(nextCollidable, nextCollidableNextEnd, sortedTowardsPush, blocToIgnoreId, pushDirection, collidablesHandler);
                        }
                    }
                }

 
                let sortedTowardsPush: MaterialData[] = sortTowardsDirection(pushDirection);  

                // for(const bloc of sortedTowardsPush){
                //     alert("blocId = "+bloc.getId()+", bloc.getXRatio() = "+bloc.getXRatio()+", bloc.getY() = "+bloc.getY() )
                // }
                
                const resizingBlocNextSize = inputValue;
                const resizingBlocNextEnd = resizingBloc.calculateEndWithSizeAndDirection(resizingBlocNextSize, pushDirection);
                const collidablesHandler = new CollidablesHandler({}, []);
                // let initialPositions:[string, number][] = [];
                
                // for(const bloc of sortedTowardsPush){
                //     initialPositions.push([bloc.getId(), bloc.getPos(pushDirection)]);
                // }

                pushNextBlocs(resizingBloc, resizingBlocNextEnd, sortedTowardsPush, '', pushDirection, collidablesHandler);

                const pushedBlocks: MaterialData[] = [];

                // const collidablesAtExtremity: [MaterialData, number][] = [];
                for(const blocId in collidablesHandler.collidables){
                    const collidableData = collidablesHandler.collidables[blocId];
                    const biggestShiftPos =  collidableData.shiftsAndPos.sort((a, b) => b[0] - a[0])[0][1];
                    const bloc = materialDataDict[blocId];
                    pushedBlocks.push(bloc);
                    // alert("blocId = "+blocId+", bloc.getXRatio() = "+bloc.getXRatio()+", bloc.getY() = "+bloc.getY() )

                    bloc.setPos(biggestShiftPos, pushDirection);

                    if(!collidableData.isAtExtremity) continue;
                    const blocWithOverflow = collidablesHandler.overflows.find(a => a[0].getId() === blocId);
                    if(!blocWithOverflow) continue;
                    const blocOverflow = blocWithOverflow[1];
                    // collidablesAtExtremity.push([bloc, blocOverflow]);
                }
                // handling overflow:
                // const collidablesAtExtremityWithTheirOverflowSortedDescByOverflow = collidablesAtExtremity.sort((a, b) => b[1] - a[1]);
                
                const collidablesWithTheirOverflowSortedDescByOverflow = collidablesHandler.overflows.sort((a, b) => b[1] - a[1]);

                let firstBiggestOverflow = 0;

                if(collidablesWithTheirOverflowSortedDescByOverflow.length){

                    firstBiggestOverflow = collidablesWithTheirOverflowSortedDescByOverflow[0][1]; //blocWithBiggestOverflow[1];    

                    const pushingBackBloc:MaterialData = collidablesWithTheirOverflowSortedDescByOverflow[0][0];
                    const overflow: number = firstBiggestOverflow;
                    const pushBackDirection: Direction = oppositeDirection(pushDirection);
                    const pushBackBlocNextEnd: number = calculateValueMinusOverflowWithDirection(pushingBackBloc.getEnd(pushBackDirection), overflow, pushBackDirection) ; //pushingBackBloc.calculateEndWithSizeAndDirection(pushingBackBloc.getSize(pushBackDirection), pushBackDirection);
                    const sortedTowardsPushBack: MaterialData[] = sortTowardsDirection(pushBackDirection);  
                    const pushBackCollidablesHandler: CollidablesHandler = new CollidablesHandler({}, []);

                    pushNextBlocs(pushingBackBloc, pushBackBlocNextEnd, sortedTowardsPushBack, resizingBloc.getId(), pushBackDirection, pushBackCollidablesHandler);
                    
                    const pushedBackBlocks: MaterialData[] = [];

                    for(const blocId in pushBackCollidablesHandler.collidables){
                        const collidableData = pushBackCollidablesHandler.collidables[blocId];
                        const biggestShiftPosPos =  collidableData.shiftsAndPos.sort((a, b) => b[0] - a[0])[0][1];
                        const bloc = materialDataDict[blocId];
                        pushedBackBlocks.push(bloc);
                        bloc.setPos(biggestShiftPosPos, pushDirection);

                        // alert("blocId = "+blocId+", bloc.getXRatio() = "+bloc.getXRatio()+", bloc.getY() = "+bloc.getY() )
                    }

                    const pushingBackBlocIndex = pushedBlocks.findIndex(bloc => bloc.getId() === pushingBackBloc.getId());
                    // alert("pushingBackBlocIndex= "+pushingBackBlocIndex)

                    pushedBlocks.splice(pushingBackBlocIndex, 1);
                    // alert("pushingBackBlocIndex = "+pushingBackBlocIndex)
                    // alert("pushedBlocks.length = "+pushedBlocks.length)

                    // alert("before pushedBlocks.length = "+pushedBlocks.length)

                    const collidablesNotPushedBack = pushedBlocks.filter(pushedBlock => 
                        !pushedBackBlocks.find(pushedBackBlock => pushedBackBlock.getId() === pushedBlock.getId())
                    )

                    // alert("pushedBlocks.length = "+pushedBlocks.length+", pushedBackBlocks.length = "+pushedBackBlocks.length+ ", collidablesNotPushedBack.length = "+ collidablesNotPushedBack.length)

                    for(const bloc of collidablesNotPushedBack){
                        const collidableData = collidablesHandler.collidables[bloc.getId()];
                        const biggestShift =  Math.abs(collidableData.shiftsAndPos.sort((a, b) => b[0] - a[0])[0][0]);
                        const shift = overflow < biggestShift ? overflow : biggestShift;
                        // alert("bloc id = "+bloc.getId()+", biggestShift = "+biggestShift+", overflow = "+overflow+" shift = "+shift)
                        const nextPos = calculateValueMinusOverflowWithDirection(bloc.getPos(pushBackDirection), shift, pushBackDirection);
                        bloc.setPos(nextPos, pushBackDirection);
                    }

                    pushingBackBloc.setPos(calculateValueMinusOverflowWithDirection(pushingBackBloc.getPos(pushBackDirection), overflow, pushBackDirection), pushBackDirection);
                    dispatch(updateMaterialData(pushingBackBloc));
                }

                const size = inputValue - firstBiggestOverflow;
                resizingBloc.setSizeWithDirection(size, pushDirection);

                const sizeOverflow = KonvaPlanHandler.blocOverflow(resizingBloc, pushDirection);
                if(sizeOverflow){
                    resizingBloc.setSizeWithDirection(size-sizeOverflow, pushDirection);
                }

                dispatch(updateMaterialData(resizingBloc));
            }


            const setSelectedMaterialsSize = (value: number, direction:Direction) => {
                const selectedMaterialDataList = getSelectedMaterialDataArray(materialDataDict);

                for(let i=0; i<selectedMaterialDataList.length; i++){
                    pushWhenResizing(selectedMaterialDataList[i], value, direction);
                }
            }



            if(direction === Direction.ToLeft || direction === Direction.ToRight){

                let inputValueFloat: number = parseFloat(e.currentTarget.value);
                if(!inputValueFloat) {
                    setMaterialWidthInputVal("");
                    setSelectedMaterialsSize(parseFloat(minWidth), direction);
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
                setSelectedMaterialsSize(parseFloat(nextValue), direction);
            } else{
                let inputValueFloat: number = parseFloat(e.currentTarget.value);
                if(!inputValueFloat) {
                    setMaterialHeightInputVal("");
                    setSelectedMaterialsSize(parseFloat(minHeight), direction);
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
                setSelectedMaterialsSize(parseFloat(nextValue), direction);
            }


        
    },[dispatch, materialDataDict])

    const pushUpMaterialsMemo = useMemo(function () {
        return function () {
            const sortTowardsMoveDirection = () => {
                return getMaterialDataArray(materialDataDict).sort((a, b) => b.getY() - a.getY());
            }
        
            const pushUpMaterials = (sortedOppositeMoveDirectionByTop:MaterialData[], index:number) => {               
                //pseudo code
                //check for upper material
                //if exists set y to bottom of upper material else to 0 (floor)
                //run same function with shifted remainSortedMaterialDataArrayByY
                const currentMaterial = sortedOppositeMoveDirectionByTop[index] as MaterialData;
                // alert("currentMaterial id= "+currentMaterial.getId()+", sortedMaterialDataArrayByY[0].getId()= "+sortedMaterialDataArrayByY[0].getId()+", index= "+index)

                const sortedTowardsMoveDirectionByBottom = getMaterialDataArray(materialDataDict).sort((a, b) => b.getY() + b.getHeight() - (a.getY() + a.getHeight()));

                let collidableMaterialAbove = (() => {
                    for(const loopMaterial of sortedTowardsMoveDirectionByBottom){
                        if (currentMaterial.getY() >= loopMaterial.getY() + loopMaterial.getHeight() && blocIsVerticallyInPath(currentMaterial, loopMaterial)){
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
                if(index === sortedOppositeMoveDirectionByTop.length -1) return;

                pushUpMaterials(sortedOppositeMoveDirectionByTop, index + 1);
            }

            const sortedOppositeMoveDirectionByTop= getMaterialDataArray(materialDataDict).sort((a, b) => a.getY() - b.getY());
            pushUpMaterials(sortedOppositeMoveDirectionByTop, 0)

        }
    }, [materialDataDict, dispatch]);

    const pushDownMaterialsMemo = useMemo(function () {
        return function () {
            const sortTowardsMoveDirection = () => {
                return getMaterialDataArray(materialDataDict).sort((a, b) => a.getY() - b.getY());
            }
        
            const pushDownMaterials = (sortedOppositeMoveDirectionByBottom:MaterialData[], index:number) => {               
                //pseudo code
                //check for upper material
                //if exists set y to bottom of upper material else to 0 (floor)
                //run same function with shifted remainSortedMaterialDataArrayByY
                const currentMaterial = sortedOppositeMoveDirectionByBottom[index] as MaterialData;
                // alert("currentMaterial id= "+currentMaterial.getId()+", sortedMaterialDataArrayByY[0].getId()= "+sortedMaterialDataArrayByY[0].getId()+", index= "+index)

                const sortedTowardsMoveDirectionByTop = getMaterialDataArray(materialDataDict).sort((a, b) => a.getY() - b.getY());

                let collidableMaterialBelow = (() => {
                    for(const loopMaterial of sortedTowardsMoveDirectionByTop){
                        if (currentMaterial.getY() + currentMaterial.getHeight() <= loopMaterial.getY() && blocIsVerticallyInPath(currentMaterial, loopMaterial)){
                            return loopMaterial;
                        }
                    }
                    return null;
                })();

                if(collidableMaterialBelow){
                    currentMaterial.setY(collidableMaterialBelow.getY() - currentMaterial.getHeight());
                }else{
                    currentMaterial.setY(screenSize[1] * KONVA_HEIGHT_SCALE - currentMaterial.getHeight());
                }
                dispatch(updateMaterialData(currentMaterial));
                if(index === sortedOppositeMoveDirectionByBottom.length -1) return;

                pushDownMaterials(sortedOppositeMoveDirectionByBottom, index + 1);
            }

            const sortedOppositeMoveDirectionByBottom = getMaterialDataArray(materialDataDict).sort((a, b) => (b.getY() + b.getHeight()) - (a.getY() + a.getHeight()));
            pushDownMaterials(sortedOppositeMoveDirectionByBottom, 0)

        }
    }, [materialDataDict, dispatch, screenSize]);

    const pushRightMaterialsMemo = useMemo(function () {
        return function () {
            const sortTowardsMoveDirection = () => {
                return getMaterialDataArray(materialDataDict).sort((a, b) => a.getXRatio() + a.getWidthRatio() - (b.getXRatio() + b.getWidthRatio()));
            }
        
            const pushRightMaterials = (sortedOppositeMoveDirectionByRight:MaterialData[], index:number) => {               
                //pseudo code
                //check for upper material
                //if exists set y to bottom of upper material else to 0 (floor)
                //run same function with shifted remainSortedMaterialDataArrayByY
                const currentMaterial = sortedOppositeMoveDirectionByRight[index] as MaterialData;
                // alert("currentMaterial id= "+currentMaterial.getId()+", sortedMaterialDataArrayByY[0].getId()= "+sortedMaterialDataArrayByY[0].getId()+", index= "+index)

                const sortedTowardsMoveDirectionByLeft = getMaterialDataArray(materialDataDict).sort((a, b) => a.getXRatio() - b.getXRatio());
                let collidableMaterialAtRight = (() => {
                    for(const loopMaterial of sortedTowardsMoveDirectionByLeft){
                        if (currentMaterial.getXRatio() + currentMaterial.getWidthRatio() <= loopMaterial.getXRatio() && blocIsHorizontallyInPath(currentMaterial, loopMaterial)){
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
                if(index === sortedOppositeMoveDirectionByRight.length -1) return;

                pushRightMaterials(sortedOppositeMoveDirectionByRight, index + 1);
            }


            const sortedOppositeMoveDirectionByRight = getMaterialDataArray(materialDataDict).sort((a, b) => (b.getXRatio() + b.getWidthRatio()) - (a.getXRatio() + a.getWidthRatio()));

            pushRightMaterials(sortedOppositeMoveDirectionByRight, 0);
        }
    }, [materialDataDict, dispatch]);

    const pushLeftMaterialsMemo = useMemo(function () {
        return function () {
            const sortTowardsMoveDirection = () => {
                return getMaterialDataArray(materialDataDict).sort((a, b) => a.getXRatio() - b.getXRatio());
            }
        
            const pushLeftMaterials = (sortedOppositeMoveDirectionByLeft:MaterialData[], index:number) => {               
                //pseudo code
                //check for upper material
                //if exists set y to bottom of upper material else to 0 (floor)
                //run same function with shifted remainSortedMaterialDataArrayByY
                const currentMaterial = sortedOppositeMoveDirectionByLeft[index] as MaterialData;
                // alert("currentMaterial id= "+currentMaterial.getId()+", sortedMaterialDataArrayByY[0].getId()= "+sortedMaterialDataArrayByY[0].getId()+", index= "+index)

                const sortedTowardsMoveDirectionByRight = getMaterialDataArray(materialDataDict).sort((a, b) => b.getXRatio() + b.getWidthRatio() - (a.getXRatio() + a.getWidthRatio()));
                let collidableMaterialAtLeft = (() => {
                    for(const loopMaterial of sortedTowardsMoveDirectionByRight){
                        if (currentMaterial.getXRatio() >= loopMaterial.getXRatio() + loopMaterial.getWidthRatio() && blocIsHorizontallyInPath(currentMaterial, loopMaterial)){
                            return loopMaterial;
                        }
                    }
                    return null;
                })();

                if(collidableMaterialAtLeft){
                    currentMaterial.setXRatio(collidableMaterialAtLeft.getXRatio() + collidableMaterialAtLeft.getWidthRatio());
                }else{
                    currentMaterial.setXRatio(0);
                }

                dispatch(updateMaterialData(currentMaterial));
                if(index === sortedOppositeMoveDirectionByLeft.length -1) return;

                pushLeftMaterials(sortedOppositeMoveDirectionByLeft, index + 1);
            }

            const sortedOppositeMoveDirectionByLeft = getMaterialDataArray(materialDataDict).sort((a, b) => a.getXRatio() - b.getXRatio());

            pushLeftMaterials(sortedOppositeMoveDirectionByLeft, 0);
        }
    }, [materialDataDict, dispatch]);

    


    const handleMaterialHeightInputOnChange = useCallback((e:React.FormEvent<HTMLInputElement>, bottomToTop:boolean) => {
    
                const sortTowardsMoveDirection = () => {
                    return getMaterialDataArray(materialDataDict).sort((a, b) => a.getY() - b.getY());
                }
                const sortOppositeMoveDirection = () => {
                    return getMaterialDataArray(materialDataDict).sort((a, b) => a.getY() - b.getY());
                }
                const pushDownMaterialsAfterUpperMaterialBottomChange = (pushingMaterial:MaterialData, pushingMaterialNextBottom:number, sortedTowardsMoveDirection:MaterialData[], newMaterialTops:[MaterialData, number][]): [MaterialData, number][] => {

                    //step 1: Find directly (not passing through) collidables

                    const pushingMaterialIndex = sortedTowardsMoveDirection.findIndex(materialData => materialData.getId() === pushingMaterial.getId());
                    const lowerMaterialArr = sortedTowardsMoveDirection.slice(pushingMaterialIndex+1); 


                    const lowerPassingThroughCollidables = lowerMaterialArr.filter(loopMaterialData => 
                        blocIsVerticallyInPath(pushingMaterial, loopMaterialData)              
                    );

                    const lowerCollidables:MaterialData[] = [];


                    const lowerPassingThroughCollidablesOppositeMove = lowerPassingThroughCollidables.slice().reverse();

                    while(lowerPassingThroughCollidablesOppositeMove.length){
                        const lowestMaterial = lowerPassingThroughCollidablesOppositeMove.shift() as MaterialData;
                        let isCollidableWithPushingMaterial = true;
                        for(let i=0; i<lowerPassingThroughCollidablesOppositeMove.length; i++){
                            if(blocIsVerticallyInPath(lowestMaterial, lowerPassingThroughCollidablesOppositeMove[i])){
                                isCollidableWithPushingMaterial = false;
                                break;
                            }
                        }
                        if(isCollidableWithPushingMaterial){
                            lowerCollidables.push(lowestMaterial);
                        }
                    }

                    //step 2: For each of them, do the next pushing material bottom reach them ? if yes their top will change with shift = (pushingMaterialNextBottom - material top)

                    for(const lowerCollidable of lowerCollidables){
                        // alert(lowerCollidable.getId())
                        if(pushingMaterialNextBottom > lowerCollidable.getY()){
                            const lowerCollidableNextTop = lowerCollidable.getY() + (pushingMaterialNextBottom - lowerCollidable.getY());
                            const lowerCollidableNextBottom = lowerCollidableNextTop + lowerCollidable.getHeight();

                            newMaterialTops.push([lowerCollidable, lowerCollidableNextTop]);
                            pushDownMaterialsAfterUpperMaterialBottomChange(lowerCollidable, lowerCollidableNextBottom, sortedTowardsMoveDirection, newMaterialTops);
                        }
   
                    }
                    
                    return newMaterialTops;
                }
                const pushUpMaterialsAfterLowerMaterialTopChange = (pushingMaterial:MaterialData, pushingMaterialNextTop:number, sortedTowardsMoveDirection:MaterialData[], newMaterialTops:[MaterialData, number][]): [MaterialData, number][] => {

                    //step 1: Find directly (not passing through) collidables

                    const pushingMaterialIndex = sortedTowardsMoveDirection.findIndex(materialData => materialData.getId() === pushingMaterial.getId());
                    const upperMaterialArr = sortedTowardsMoveDirection.slice(pushingMaterialIndex+1); 


                    const upperPassingThroughCollidables = upperMaterialArr.filter(loopMaterialData => 
                        blocIsVerticallyInPath(pushingMaterial, loopMaterialData)              
                    );

                    const upperCollidables:MaterialData[] = [];


                    const upperPassingThroughCollidablesOppositeMove = upperPassingThroughCollidables.slice().reverse();

                    while(upperPassingThroughCollidablesOppositeMove.length){
                        const upmostMaterial = upperPassingThroughCollidablesOppositeMove.shift() as MaterialData;
                        let isCollidableWithPushingMaterial = true;
                        for(let i=0; i<upperPassingThroughCollidablesOppositeMove.length; i++){
                            if(blocIsVerticallyInPath(upmostMaterial, upperPassingThroughCollidablesOppositeMove[i])){
                                isCollidableWithPushingMaterial = false;
                                break;
                            }
                        }
                        if(isCollidableWithPushingMaterial){
                            upperCollidables.push(upmostMaterial);
                        }
                    }

                    //step 2: For each of them, do the next pushing material bottom reach them ? if yes their top will change with shift = (pushingMaterialNextBottom - material top)
                    // alert("upperCollidables length "+upperCollidables.length)

                    for(const upperCollidable of upperCollidables){
                        // alert("upperCollidable id = "+upperCollidable.getId())
                        // alert("pushingMaterialNextTop = "+pushingMaterialNextTop+",  upperCollidableBottom = " + (upperCollidable.getY() + upperCollidable.getHeight()))
                        if(pushingMaterialNextTop < upperCollidable.getY() + upperCollidable.getHeight()){
                            // alert("ok2 "+upperCollidable.getId())

                            const upperCollidableNextTop = upperCollidable.getY() - (upperCollidable.getY() + upperCollidable.getHeight() - pushingMaterialNextTop);
                            // alert("ok0 "+newMaterialTops.length)

                            newMaterialTops.push([upperCollidable, upperCollidableNextTop]);

                            pushUpMaterialsAfterLowerMaterialTopChange(upperCollidable, upperCollidableNextTop, sortedTowardsMoveDirection, newMaterialTops);
                        }
                    }
                    
                    return newMaterialTops;
                }
                // const pushUpMaterialsAfterLowerMaterialTopChange = (changedMaterial:MaterialData, sortedOppositeMoveDirection:MaterialData[]) => {
                //     const changedMaterialIndex = sortedOppositeMoveDirection.findIndex(materialData => materialData.getId() === changedMaterial.getId());
                //     const lowerMaterialArr = sortedOppositeMoveDirection.slice(changedMaterialIndex+1);
                //     const nextCollidedLowerMaterials = lowerMaterialArr.filter(lowerMaterial => 
                //         changedMaterial.getY() > lowerMaterial.getY() + lowerMaterial.getHeight() && !(changedMaterial.getXRatio() + changedMaterial.getWidthRatio()  < lowerMaterial.getXRatio() ||
                //         changedMaterial.getXRatio() > lowerMaterial.getXRatio() + lowerMaterial.getWidthRatio())                    
                //     )
                //     if(!nextCollidedLowerMaterials) return;

                //     for(const nextCollidedMaterial of nextCollidedLowerMaterials){
                //         nextCollidedMaterial.setY(changedMaterial.getY() - nextCollidedMaterial.getHeight());
                //         dispatch(updateMaterialData(nextCollidedMaterial));
                //         pushUpMaterialsAfterLowerMaterialTopChange(nextCollidedMaterial, sortedOppositeMoveDirection);
                //     }
                // }
                                
            const setSelectedMaterialsHeight = (height: number, bottomToTop:boolean) => {
                const selectedMaterialDataList = getSelectedMaterialDataArray(materialDataDict);
                for(let i=0; i<selectedMaterialDataList.length; i++){
                    let materialTopsToUpdate:[MaterialData, number][] = [];
                    if(bottomToTop){
                        const nextTop = selectedMaterialDataList[i].getY() - (height - selectedMaterialDataList[i].getHeight());

                        const sortedTowardsMoveDirection = getMaterialDataArray(materialDataDict).sort((a, b) => b.getY() - a.getY()); //sorted them by top (desc)
                        // alert("0 materialTopsToUpdate.length = " + materialTopsToUpdate.length);

                        materialTopsToUpdate = pushUpMaterialsAfterLowerMaterialTopChange(selectedMaterialDataList[i], nextTop, sortedTowardsMoveDirection, materialTopsToUpdate);
                        // alert("1 materialTopsToUpdate.length = " + materialTopsToUpdate.length);

                        selectedMaterialDataList[i].setY(nextTop);

                    }
                    else{
                        const nextBottom = selectedMaterialDataList[i].getY() + height;
                        const sortedTowardsMoveDirection = getMaterialDataArray(materialDataDict).sort((a, b) => a.getY()+ a.getHeight() - (b.getY() + b.getHeight())); //sorted them by bottom (asc)
                        materialTopsToUpdate = pushDownMaterialsAfterUpperMaterialBottomChange(selectedMaterialDataList[i], nextBottom, sortedTowardsMoveDirection, materialTopsToUpdate);
                    }

                    selectedMaterialDataList[i].setHeight(height);
                    dispatch(updateMaterialData(selectedMaterialDataList[i]));
                    for(const materialTopToUpdate of materialTopsToUpdate){
                        // alert("materialTopToUpdate[0] id = " + materialTopToUpdate[0].getId())

                        materialTopToUpdate[0].setY(materialTopToUpdate[1]);
                        dispatch(updateMaterialData(materialTopToUpdate[0]));
                    }

                }
                return;
            }

            let inputValueFloat: number = parseFloat(e.currentTarget.value);
            if(!inputValueFloat) {
                setMaterialHeightInputVal("");
                setSelectedMaterialsHeight(parseFloat(minHeight), bottomToTop);
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
            setSelectedMaterialsHeight(parseFloat(nextValue), bottomToTop);
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
            {/* <DirectionalButton/> */}
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
                            onChange={(e) => {handleMaterialSizeInputOnChange(e, Direction.ToLeft)}} />
                        <input className={`${styles['material-size-range-input']} ${styles['material-size-range-input-ltr']} ${styles['material-width-range-input']}`} 
                            name="material-width-range-input-ltr" 
                            type="range" 
                            min={minWidth} 
                            max={maxWidth} 
                            value={materialWidthInputVal ? materialWidthInputVal : 0} 
                            onChange={(e) => {handleMaterialSizeInputOnChange(e, Direction.ToRight)}} />
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
                        onChange={(e) => {handleMaterialSizeInputOnChange(e, Direction.ToRight)}}
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
                            onChange={(e) => {handleMaterialSizeInputOnChange(e, Direction.ToTop)}}/>
                        <input className={`${styles['material-size-range-input']} ${styles['material-size-range-input-ltr']} ${styles['material-height-range-input']}`} 
                            name="material-height-range-input-ltr" 
                            type="range" 
                            min={minHeight} 
                            max={maxHeight} 
                            value={materialHeightInputVal? materialHeightInputVal : 0} 
                            onChange={(e) => {handleMaterialSizeInputOnChange(e, Direction.ToBottom)}}/>
                    </div>
                    <span>h</span>
                    <input className={`${styles['material-size-number-input']} ${styles['material-height-number-input']}`}
                        name="material-height-number-input" 
                        type="number" 
                        value={materialHeightInputVal} 
                        onChange={(e) => {handleMaterialSizeInputOnChange(e, Direction.ToTop)}}
                        onBlur={handleOnBlur}/>
                    <span className={`${styles['size-unit']}`}>px</span>
                </div>
                {/* <div className={`${styles['push-buttons-wrapper']}`} >
                    <button className={`${styles['push-button']} ${styles['push-up-button']}`} onTouchEnd={pushUpMaterialsMemo}>&#8593;</button>
                    <div className={`${styles['push-left-right-buttons-wrapper']}`}>
                        <button className={`${styles['push-button']} ${styles['push-left-button']}`} onTouchEnd={pushLeftMaterialsMemo}>&#8592;</button>
                        <button className={`${styles['push-button']} ${styles['push-right-button']}`} onTouchEnd={pushRightMaterialsMemo}>&#8594;</button>
                    </div>
                    <button className={`${styles['push-button']} ${styles['push-down-button']}`} onTouchEnd={pushDownMaterialsMemo}>&#8595;</button>
                </div> */}
            </div>
        </div>
        );
  };
  
  export default MaterialSizePosMenu;