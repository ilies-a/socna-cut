import { KONVA_WIDTH_SCALE, MATERIAL_STROKE, MaterialData } from "@/global";
import { useEffect, useMemo, useState } from "react";
import { Group, Rect, Text } from "react-konva";
import useImage from 'use-image';
import { useSelector, useDispatch } from 'react-redux';
import { selectMaterialDataDict } from '../../redux/konva/konva.selectors';
import { updateMaterialData } from '@/redux/konva/konva.actions';
import { KonvaEventObject } from "konva/lib/Node";


const colorsForTests = [
  "orange",
  "green",
  "blue",
  "yellow",
  "purple",
  "pink",
  "brown"
]
const colorsForTestsDict:{ [key: string]: string } = {};

type MaterialProps = {
    id: string,
  };

const Material: React.FC<MaterialProps> = ({id}) => {
    const dispatch = useDispatch();
    const materialDataDict:{ [key: string]: MaterialData } = useSelector(selectMaterialDataDict);
    const [image] = useImage('dalle.png');

    //needed to handle the first unwanted touchend event on selected Material Rect:
    const [unwantedTouchEnd, setUnwantedTouchEnd] = useState(false); 

    // const [widthRatio, setWidthRatio] = useState<number>(0);
        // ()=>{
        //     const materialDataDict2:Map<string, MaterialData> = new Map<string, MaterialData>();
        //     console.log("materialDataDict.get(id)",materialDataDict.get(id))
        //     return 0;
        // }
        // );

    // useEffect(()=>{
    //   if(loadStatus === "loaded")alert(loadStatus);
    // },[loadStatus]);

    useEffect(()=>{
      colorsForTestsDict[id] = colorsForTests.shift() || "grey";
    },[id]);

    const materialXFromRatio = (xRatio:number):number => {
      return xRatio * window.innerWidth * KONVA_WIDTH_SCALE / 100;
    }

    const xMemo = useMemo(
      () => {
        // console.log("widthMemo update", test)
          return materialXFromRatio(materialDataDict[id].getXRatio());
      },
      [materialDataDict, id]
    );

    const materialWidthFromRatio = (widthRatio:number):number => {
        return widthRatio * window.innerWidth * KONVA_WIDTH_SCALE / 100;
    }

    const widthMemo = useMemo(
        () => {
          // console.log("widthMemo update", test)
            return materialWidthFromRatio(materialDataDict[id].getWidthRatio());
        },
        [materialDataDict, id]
      );

    // useEffect(() => {
    //     materialWidthFromRatio
    // }, [widthRatio]);
    // const img = new Image();
    // img.src = 'dalle.png';
    // img.alt = 'alt';

    // const [image, setImage] = useState<HTMLImageElement | undefined>();
    // const [count, setCount] = useState<number>(1);


    // const visibleTodos = useMemo(
    //     () => filterTodos(todos, tab),
    //     [todos, tab]
    //   );
      
    const setIsSelected = useMemo(function () {
      return function (isSelected:boolean) {
          const updatedMaterialData:MaterialData | undefined = materialDataDict[id];
          if (!updatedMaterialData) return;
          updatedMaterialData.setIsSelected(isSelected);
          dispatch(updateMaterialData(updatedMaterialData));
      }
    }, [materialDataDict, id, dispatch]);

    // const handleTouchEnd = useMemo(function () {
    //   return function () {
    //     if(!unwantedTouchEnd){
    //       setUnwantedTouchEnd(true);
    //       return;
    //     }
    //     const updatedMaterialData:MaterialData | undefined = materialDataDict[id];
    //     if (!updatedMaterialData) return;
    //     updatedMaterialData.setIsSelected(!updatedMaterialData.getIsSelected());
    //     dispatch(updateMaterialData(updatedMaterialData));
    //     setUnwantedTouchEnd(false);
    //   }
    // }, [materialDataDict, id, dispatch, unwantedTouchEnd]);

    // const toggleSelectMaterial = useMemo(function () {
    //   return function () {
    //       const updatedMaterialData:MaterialData | undefined = materialDataDict[id];
    //       if (!updatedMaterialData) return;
    //       updatedMaterialData.setIsSelected(!updatedMaterialData.getIsSelected());
    //       dispatch(updateMaterialData(updatedMaterialData));
    //   }
    // }, [materialDataDict, id, dispatch])

    // const handleMouseMove = useMemo(function () {
    //     return function () {
    //         const updatedMaterialData:MaterialData | undefined = materialDataDict[id];
    //         if (!updatedMaterialData) return;
    //         // updatedMaterialData.path[1][0] += 0.001;
    //         // updatedMaterialData.path[2][0] += 0.001;
    //         const step = -0.001;
    //         updatedMaterialData.setWidthRatio(updatedMaterialData.getWidthRatio() + step);
    //         dispatch(updateMaterialData(updatedMaterialData));
    //     }
    // }, [materialDataDict, id, dispatch])

  const selectMaterial = useMemo(function () {
    return function (e:KonvaEventObject<TouchEvent>) {
      e.evt.stopPropagation();
      setIsSelected(true);
    }
   }, [setIsSelected]);

  const unselectMaterial = useMemo(function () {
    return function (e:KonvaEventObject<TouchEvent>) {
      e.evt.stopPropagation();
      setIsSelected(false);
    }
  }, [setIsSelected]);

  return (
    <Group         
      x = {xMemo}
      y = {materialDataDict[id].getY()}>
      <Rect
        width = {widthMemo}
        height = {materialDataDict[id].getHeight() - MATERIAL_STROKE}
        fill= {colorsForTestsDict[id]} //for tests
        // fillPatternImage = {image}
        stroke = {'black'}
        strokeWidth = {MATERIAL_STROKE}
        // onTouchStart={() => {setIsSelected(true)}}
        onTouchEnd={selectMaterial}
        onMouseDown={() => {setIsSelected(true)}}
      />
       <Text fontSize={12} text={materialDataDict[id].getId().slice(0, 3)}
        wrap="char" align="center" />

      {materialDataDict[id].getIsSelected() ? 
      <Rect
        width = {widthMemo}
        height = {materialDataDict[id].getHeight() - MATERIAL_STROKE}
        fill="red"
        opacity={0.5}
        stroke = {'red'}
        strokeWidth = {MATERIAL_STROKE}
        // onTouchEnd={handleTouchEnd}
        onTouchEnd={unselectMaterial}
        // onMouseUp={handleTouchEnd}
      />:null}
    </Group>
    // <Shape
    //   sceneFunc={(context, shape) => {
    //     context.beginPath();
    //     context.moveTo(x, y);
    //     context.lineTo(widthMemo, 0);
    //     context.lineTo(widthMemo, materialDataDict[id].getHeight());
    //     context.lineTo(x, materialDataDict[id].getHeight());
    //     context.lineTo(x, y);
    //     context.closePath();
    //     // (!) Konva specific method, it is very important
    //     context.fillStrokeShape(shape);
    //   }}
    //   onTouchStart={() => {
    //     console.log("selecting material")
    //   }}
    //   onMouseMove={handleMouseMove}
    //   onDragEnd={() => {
    //   }}
    //   stroke="black"
    //   strokeWidth={0.2}
    //   fillPatternImage= { image }
    // />
  );
}

export default Material;