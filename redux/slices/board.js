import { createSlice } from "@reduxjs/toolkit"

const boardSlice = createSlice({
   name: 'board',
   initialState: {
    xLength: 8,
    yLength: 8,
    boxes: [],
   },
   reducers: {
     setBoxes(state, action) {
      console.log
      state.boxes = action.payload;
     },
     setXY(state, action) {
      state.xLength = action.payload.xLength;
      state.yLength = action.payload.yLength;
     }
   },
 })
 
 // Extract the action creators object and the reducer
 const { actions, reducer } = boardSlice
 // Extract and export each action creator by name
 export const { setXY, setBoxes } = actions
 // Export the reducer, either as a default or named export
 export default reducer