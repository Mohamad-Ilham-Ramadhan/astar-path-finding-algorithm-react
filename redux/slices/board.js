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
      console.log('setBoxes', action.payload)
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
      // function astar(board, start, destination) {
        // convert to cartesian coordinates
        const start = Object.assign({}, state.start);
        let path = [];

        function reconstructPath(cameFrom, current, board) {
          console.log('cameFrom', cameFrom);
          // const newBoard = _.cloneDeep(board);
          let path = [current];
          // newBoard[current[1]][current[0]] = 2;
          // console.log('current', current, 'nodeToKey', nodeToKey(current), 'cameFrom.get("9,9")', cameFrom.get('9,9'));
          // console.log('cameFrom.get(nodeToKey(current))', cameFrom.get(nodeToKey(current)));
          while (cameFrom.get(nodeToKey(current)) !== undefined) {
            current = cameFrom.get(nodeToKey(current));
            // newBoard[current[1]][current[0]] = 2;
            path.unshift({...current, type: current.type === 'path' ? 'founded-path' : current.type})
          }
          return { path };

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
            path = reconstructPath(cameFrom, current, state.boxes);
          }

          // collecting all the neighbors of the current
          let neighbors = [];
          // if (board[current[1]] !== undefined) {
          //   const left = board[current[1]][current[0] - 1];
          //   if (left !== undefined && left !== 0) {
          //     neighbors.push([current[0] - 1, current[1]]);
          //   }
          // }
          if (current.x - 1 >= 0 && current.type !== 'wall') {
            // neighbors.push({...current, x: current.x - 1, index: current.index - 1});
            const box = Object.assign({}, state.boxes[current.index - 1]);
            neighbors.push({...box, pos: 'left'});
          }

          // if (board[current[1] - 1]) {
          //   const top = board[current[1] - 1][current[0]];
          //   if (top !== undefined && top !== 0) {
          //     neighbors.push([current[0], current[1] - 1]);
          //   }
          // }
          if (current.y - 1 >= 0 && current.type !== 'wall') {
            // neighbors.push({...current, y: current.y - 1, index: current.index - state.yLength});
            const box = Object.assign({}, state.boxes[current.index - state.xLength]);
            neighbors.push({...box, pos: 'top'});
          }


          // if (board[current[1]]) {
          //   const right = board[current[1]][current[0] + 1];
          //   if (right !== undefined && right !== 0) {
          //     neighbors.push([current[0] + 1, current[1]]);
          //   }
          // }
          if (current.x + 1 < state.xLength && current.type !== 'wall') {
            // neighbors.push({...current, x: current.x + 1, index: current.index + 1});
            const box = Object.assign({}, state.boxes[current.index + 1]);
            neighbors.push({...box, pos: 'right'});
          }

          // if (board[current[1] + 1]) {
          //   const bottom = board[current[1] + 1][current[0]];
          //   if (bottom !== undefined && bottom !== 0) {
          //     neighbors.push([current[0], current[1] + 1]);
          //   }
          // }
          if (current.y + 1 < state.yLength && current.type !== 'wall') {
            // neighbors.push({...current, y: current.y + 1, index: current.index + state.yLength});
            const box = Object.assign({}, state.boxes[current.index + state.xLength]);
            neighbors.push({...box, pos: 'bottom'});
          }
          for (let neighbor of neighbors) {

            // console.log('gScore[nodeToKey(neighbor)]', gScore[nodeToKey(neighbor)]);

            // tentative_gScore is the distance from start to the neighbor through current
            const tentative_gScore = gScore[nodeToKey(current)] + 1; // gScore[current] + d(current, neighbor), d(current,neighbor) is the weight of the edge from current to neighbor

            gScore[nodeToKey(neighbor)] = gScore[nodeToKey(neighbor)] === undefined ? Infinity : gScore[nodeToKey(neighbor)];
            // console.log('tentative_gScore', tentative_gScore, 'gScore[nodeToKey(neighbor)]', gScore[nodeToKey(neighbor)], 'pos', neighbor.pos);
            if (tentative_gScore < gScore[nodeToKey(neighbor)]) {
              // console.log('asdf');
              // This path to neighbor is better than any previous one. Record it!
              console.log('neighbor', neighbor, 'current', current);
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
        console.log('SAMPE SINI!', typeof path, path);

        // update state.boxes (for coloring path)
        for (let box of path.path) {
          // con
          state.boxes[box.index] = box;
        }
      // }
    }
  },
})

// Extract the action creators object and the reducer
const { actions, reducer } = boardSlice
// Extract and export each action creator by name
export const { setXY, setBoxes, setBox, setPick, setPath } = actions
// Export the reducer, either as a default or named export
export default reducer