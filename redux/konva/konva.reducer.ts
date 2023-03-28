import { MaterialData } from "@/global";
import KonvaActionTypes from "./konva.types";
import { addMaterialData, updateMaterialData } from "./konva.utils";

const INITIAL_STATE = {
  materialDataDict: {} as { [key: string]: MaterialData },
  draggableIcon: {} as {[key: string]: any},
  draggingBlockDimMenu: false,
  padPosition: null as [number, number] | null, //-1000 to make it initially out of screen
  iconPosition: [-1000, -1000] as [number, number] //-1000 to make it initially out of screen
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
    case KonvaActionTypes.SET_PAD_POSITION:
      return {
        ...state,
        padPosition: action.payload
      };
    case KonvaActionTypes.SET_ICON_POSITION:
      return {
        ...state,
        iconPosition: action.payload
      };
    default:
      return state;
  }
};

export default konvaReducer;


