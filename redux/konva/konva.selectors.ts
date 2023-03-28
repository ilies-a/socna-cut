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

export const selectPadPosition = createSelector(
  [selectKonva],
  (konva) => konva.padPosition
);

export const selectIconPosition = createSelector(
  [selectKonva],
  (konva) => konva.iconPosition
);