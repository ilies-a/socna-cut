import { createSelector } from "reselect";

export const selectPreloader = (state:any) => state.preloader;

export const selectPreloadIsComplete = createSelector(
  [selectPreloader],
  (preloader) => preloader.preloadIsComplete
);
