
export default function Box({x,y}) {
   return (
      <div className="border-2 border-slate-400 border-solid bg-slate-100" data-x={x} data-y={y}></div>
   );
}