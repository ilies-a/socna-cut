import { createSelector } from "reselect";

export const selectKonva = (state: { konva: any; }) => state.konva;

export const selectMaterialDataDict = createSelector(
  [selectKonva],
  (konva) => konva.materialDataDict
);

export const selectDraggableIcon = createSelector(
  [selectKonva],
  (konva) => konva.draggableIcon
);

export const selectDraggingBlockDimMenu = createSelector(
  [selectKonva],
  (konva) => konva.draggingBlockDimMenu
);