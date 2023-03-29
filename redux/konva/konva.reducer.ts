import { MaterialData, StateSpace } from "@/global";
import KonvaActionTypes from "./konva.types";
import { addMaterialData, updateDraggableIconPosition, updateMaterialData } from "./konva.utils";

const INITIAL_STATE = {
  planStateSpace: new StateSpace(0,0,0,0),
  materialDataDict: {} as { [key: string]: MaterialData },
  draggableIcon: {} as {[key: string]: any},
  draggingBlockDimMenu: false,
  // padPosition: null as [number, number] | null,
  // iconPosition: [-1000, -1000] as [number, number], //-1000 to make it initially out of screen
  tappingOnDraggableIcon: false,
  addBlockMenuStateSpace: new StateSpace(0,0,0,0),
};

const konvaReducer = (state = INITIAL_STATE, action: { type: any; payload: any; }) => {
  switch (action.type) {
    case KonvaActionTypes.SET_PLAN_STATE_SPACE:
      return {
        ...state,
        planStateSpace: action.payload as StateSpace
      };
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
    case KonvaActionTypes.UPDATE_DRAGGABLE_ICON_POSITION:
      return {
        ...state,
        draggableIcon: updateDraggableIconPosition(state.draggableIcon, action.payload as [number, number])
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
    case KonvaActionTypes.SET_TAPPING_ON_ICON_BUTTON:
      return {
        ...state,
        tappingOnIconButton: action.payload
      };
    case KonvaActionTypes.SET_ADD_BLOCK_MENU_STATE_SPACE:
      return {
        ...state,
        addBlockMenuStateSpace: action.payload as StateSpace
      };
    default:
      return state;
  }
};

export default konvaReducer;


