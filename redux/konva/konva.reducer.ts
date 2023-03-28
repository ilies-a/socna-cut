import { MaterialData } from "@/global";
import KonvaActionTypes from "./konva.types";
import { addMaterialData, updateMaterialData } from "./konva.utils";

const INITIAL_STATE = {
  materialDataDict: {} as { [key: string]: MaterialData },
  draggableIcon: {} as {[key: string]: any},
  draggingBlockDimMenu: false
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
    case KonvaActionTypes.SET_DRAGGABLE_ICON:
      return {
        ...state,
        draggableIcon: action.payload
      };
    case KonvaActionTypes.SET_DRAGGING_BLOCK_DIM_MENU:
      return {
        ...state,
        draggingBlockDimMenu: action.payload
      };
    default:
      return state;
  }
};

export default konvaReducer;


