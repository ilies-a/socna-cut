import { MaterialData } from "@/global";
import ScreenEventTypes from "./screen-event.types";

const INITIAL_STATE = {
  screenSize: [0, 0] as [number, number],
  isRecording: false, 
  touches: null as React.TouchList | null,
};

const screenEventReducer = (state = INITIAL_STATE, action: { type: any; payload: any; }) => {
  switch (action.type) {
    case ScreenEventTypes.SET_SCREEN_SIZE:
      return {
        ...state,
        screenSize: action.payload
      };
    case ScreenEventTypes.SET_IS_RECORDING:
      return {
        ...state,
        isRecording: action.payload
      };
    case ScreenEventTypes.SET_TOUCHES:
      return {
        ...state,
        touches: action.payload
      };
    default:
      return state;
  }
};

export default screenEventReducer;


