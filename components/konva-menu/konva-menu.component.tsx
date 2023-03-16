import { useEffect, useMemo, useState } from 'react';
import { Stage, Layer, Rect, Text, Circle, Line, Shape } from 'react-konva';
import React from 'react';
import Material from '../material/material.component';
import { KONVA_WIDTH_SCALE, KONVA_HEIGHT_SCALE, MaterialData } from '@/global';
import { useDispatch, useSelector } from 'react-redux';
import { selectMaterialDataDict } from '../../redux/konva/konva.selectors';
import styles from './konva-menu.module.scss';
import { addMaterialData } from '@/redux/konva/konva.actions';
import AddMaterialButton from '../add-material-button/add-material-button.component';
import DirectionalButton from '../directional-button/directional-button.component';

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

const KonvaMenu: React.FC = () => {
    return (
      <div className={styles.menu}>
        <AddMaterialButton />
        <DirectionalButton />
      </div>
      );
  };

export default KonvaMenu;

