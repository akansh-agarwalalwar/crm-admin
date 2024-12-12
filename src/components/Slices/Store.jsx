
import { combineReducers } from "redux";

import profieReducer from "./UserSlice";


const rootReducer=combineReducers({

    profile:profieReducer,
    
})

export default rootReducer;
