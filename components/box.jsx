
export default function Box({x,y, type}) {
   let bg = '';
   if (type === 'path') {
      bg = 'bg-slate-100';
   } else if (type === 'founded-path') {
      bg = 'bg-sky-400';
   } else if (type === 'wall') {
      bg = 'bg-slate-950';
   } else if (type === 'start') {
      bg = 'bg-blue-700';
   } else if (type === 'end') {
      bg = 'bg-amber-500';
   }
   return (
      <div className={`border-2 border-slate-400 border-solid ${bg}`} data-x={x} data-y={y} type={type}></div>
   );
}