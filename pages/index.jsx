import { Inter } from 'next/font/google';
import {useState, useRef, useEffect} from 'react';
import { useSelector, useDispatch} from 'react-redux';
import { setBoxes, setXY } from '@/redux/slices/board';
import Box from '../components/box';

const inter = Inter({ subsets: ['latin'] });


export default function Home() {
  const dispatch = useDispatch();
  const board = useSelector( state => state.board);
  const {xLength, yLength, boxes} = board;
  const boardRef = useRef(null);
  const [xInput, setXInput] = useState('');
  const [yInput, setYInput] = useState('');

  console.log('board', board);
  console.log('boxes', boxes);

  // manual set template because I don't know hot to implement it using tailwindcss
  if (boardRef.current !== null) {
    boardRef.current.style.gridTemplateRows = `repeat(${yLength}, 20px)`;
    boardRef.current.style.gridTemplateColumns = `repeat(${xLength}, 20px)`;
  }

  function renderBoxes(board) {
    const indexes = xLength * yLength;
    let $boxes = [];
    for (let i = 0; i < indexes; i++) {
      const y = Math.floor(i / xLength);
      const x = i - (xLength * y);
      $boxes.push(<Box key={`${x}${y}`} x={x} y={y} />)
    }

    return $boxes;
  }

  useEffect(() => { dispatch(setBoxes(renderBoxes(board)))}, [xLength, yLength]);
  
  return (
    <main>
      <div>
        <h1 className="text-center text-2xl font-semibold mb-2">Generate board</h1>
        <div className="flex justify-center mb-2">
          <label className="mr-2" htmlFor="x-length">
            X Length (max 30, min 2){' '}
            <input type="number" max={30} min={2} value={xInput} 
              onChange={(e) => {
                if (e.target.value > 30) e.target.value = 30;
                setXInput(e.target.value);
              }}
              onBlur={(e) => {
                if (e.target.value < 2) e.target.value = 2;
                setXInput(e.target.value);;
              }}/>
          </label>
          <label htmlFor="x-length" className="mr-2">
            Y Length (max 30, min 2){' '}
            <input type="number" max={30} min={2} value={yInput} 
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
            }}
          >Generate</button>
        </div>
      </div>
      <div ref={boardRef} id="board" className='grid justify-center	'>
        {boxes}
      </div>
    </main>
  )
}