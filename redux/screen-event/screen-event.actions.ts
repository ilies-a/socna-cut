import ScreenEventTypes from "./screen-event.types";

export const setTouches = (touches: React.TouchList | null) => ({
  type: ScreenEventTypes.SET_TOUCHES,
  payload: touches,
});

export const setIsRecording = (isRecording: boolean) => ({
  type: ScreenEventTypes.SET_IS_RECORDING,
  payload: isRecording,
});