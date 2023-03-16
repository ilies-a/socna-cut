import { combineReducers } from "redux";
import konvaReducer from "./konva/konva.reducer";
import screenEventReducer from "./screen-event/screen-event.reducer";

const rootReducer = combineReducers({
    konva: konvaReducer,
    screenEvent: screenEventReducer,
});

export default rootReducer;
