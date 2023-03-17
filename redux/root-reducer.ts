import { combineReducers } from "redux";
import preloaderReducer from "./preloader/preloader.reducer";
import konvaReducer from "./konva/konva.reducer";
import screenEventReducer from "./screen-event/screen-event.reducer";

const rootReducer = combineReducers({
    konva: konvaReducer,
    screenEvent: screenEventReducer,
    preloader: preloaderReducer
});

export default rootReducer;
