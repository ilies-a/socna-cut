import { useEffect, useMemo, useState } from 'react';
import styles from './add-material-button.module.scss';
import { MaterialData } from '@/global';
import { useDispatch, useSelector } from 'react-redux';
import { selectMaterialDataDict } from '@/redux/konva/konva.selectors';
import { addMaterialData } from '@/redux/konva/konva.actions';
import { v4 } from 'uuid';

const AddMaterialButton: React.FC = () => {
    const materialDataDict:Map<string, MaterialData> = useSelector(selectMaterialDataDict);
    const dispatch = useDispatch();

    const addMaterialDataMemo= useMemo(function () {

      // The next material appears below the lowest material
      const lowestMaterialBottom = () => {
        let lowestMaterial: MaterialData | undefined;
        Object.entries(materialDataDict).map(([_, value]) =>{
            if(!lowestMaterial){ //first iteration
              lowestMaterial = value;
            }
            else if (lowestMaterial.getY() + lowestMaterial.getHeight() < value.getY() + value.getHeight() ) {
              lowestMaterial = value;
            }
          });
        if(lowestMaterial){
          return lowestMaterial.getY() + lowestMaterial.getHeight();
        }
        return 0;
      }

      return function () {
                    // context.moveTo(x, y);
            // context.lineTo(widthRatioMemo, 0);
            // context.lineTo(widthRatioMemo, height);
            // context.lineTo(x, height);
            // context.lineTo(x, y);

        const newMaterialData = new MaterialData(v4(), "normal", 0, lowestMaterialBottom(), 1);

        // const newMaterialData = new MaterialData(v4(), "normal", [
        //         [0, 0],
        //         [0.8, -1],
        //         [0.8, -1],
        //         [0, -1],
        //         [0, 0]
        //     ]);
        dispatch(addMaterialData(newMaterialData));
      }
    }, [materialDataDict, dispatch]);


    return (
      <div className={styles.menu}>
        <button onClick={addMaterialDataMemo}>Add material</button>
      </div>
      );
  };
  
  export default AddMaterialButton;