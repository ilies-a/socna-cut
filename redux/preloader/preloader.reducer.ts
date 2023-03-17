import PreloadActionTypes from "./preloader.types";

const INITIAL_STATE = {
  preloadIsComplete: false,
};

const PreloaderReducer = (state = INITIAL_STATE, action: { type: any; payload: any; }) => {
  switch (action.type) {
    case PreloadActionTypes.SET_PRELOAD_IS_COMPLETE:
      return {
        ...state,
        preloadIsComplete: action.payload,
      };
    default:
      return state;
  }
};

export default PreloaderReducer;
