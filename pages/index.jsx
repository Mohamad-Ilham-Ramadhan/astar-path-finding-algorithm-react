import { Inter } from 'next/font/google';
import {useState, useRef, useEffect} from 'react';
import { useSelector, useDispatch} from 'react-redux';
import { setBoxes } from '@/redux/slices/board';
import Box from '../components/box';

const inter = Inter({ subsets: ['latin'] });


export default function Home() {
  const dispatch = useDispatch();
  const board = useSelector( state => state.board);
  const {xLength, yLength, boxes} = board;
  const boardRef = useRef(null);

  console.log('board', board);
  console.log('boxes', boxes);

  // console.log('boardRef.current', boardRef.current);
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

  useEffect(() => { dispatch(setBoxes(renderBoxes(board)))}, []);
  
  return (
    <main>
      <div ref={boardRef} id="board" className='grid justify-center	'>
        {boxes}
      </div>
    </main>
  )
}
