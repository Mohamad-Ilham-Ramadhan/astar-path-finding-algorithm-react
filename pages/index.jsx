import { Inter } from 'next/font/google';
import {useState} from 'react';
import { useSelector, useDispatch} from 'react-redux';
import Box from '../components/box';

const inter = Inter({ subsets: ['latin'] });


export default function Home() {
  const dispatch = useDispatch();
  const board = useSelector( state => state.board);

  console.log('board', board);

  function renderBoxes(board) {
    const indexes = board.xLength * board.yLength;

    for (let i = 0; i < indexes; i++) {
      const y = Math.floor();
    }

  }
  
  return (
    <main>
      <div id="board" className="grid grid-rows-[repeat(10,_20px)] grid-cols-[repeat(10,_20px)]">
        <Box />
        <Box />
      </div>
    </main>
  )
}
