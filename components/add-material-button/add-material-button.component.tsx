import { useEffect, useMemo, useState } from 'react';
import styles from './add-material-button.module.scss';
import { MaterialData } from '@/global';
import { useDispatch, useSelector } from 'react-redux';
import { selectMaterialDataDict } from '@/redux/konva/konva.selectors';
import { addMaterialData } from '@/redux/konva/konva.actions';
import { v4 } from 'uuid';

const AddMaterialButton: React.FC = () => {
    const materialDataDict:{ [key: string]: MaterialData } = useSelector(selectMaterialDataDict);
    const dispatch = useDispatch();

    const addMaterialDataMemo= useMemo(function () {

      // The next material appears below the lowest material
      // const lowestMaterialBottom = () => {
      //   let lowestMaterial: MaterialData | undefined;
      //   Object.entries(materialDataDict).map(([_, value]) =>{
      //       if(!lowestMaterial){ //first iteration
      //         lowestMaterial = value;
      //       }
      //       else if (lowestMaterial.getY() + lowestMaterial.getHeight() < value.getY() + value.getHeight() ) {
      //         lowestMaterial = value;
      //       }
      //     });
      //   if(lowestMaterial){
      //     return lowestMaterial.getY() + lowestMaterial.getHeight();
      //   }
      //   return 0;
      // }




  

      return function () {
                    // context.moveTo(x, y);
            // context.lineTo(widthRatioMemo, 0);
            // context.lineTo(widthRatioMemo, height);
            // context.lineTo(x, height);
            // context.lineTo(x, y);

        const materialDataArray = Object.keys(materialDataDict).map(key => materialDataDict[key]);
        const lowestMaterial = materialDataArray.find((materialData) => materialData.getY() + materialData.getHeight() === Math.max(...materialDataArray.map((materialData)=> materialData.getY() + materialData.getHeight())));
        const lowestMaterialBottom = lowestMaterial? lowestMaterial.getY() + lowestMaterial.getHeight() : 0;

        const newMaterialData = new MaterialData(v4(), "normal", 0, lowestMaterialBottom, 1);

        // const newMaterialData = new MaterialData(v4(), "normal", [
        //         [0, 0],
        //         [0.8, -1],
        //         [0.8, -1],
        //         [0, -1],
        //         [0, 0]
        //     ]);
        dispatch(addMaterialData(newMaterialData));

        //(test) add one material at right
        // if(materialDataArray.length === 1){
        //   const newMaterialData = new MaterialData(v4(), "normal", 0.5, 50, 0.2);
        //   dispatch(addMaterialData(newMaterialData));
        // }
      }
    }, [materialDataDict, dispatch]);

    const addMaterialDataMemoForTests= useMemo(function () {
      return function () {
        for(let i= 1; i<5; i++){
          const newMaterialData = new MaterialData(v4(), "normal", i * 0.1, i*20, 0.3);
          dispatch(addMaterialData(newMaterialData));
        }
        const newMaterialData = new MaterialData(v4(), "normal", 0.1, 4*20, 0.2);
        dispatch(addMaterialData(newMaterialData));
      }
    }, [dispatch]);

    return (
      <div className={styles.menu}>
        <button onClick={addMaterialDataMemoForTests}>Add material</button>
      </div>
      );
  };
  
  export default AddMaterialButton;