import { useCallback, useEffect, useMemo, useState } from 'react';
import { Stage, Layer, Rect, Text, Circle, Line, Shape } from 'react-konva';
import React from 'react';
import Material from '../material/material.component';
import { KONVA_WIDTH_SCALE, KONVA_HEIGHT_SCALE, MaterialData, getSelectedMaterialDataArray } from '@/global';
import { useDispatch, useSelector } from 'react-redux';
import { selectMaterialDataDict } from '../../redux/konva/konva.selectors';
import styles from './konva-menu.module.scss';
import { addMaterialData, updateMaterialData } from '@/redux/konva/konva.actions';
import AddMaterialButton from '../add-material-button/add-material-button.component';
import DirectionalButton from '../directional-button/directional-button.component';
import MaterialSizePosMenu from '../material-size-pos-menu/material-size-pos-menu.component';
import AddMaterialMenu from '../add-material-menu/add-material-menu.component';
import AddMaterialDraggableIconSupport from '../add-material-draggable-icon-support/add-material-draggable-icon-support.component';

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
  const [addMaterialMenuOpen, setAddMaterialMenuOpen] = useState<boolean>(false);
  // const blockDimOpen: boolean = useSelector(selectBlockDimOpen);
  const materialDataDict:{ [key: string]: MaterialData } = useSelector(selectMaterialDataDict);

  const handleClick = useCallback(() => {
    setAddMaterialMenuOpen(addMaterialMenuOpen => !addMaterialMenuOpen)
  }, []);

  return (

// <div className={styles['main']}>

    <div className={styles.menu}>
        <AddMaterialButton handleClick = {handleClick} />
        {addMaterialMenuOpen ? <AddMaterialMenu /> : null}
    </div>
// </div> 

    );
};

export default KonvaMenu;

