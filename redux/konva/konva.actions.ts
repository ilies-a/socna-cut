import { MaterialData } from "@/global";
import KonvaActionTypes from "./konva.types";

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