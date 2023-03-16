import { MaterialData } from "@/global";
import KonvaActionTypes from "./konva.types";
import { addMaterialData, updateMaterialData } from "./konva.utils";

const INITIAL_STATE = {
  materialDataDict: {} as { [key: string]: MaterialData },
};

const konvaReducer = (state = INITIAL_STATE, action: { type: any; payload: any; }) => {
  switch (action.type) {
    case KonvaActionTypes.ADD_MATERIAL_DATA:
      return {
        ...state,
        materialDataDict: addMaterialData(state.materialDataDict, action.payload as MaterialData)
      };
    case KonvaActionTypes.UPDATE_MATERIAL_DATA:
      return {
        ...state,
        materialDataDict: updateMaterialData(state.materialDataDict, action.payload as MaterialData)
      };
    default:
      return state;
  }
};

export default konvaReducer;


