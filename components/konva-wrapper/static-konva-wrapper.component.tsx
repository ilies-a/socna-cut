import { useEffect, useRef, useState } from 'react';
import { Stage, Layer, Rect, Text, Circle, Line, Shape } from 'react-konva';
import React from 'react';
import { v4 } from 'uuid';
import Material from '../material/material.component';
import { KONVA_WIDTH_SCALE, KONVA_HEIGHT_SCALE, MaterialData, KonvaPlanHandler, StateSpace } from '@/global';
import { useDispatch, useSelector } from 'react-redux';
import { selectDraggableIcon, selectMaterialDataDict, selectPlanStateSpace } from '../../redux/konva/konva.selectors';
import KonvaMenu from '../konva-menu/konva-menu.component';
import PreloadWrapper from '../preload-wrapper/preload-wrapper.component';
import { selectScreenSize } from '@/redux/screen-event/screen-event.selectors';
import { setPlanStateSpace } from '@/redux/konva/konva.actions';

// type KonvasElementOptionsProps = {
//     element: JSX.Element | undefined,
//     canvasRef: React.MutableRefObject<HTMLCanvasElement | null>,
//     touches: React.TouchList | undefined
//   };


// const Shape = () => {
//     const [color, setColor] = useState<string>("black");
  
//     return (
//       <Circle
//         x={0}
//         y={0}
//         draggable
//         radius={50}
//         fill={color}
//         onTouchStart={() => {
//           setColor(Konva.Util.getRandomColor());
//         }}
//         onDragEnd={() => {
//           setColor(Konva.Util.getRandomColor());
//         }}
//       />
//     );
//   };

const StaticKonvaWrapper: React.FC = () => {
  const materialDataDict:{ [key: string]: MaterialData } = useSelector(selectMaterialDataDict);
  const screenSize: [number, number] = useSelector(selectScreenSize);
  const [planWrapperRef, setPlanWrapperRef] = useState<HTMLDivElement | null>(null);
  const [element, setElement] = useState<Element | null>(null)
  const dispatch = useDispatch();
  const planStateSpace:StateSpace = useSelector(selectPlanStateSpace) 

  useEffect(()=>{
    KonvaPlanHandler.setLimitBottom(screenSize[1] * KONVA_HEIGHT_SCALE);

    if(!planWrapperRef) return;

    dispatch(setPlanStateSpace( 
      new StateSpace(
        screenSize[0] * KONVA_WIDTH_SCALE, 
        screenSize[1] * KONVA_HEIGHT_SCALE, 
        planWrapperRef.getBoundingClientRect().left, 
        planWrapperRef.getBoundingClientRect().top,
      )
    ));
  },[dispatch, screenSize, planWrapperRef])


  // useEffect(()=>{
  //   KonvaPlanHandler.setLimitBottom(screenSize[1] * KONVA_HEIGHT_SCALE);
  //   alert("planWrapperRef.current "+planWrapperRef.current)

  //   if(!planWrapperRef.current) return;

  //   dispatch(setPlanStateSpace( 
  //     new StateSpace(
  //       screenSize[0] * KONVA_WIDTH_SCALE, 
  //       screenSize[1] * KONVA_HEIGHT_SCALE, 
  //       planWrapperRef.current.getBoundingClientRect().left, 
  //       planWrapperRef.current.getBoundingClientRect().top,
  //     )
  //   ));
  // },[dispatch, screenSize, planWrapperRef])


  return (
      <PreloadWrapper>
        <div ref={setPlanWrapperRef} >
          <Stage width={screenSize[0] * KONVA_WIDTH_SCALE} height={screenSize[1] * KONVA_HEIGHT_SCALE} style={{"backgroundColor": "grey"}}>
          <Layer>
            {
              Object.entries(materialDataDict).map(([_, value]) =>{
                return <Material key={value.getId()} blockId={value.getId()}/>
              })
            }
            {/* <Rect
              x={20}
              y={50}
              width={100}
              height={100}
              fillPatternImage= { image }
              shadowBlur={10}
            />
            <Circle x={200} y={100} radius={50} fill="green" />
            <Line
              x={20}
              y={200}
              points={[0, 0, 100, 0, 100, 100]}
              tension={0.5}
              closed
              stroke="black"
              fillLinearGradientStartPoint={{ x: -50, y: -50 }}
              fillLinearGradientEndPoint={{ x: 50, y: 50 }}
              fillLinearGradientColorStops={[0, 'red', 1, 'yellow']}
            /> */}
          </Layer>
        </Stage>
      </div>
      <KonvaMenu/>
    </PreloadWrapper>
    );
  };

export default StaticKonvaWrapper;

