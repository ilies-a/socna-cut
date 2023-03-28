import { useEffect, useMemo, useState } from 'react';
import styles from './add-material-button.module.scss';
import { BlockType1Data, MaterialData } from '@/global';
import { useDispatch, useSelector } from 'react-redux';
import { selectMaterialDataDict } from '@/redux/konva/konva.selectors';
import { addMaterialData } from '@/redux/konva/konva.actions';
import { v4 } from 'uuid';

type Props = {
  handleClick: () => void,
};

const AddMaterialButton: React.FC<Props> = ({handleClick}) => {
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

        const newMaterialData = new BlockType1Data(v4(), 0, lowestMaterialBottom, 1);

        // const newMaterialData = new MaterialData(v4(), [
        //         [0, 0],
        //         [0.8, -1],
        //         [0.8, -1],
        //         [0, -1],
        //         [0, 0]parseInt
        //     ]);
        dispatch(addMaterialData(newMaterialData));

        //(test) add one material at right
        // if(materialDataArray.length === 1){
        //   const newMaterialData = new MaterialData(v4(), 0.5, 50, 0.2);
        //   dispatch(addMaterialData(newMaterialData));
        // }
      }
    }, [materialDataDict, dispatch]);

    const addMaterialDataMemoForTests= useMemo(function () {
      return function () {
        for(let i= 2; i<5; i++){
          const newMaterialData = new BlockType1Data(v4(), i*20, 20, 15);
          dispatch(addMaterialData(newMaterialData));
        }
        dispatch(addMaterialData(  new BlockType1Data(v4(), 10, 20, 15) ));
        dispatch(addMaterialData(  new BlockType1Data(v4(), 50, 80, 20) ));
        dispatch(addMaterialData(  new BlockType1Data(v4(), 40, 110, 15) ));

        // dispatch(addMaterialData( new MaterialData(v4(), 0.1, 20, 0.15) )); //id, type, xRatio, y, widthRatio
        // dispatch(addMaterialData( new MaterialData(v4(), 0.1, 50, 0.3) )); //id, type, xRatio, y, widthRatio

        // const newMaterialData3 = new MaterialData(v4(), 0.5, 20, 0.3);


        // dispatch(addMaterialData(newMaterialData3));

      }
    }, [dispatch]);

    return (
      <div>
        <button 
        onClick={handleClick} 
        onTouchStart={(e) => { e.stopPropagation();}} 
        onTouchEnd={(e) => { e.stopPropagation();}}>
          Add material
        </button>
        <button 
        onClick={addMaterialDataMemoForTests}
        onTouchStart={(e) => { e.stopPropagation();}} 
        onTouchEnd={(e) => { e.stopPropagation();}}>
          add materials (Test)
        </button>
      </div>
      );
  };
  
  export default AddMaterialButton;