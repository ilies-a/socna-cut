import { MaterialData, StateSpace } from "@/global";
import KonvaActionTypes from "./konva.types";

export const setPlanStateSpace = (stateSpace: StateSpace) => ({
  type: KonvaActionTypes.SET_PLAN_STATE_SPACE,
  payload: stateSpace,
});

export const addMaterialData = (MaterialData: MaterialData) => ({
  type: KonvaActionTypes.ADD_MATERIAL_DATA,
  payload: MaterialData,
});

export const updateMaterialData = (MaterialData: MaterialData) => ({
  type: KonvaActionTypes.UPDATE_MATERIAL_DATA,
  payload: MaterialData,
});

export const setDraggableIcon = (iconData: {[key: string]: any}) => ({
  type: KonvaActionTypes.SET_DRAGGABLE_ICON,
  payload: iconData,
});

export const setDraggingBlockDimMenu = (dragging: boolean) => ({
  type: KonvaActionTypes.SET_DRAGGING_BLOCK_DIM_MENU,
  payload: dragging,
});

export const setPadPosition = (position: [number, number]) => ({
  type: KonvaActionTypes.SET_PAD_POSITION,
  payload: position,
});

export const setIconPosition = (position: [number, number]) => ({
  type: KonvaActionTypes.SET_ICON_POSITION,
  payload: position,
});

export const updateDraggableIconPosition = (position: [number, number]) => ({
  type: KonvaActionTypes.UPDATE_DRAGGABLE_ICON_POSITION,
  payload: position,
});

export const setTappingOnIconButton = (tapping: boolean) => ({
  type: KonvaActionTypes.SET_TAPPING_ON_ICON_BUTTON,
  payload: tapping,
});

export const setAddBlockMenuStateSpace = (stateSpace: StateSpace) => ({
  type: KonvaActionTypes.SET_ADD_BLOCK_MENU_STATE_SPACE,
  payload: stateSpace,
});