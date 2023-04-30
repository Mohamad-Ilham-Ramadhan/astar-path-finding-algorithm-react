import { Inter } from 'next/font/google';
import {useState, useRef, useEffect} from 'react';
import { useSelector, useDispatch} from 'react-redux';
import { setBoxes, setXY, setBox, setPick, setPath, clearFoundedPath } from '@/redux/slices/board';
import Box from '../components/box';

const inter = Inter({ subsets: ['latin'] });


export default function Home() {
  const dispatch = useDispatch();
  const board = useSelector( state => state.board);
  const {xLength, yLength, boxes, a, b} = board;
  const boardRef = useRef(null);
  const [xInput, setXInput] = useState('');
  const [yInput, setYInput] = useState('');
  const [boardId, setBoardId] = useState(1);
  const pick = board.pick; // 'start', 'end', 'wall', 'path'
  // console.log('pick', pick);
  // console.log('board', board);
  // console.log('boxes', boxes);

  // manual set template because I don't know hot to implement it using tailwindcss
  if (boardRef.current !== null) {
    boardRef.current.style.gridTemplateRows = `repeat(${yLength}, 20px)`;
    boardRef.current.style.gridTemplateColumns = `repeat(${xLength}, 20px)`;
  }

  function renderBoxes(board) {
    console.log('renderBoxes');
    const indexes = xLength * yLength;
    console.log('indexes', indexes);
    let $boxes = [];
    for (let i = 0; i < indexes; i++) {
      const y = Math.floor(i / xLength);
      const x = i - (xLength * y);
      $boxes.push({x, y, type: Math.round(Math.random() * 10) <= 2 ? 'wall' : 'path', index: i})
    }
    return $boxes;
  }
  

  useEffect(() => { dispatch(setBoxes(renderBoxes(board)))}, [xLength, yLength, boardId]);

  return (
    <main>
      <div>
        <h1 className="text-center text-2xl font-semibold mb-2">Generate board</h1>
        <div className="flex justify-center mb-2">
          <label className="mr-2" htmlFor="x-length">
            X Length (max 30, min 2){' '}
            <input className="px-2 rounded" type="number" max={30} min={2} value={xInput} 
              onChange={(e) => {
                if (e.target.value > 30) e.target.value = 30;
                setXInput(e.target.value);
              }}
              onBlur={(e) => {
                if (e.target.value < 2) e.target.value = 2;
                setXInput(e.target.value);
              }}/>
          </label>
          <label htmlFor="x-length" className="mr-2">
            Y Length (max 30, min 2){' '}
            <input className="px-2 rounded" type="number" max={30} min={2} value={yInput} 
              onChange={(e) => {
                if (e.target.value > 30) e.target.value = 30;
                setYInput(e.target.value);
              }}
              onBlur={(e) => {
                if (e.target.value < 2) e.target.value = 2;
                setYInput(e.target.value);
              }}/>
          </label>
          <button className="rounded bg-blue-400 active:bg-blue-500 px-4"
            onClick={() => {
              dispatch(setXY({xLength: Number(xInput), yLength: Number(yInput)}));
              setBoardId( prevId => prevId + 1);
            }}
          >Generate</button>
        </div>
        <div className="flex gap-2 justify-center mb-2">
          <button className={`bg-white rounded flex items-center p-2 ${pick === 'start' && 'outline outline-2 outline-black' }`}
            onClick={() => dispatch(setPick('start'))}
          >
            <div className="bg-blue-700 w-5 h-5 mr-1"></div>
            <div>Pick Start</div>
          </button>
          <button className={`bg-white rounded flex items-center p-2 ${pick === 'end' && 'outline outline-2 outline-black' }`}
            onClick={() => dispatch(setPick('end'))}
          >
            <div className="bg-amber-500 w-5 h-5 mr-1"></div>
            <div>Pick End</div>
          </button>
          <button className={`bg-white rounded flex items-center p-2 ${pick === 'wall' && 'outline outline-2 outline-black' }`}
            onClick={() => dispatch(setPick('wall'))}
          >
            <div className="bg-black w-5 h-5 mr-1"></div>
            <div>Draw wall</div>
          </button>
        </div>
      </div>
      
      <div className="flex gap-2 justify-center mb-2">
        <button className="bg-white rounded p-2 active:outline active:outline-2 active:outline-black"
          onClick={() => {
            console.log('A* algorithm');
            dispatch(setPath());
          }}
        >Start</button>
        <button className="bg-white rounded p-2 active:outline active:outline-2 active:outline-black"
          onClick={() => {
            dispatch( clearFoundedPath() );
          }}
        >Clear</button>
      </div>

      <div ref={boardRef} id="board" className='grid justify-center	'>
        {boxes.length > 0 && boxes.map((b) => (
          <Box key={b.index} x={b.x} y={b.y} type={b.type} index={b.index} 
            onClick={ () => {
              dispatch(setBox({x: b.x, y: b.y, index: b.index}));
            }}
          />
        ))}
      </div>
    </main>
  )
}
