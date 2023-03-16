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