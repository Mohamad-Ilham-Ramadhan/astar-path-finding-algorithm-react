import { combineReducers } from "@reduxjs/toolkit";
// import todosReducer from './todo';
import boardReducer from '../slices/board';

export const rootReducer = combineReducers({
   board: boardReducer,
});
