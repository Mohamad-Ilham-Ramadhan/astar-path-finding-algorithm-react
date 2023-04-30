import { useSelector, useDispatch } from "react-redux";

export default function Box({x,y,index,type, ...props}) {
   const dispatch = useDispatch();
   const pick = useSelector( state => state.board.pick)
   let bg = '';
   if (type === 'path') {
      bg = 'bg-slate-100';
   } else if (type === 'founded-path') {
      bg = 'bg-cyan-300';
   } else if (type === 'wall') {
      bg = 'bg-slate-950';
   } else if (type === 'start') {
      bg = 'bg-blue-700';
   } else if (type === 'end') {
      bg = 'bg-amber-500';
   }
   return (
      <div {...props} className={`border-2 border-slate-400 border-solid ${bg}`} data-x={x} data-y={y} data-index={index} data-type={type}></div>
   );
}