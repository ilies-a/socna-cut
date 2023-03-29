import { useEffect, useMemo, useState } from 'react';
import styles from './add-material-button.module.scss';
import { BlockType1Data, BlockType4Data, BlockType7Data, MaterialData } from '@/global';
import { useDispatch, useSelector } from 'react-redux';
import { selectMaterialDataDict } from '@/redux/konva/konva.selectors';
import { addMaterialData } from '@/redux/konva/konva.actions';
import { v4 } from 'uuid';

type Props = {
  handleClick: () => void,
};

const AddMaterialButton: React.FC<Props> = ({handleClick}) => {
    const dispatch = useDispatch();


    const addMaterialDataMemoForTests= useMemo(function () {
      return function () {
        for(let i= 2; i<5; i++){
          const newMaterialData = new BlockType1Data(20, 20, i*10, 0);
          dispatch(addMaterialData(newMaterialData));
        }
        dispatch(addMaterialData(  new BlockType1Data(10, 20, 15, 50) ));
        dispatch(addMaterialData(  new BlockType4Data(30, 30, 20, 100) ));
        dispatch(addMaterialData(  new BlockType7Data(40, 20, 15, 200) ));

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
        {/* <button 
        onClick={addMaterialDataMemoForTests}
        onTouchStart={(e) => { e.stopPropagation();}} 
        onTouchEnd={(e) => { e.stopPropagation();}}>
          add materials (Test)
        </button> */}
      </div>
      );
  };
  
  export default AddMaterialButton;