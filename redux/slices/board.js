import { createSlice } from "@reduxjs/toolkit";
import Box from '../../components/box';

const boardSlice = createSlice({
   name: 'board',
   initialState: {
    xLength: 8,
    yLength: 8,
    boxes: [],
    start: null,
    end: null,
    pick: '', // start, end, wall, path
   },
   reducers: {
     setBoxes(state, action) {
      console.log
      state.boxes = action.payload;
     },
     setXY(state, action) {
      state.xLength = action.payload.xLength;
      state.yLength = action.payload.yLength;
     },
     setBox(state, action) {
      const {index, x, y} = action.payload;
      if (state.pick === 'start') {
        if (state.start === null) {
          state.start = {index, x, y, type: 'start'};
        } else {
          console.log('state.start.index', state.start.index);
          state.boxes[state.start.index] = {...state.start, type: 'path'};
          state.start = {index, x, y, type: 'path'};
        }
      }
      if (state.pick === 'end') {
        if (state.end === null) {
          state.end = {index, x, y, type: 'end'};
        } else {
          console.log('state.end.index', state.end.index);
          state.boxes[state.end.index] = {...state.end, type: 'path'};
          state.end = {index, x, y, type: 'path'};
        }
      }
      state.boxes[index] = {index, x, y, type: state.pick};
     },
     setPick(state, action) {
      state.pick = action.payload;
     }
   },
 })
 
 // Extract the action creators object and the reducer
 const { actions, reducer } = boardSlice
 // Extract and export each action creator by name
 export const { setXY, setBoxes, setBox, setPick } = actions
 // Export the reducer, either as a default or named export
 export default reducer