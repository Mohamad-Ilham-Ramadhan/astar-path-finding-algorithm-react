import { createSlice, createAsyncThunk, } from "@reduxjs/toolkit";
import { store } from "../store";

// const setPathAsync = createAsyncThunk(
//   'board/setPathAsync',
//   async ()
// );

const boardSlice = createSlice({
  name: 'board',
  initialState: {
    xLength: 8,
    yLength: 8,
    boxes: [],
    start: null,
    end: null,
    pick: '', // start, end, wall, path
    path: [],
    a: '',
    b: '',
  },
  reducers: {
    setBoxes(state, action) {
      state.start = null; state.end = null;
      state.boxes = action.payload;
    },
    setXY(state, action) {
      state.xLength = action.payload.xLength;
      state.yLength = action.payload.yLength;
    },
    setBox(state, action) {
      const { index, x, y } = action.payload;

      let type = state.pick;
      if (state.pick === 'start') {
        if (state.start === null) {
          state.start = { index, x, y, type: 'start' };
        } else {
          console.log('state.start.index', state.start.index);
          state.boxes[state.start.index] = { ...state.start, type: 'path' };
          state.start = { index, x, y, type: 'path' };
        }
      } else if (state.pick === 'end') {
        if (state.end === null) {
          state.end = { index, x, y, type: 'end' };
        } else {
          console.log('state.end.index', state.end.index);
          state.boxes[state.end.index] = { ...state.end, type: 'path' };
          state.end = { index, x, y, type: 'path' };
        }
      } else if (state.pick === 'wall') {
        if (state.boxes[index].type === 'wall') {
          type = 'path';
        }
      }
      state.boxes[index] = { index, x, y, type: type };
    },
    setPick(state, action) {
      state.pick = action.payload;
    },
    //  where A* algorithm is used
    setPath(state, action) {
      // convert to cartesian coordinates
      const start = Object.assign({}, state.start);

      function reconstructPath(cameFrom, current, board) {
        console.log('cameFrom', cameFrom);
        // const newBoard = _.cloneDeep(board);
        let path = [current];
        // newBoard[current[1]][current[0]] = 2;
        while (cameFrom.get(nodeToKey(current)) !== undefined) {
          current = cameFrom.get(nodeToKey(current));
          // newBoard[current[1]][current[0]] = 2;
          path.unshift({ ...current, type: current.type === 'path' ? 'founded-path' : current.type })
        }
        return path;

      }

      // Manhattan distance heuristic function 
      function h(n) {
        const x1 = n.x;
        const x2 = state.end.x;
        const y1 = n.y;
        const y2 = state.end.y;
        return Math.abs(x1 - x2) + Math.abs(y1 - y2);
      }

      function nodeToKey(n) {
        return `${n.x}${n.y}`;
      }

      // openSet is a priority queue
      let openSet = [start];
      let cameFrom = new Map();

      // O(n^2) (harus diakali ini)
      let gScore = {};
      // for (let y = 0; y < board.length; y++) {
      //   for (let x = 0; x < board[y].length; x++) {
      //     gScore[`${x},${y}`] = Infinity;
      //   }
      // }
      // For node n, fScore[n] := gScore[n] + h(n). fScore[n] represents our current best guess as to
      // how cheap a path could be from start to finish if it goes through n.
      let fScore = Object.assign({}, gScore);

      gScore[nodeToKey(start)] = 0;
      fScore[nodeToKey(start)] = h(start);

      while (openSet.length > 0) {
        const current = openSet.pop();
        if (current.x == state.end.x && current.y == state.end.y) {
          // return reconstructPath(cameFrom, current, state.boxes);
          console.log('reconstructPath', reconstructPath(cameFrom, current, state.boxes));
          state.path = reconstructPath(cameFrom, current, state.boxes);
        }

        // collecting all the neighbors of the current
        let neighbors = [];
        const forbiddenType = ['wall', 'start', 'end']; // box's type which is not allowed to count as neighbor
        if (current.x - 1 >= 0 && current.type !== 'wall') {
          const box = Object.assign({}, state.boxes[current.index - 1]); // use Object.assign to deal with redux-toolkit Proxy object error/bug
          neighbors.push({ ...box, pos: 'left' });
        }

        if (current.y - 1 >= 0 && current.type !== 'wall') {
          const box = Object.assign({}, state.boxes[current.index - state.xLength]);
          neighbors.push({ ...box, pos: 'top' });
        }

        if (current.x + 1 < state.xLength && current.type !== 'wall') {
          const box = Object.assign({}, state.boxes[current.index + 1]);
          neighbors.push({ ...box, pos: 'right' });
        }

        if (current.y + 1 < state.yLength && current.type !== 'wall') {
          const box = Object.assign({}, state.boxes[current.index + state.xLength]);
          neighbors.push({ ...box, pos: 'bottom' });
        }
        for (let neighbor of neighbors) {

          // tentative_gScore is the distance from start to the neighbor through current
          const tentative_gScore = gScore[nodeToKey(current)] + 1; // gScore[current] + d(current, neighbor), d(current,neighbor) is the weight of the edge from current to neighbor

          gScore[nodeToKey(neighbor)] = gScore[nodeToKey(neighbor)] === undefined ? Infinity : gScore[nodeToKey(neighbor)];
          if (tentative_gScore < gScore[nodeToKey(neighbor)]) {
            // This path to neighbor is better than any previous one. Record it!
            cameFrom.set(nodeToKey(neighbor), current);
            gScore[nodeToKey(neighbor)] = tentative_gScore;
            fScore[nodeToKey(neighbor)] = tentative_gScore + h(neighbor);

            if (!openSet.find(n => n.x === neighbor.x && n.y === neighbor.y)) {
              // add to priority queue 
              // arr.sort( (a, b) => b - a );
              openSet.push(neighbor);
              openSet.sort((a, b) => fScore[nodeToKey(b)] - fScore[nodeToKey(a)]);
            }
          }
        }
      }

      console.log('end of setPath');
    },
    setFoundedPath(state, action) {
      const box = action.payload;
      state.boxes[box.index] = box;
    },
    clearFoundedPath(state, action) {
      for (let i = 0; i < state.path.length; i++) {
        const box = state.path[i];
        state.boxes[box.index] = {...box, type: 'path'};
      }
      state.start = null; state.end = null;
    }
  },
})

// Extract the action creators object and the reducer
const { actions, reducer } = boardSlice
// Extract and export each action creator by name
export const { setXY, setBoxes, setBox, setPick, setPath, setFoundedPath, clearFoundedPath } = actions
// Export the reducer, either as a default or named export
export default reducer