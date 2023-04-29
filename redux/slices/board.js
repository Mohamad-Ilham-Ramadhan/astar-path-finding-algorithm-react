import { createSlice } from "@reduxjs/toolkit"

const boardSlice = createSlice({
   name: 'board',
   initialState: {
    xLength: 10,
    yLength: 10,
   },
   reducers: {
     addBoard(state, action) {
         // "mutate" the array by calling push()
         state.push(action.payload)
     },
   },
 })
 
 // Extract the action creators object and the reducer
 const { actions, reducer } = boardSlice
 // Extract and export each action creator by name
 export const { addBoard } = actions
 // Export the reducer, either as a default or named export
 export default reducer