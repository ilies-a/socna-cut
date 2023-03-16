import { createSelector } from "reselect";

export const selectKonva = (state: { konva: any; }) => state.konva;

export const selectMaterialDataDict = createSelector(
  [selectKonva],
  (konva) => konva.materialDataDict
);
