import PreloaderActionTypes from "./preloader.types";

export const setPreloadIsComplete = (isComplete:boolean) => ({
  type: PreloaderActionTypes.SET_PRELOAD_IS_COMPLETE,
  payload: isComplete,
});
