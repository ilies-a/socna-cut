import { KONVA_WIDTH_SCALE, MATERIAL_STROKE, MaterialData } from "@/global";
import { useEffect, useMemo, useState } from "react";
import { Rect, Shape } from "react-konva";
import useImage from 'use-image';
import { useSelector, useDispatch } from 'react-redux';
import { selectMaterialDataDict } from '../../redux/konva/konva.selectors';
import { updateMaterialData } from '@/redux/konva/konva.actions';

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

    const materialWidthFromRatio = (widthRatio:number):number => {
        return widthRatio * window.innerWidth * KONVA_WIDTH_SCALE;
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

    const handleTouchEnd = useMemo(function () {
      return function () {
        if(!unwantedTouchEnd){
          setUnwantedTouchEnd(true);
          return;
        }
        const updatedMaterialData:MaterialData | undefined = materialDataDict[id];
        if (!updatedMaterialData) return;
        updatedMaterialData.setIsSelected(!updatedMaterialData.getIsSelected());
        dispatch(updateMaterialData(updatedMaterialData));
        setUnwantedTouchEnd(false);
      }
    }, [materialDataDict, id, dispatch, unwantedTouchEnd]);

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

  return (
    <>
      <Rect
        x = {materialDataDict[id].getX()}
        y = {materialDataDict[id].getY()}
        width = {widthMemo}
        height = {materialDataDict[id].getHeight() - MATERIAL_STROKE}
        fillPatternImage = {image}
        stroke = {'black'}
        strokeWidth = {MATERIAL_STROKE}
        onTouchStart={() => {setIsSelected(true)}}
        onMouseDown={() => {setIsSelected(true)}}
      />
      {materialDataDict[id].getIsSelected() ? 
      <Rect
        x = {materialDataDict[id].getX()}
        y = {materialDataDict[id].getY()}
        width = {widthMemo}
        height = {materialDataDict[id].getHeight() - MATERIAL_STROKE}
        fill="red"
        opacity={0.5}
        stroke = {'red'}
        strokeWidth = {MATERIAL_STROKE}
        onTouchEnd={handleTouchEnd}
        onMouseUp={handleTouchEnd}
      />:null}
    </>
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