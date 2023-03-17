import { createSelector } from "reselect";

export const selectScreenEvent = (state: { screenEvent: any; }) => state.screenEvent;

export const selectTouches = createSelector(
  [selectScreenEvent],
  (screenEvent) => screenEvent.touches
);

export const selectIsRecording = createSelector(
  [selectScreenEvent],
  (screenEvent) => screenEvent.isRecording
);
