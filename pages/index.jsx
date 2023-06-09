import { Inter } from 'next/font/google';
import { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setXLength, setYLength, setBoxes, setXY, setBox, setPick, setPath, clearFoundedPath } from '@/redux/slices/board';
import Box from '../components/box';

const inter = Inter({ subsets: ['latin'] });


export default function Home() {
  const [$document, setDocument] = useState(null);
  const dispatch = useDispatch();
  const board = useSelector(state => state.board);
  const { xLength, yLength, boxes, a, b } = board;
  const boardRef = useRef(null);
  const [xGrid, setXGrid] = useState('');
  const [yGrid, setYGrid] = useState('');
  const [boardId, setBoardId] = useState(1);
  const pick = board.pick; // 'start', 'end', 'wall', 'path'
  const path = board.path;

  // manual set template because I don't know hot to implement it using tailwindcss
  if (boardRef.current !== null) {
    boardRef.current.style.gridTemplateRows = `repeat(${yGrid}, 18px)`;
    boardRef.current.style.gridTemplateColumns = `repeat(${xGrid}, 18px)`;
  }


  function keyboardShortcuts(e) {
    const key = e.key;
    console.log('key', key);
    if (key === ' ') {
      e.preventDefault();
      dispatch(clearFoundedPath());
      dispatch(setPath());
    } else if (key === 's' || key === 'S') {
      pickOption('start')();
    } else if (key === 'e' || key === 'E') {
      pickOption('end')();
    } else if (key === 'w' || key === 'W') {
      pickOption('wall')();
    } else if (key === 'c' || key === 'C') {
      clearPath();
    }
  }

  useEffect(() => {
    setXGrid(xLength); setYGrid(yLength);
    dispatch(setBoxes());
    document.body.addEventListener('keydown', keyboardShortcuts);
  }, []);

  useEffect(() => {
      // set keyboard shortcuts 
  }, [path]);

  function startPathFinding(path) {
    return () => {
      console.log('A* algorithm');
      console.log('path', path);
      if (path.length > 0) {
        console.log('clear path');
        dispatch(clearFoundedPath());
      }
      dispatch(setPath());
    }
  }
  function clearPath() {
    dispatch(clearFoundedPath());
  }
  function pickOption(option) {
    return () => {
      dispatch(setPick(option))
    }
  }

  return (
    <main >
      <div>
        <h1 className="text-center text-2xl font-semibold mb-2">Generate board</h1>
        <div className="flex justify-center mb-2">
          <label className="mr-2" htmlFor="x-length">
            X Length (max 30, min 2){' '}
            <input className="px-2 rounded" type="number" max={30} min={2} value={xLength}
              onChange={(e) => {
                if (e.target.value > 30) e.target.value = 30;
                dispatch(setXLength(e.target.value));
              }}
              onBlur={(e) => {
                if (e.target.value < 2) e.target.value = 2;
                dispatch(setXLength(e.target.value));
              }} onKeyDown={(e) => e.stopPropagation()} />
          </label>
          <label htmlFor="x-length" className="mr-2">
            Y Length (max 30, min 2){' '}
            <input className="px-2 rounded" type="number" max={30} min={2} value={yLength}
              onChange={(e) => {
                if (e.target.value > 30) e.target.value = 30;
                dispatch(setYLength(e.target.value));
              }}
              onBlur={(e) => {
                if (e.target.value < 2) e.target.value = 2;
                dispatch(setYLength(e.target.value));
              }} onKeyDown={(e) => e.stopPropagation()} />
          </label>
          <button className="rounded bg-blue-400 active:bg-blue-500 px-4"
            onClick={() => {
              setXGrid(xLength);
              setYGrid(yLength);
              dispatch(setBoxes());
            }}
          >Generate</button>
        </div>
        <div className="flex gap-2 justify-center mb-2">
          <button className={`bg-white rounded flex items-center p-2 ${pick === 'start' && 'outline outline-2 outline-black'}`}
            onClick={pickOption('start')}
          >
            <div className="bg-blue-700 w-5 h-5 mr-1"></div>
            <div>Pick Start</div>
          </button>
          <button className={`bg-white rounded flex items-center p-2 ${pick === 'end' && 'outline outline-2 outline-black'}`}
            onClick={pickOption('end')}
          >
            <div className="bg-amber-500 w-5 h-5 mr-1"></div>
            <div>Pick End</div>
          </button>
          <button className={`bg-white rounded flex items-center p-2 ${pick === 'wall' && 'outline outline-2 outline-black'}`}
            onClick={pickOption('wall')}
          >
            <div className="bg-black w-5 h-5 mr-1"></div>
            <div>Draw wall</div>
          </button>
        </div>
      </div>

      <div className="flex gap-2 justify-center mb-2">
        <button className="bg-white rounded p-2 active:outline active:outline-2 active:outline-black"
          onClick={startPathFinding(path)}
        >Start</button>
        <button className="bg-white rounded p-2 active:outline active:outline-2 active:outline-black"
          onClick={clearPath}
        >Clear</button>
      </div>

      <div ref={boardRef} id="board" className='grid justify-center	mb-8'>
        {boxes.length > 0 && boxes.map((b) => (
          <Box key={b.index} x={b.x} y={b.y} type={b.type} index={b.index}
            onClick={() => {
              dispatch(setBox({ x: b.x, y: b.y, index: b.index }));
            }}
          />
        ))}
      </div>
    </main>
  )
}
