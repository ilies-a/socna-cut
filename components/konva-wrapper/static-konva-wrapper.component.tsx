import { useEffect, useState } from 'react';
import { Stage, Layer, Rect, Text, Circle, Line, Shape } from 'react-konva';
import React from 'react';
import { v4 } from 'uuid';
import Material from '../material/material.component';
import { KONVA_WIDTH_SCALE, KONVA_HEIGHT_SCALE, MaterialData } from '@/global';
import { useSelector } from 'react-redux';
import { selectMaterialDataDict } from '../../redux/konva/konva.selectors';
import KonvaMenu from '../konva-menu/konva-menu.component';

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

    return (
      <div>
        <Stage width={window.innerWidth * KONVA_WIDTH_SCALE} height={window.innerHeight * KONVA_HEIGHT_SCALE}>
        <Layer>
          {
            Object.entries(materialDataDict).map(([_, value]) =>{
              return <Material key={value.getId()} id={value.getId()}/>
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
      <KonvaMenu/>
    </div>
      );
  };

export default StaticKonvaWrapper;

