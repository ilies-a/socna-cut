import ScreenEventTypes from "./screen-event.types";

export const setScreenSize = (screenSize: [number, number]) => ({
  type: ScreenEventTypes.SET_SCREEN_SIZE,
  payload: screenSize,
});

export const setTouches = (touches: React.TouchList | null) => ({
  type: ScreenEventTypes.SET_TOUCHES,
  payload: touches,
});

export const setIsRecording = (isRecording: boolean) => ({
  type: ScreenEventTypes.SET_IS_RECORDING,
  payload: isRecording,
});