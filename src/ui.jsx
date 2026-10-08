import {useEffect,useId,useLayoutEffect,useRef,useState} from 'react'
import {Check,ChevronDown,ChevronLeft,ChevronRight,CalendarDays,X} from 'lucide-react'
import {useApp,ym,iso} from './store'

// Native <select>, <input type="date"> and <input type="month"> popups are drawn by the browser/OS and cannot be styled with CSS,
// so these are custom replacements that use the site's colors, radius and font. Month/weekday names come from Intl in the
// app language, so no extra translations are needed.
const ring='transition-colors hover:border-slate-400 aria-expanded:border-em aria-expanded:ring-2 aria-expanded:ring-emerald-100'
const trigger=`inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-semibold ${ring}`
const triggerBlock=`flex w-full items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-left text-sm ${ring}`
const nav='grid h-8 w-8 place-items-center rounded-lg text-slate-500 transition-colors hover:bg-emerald-50 hover:text-em'
const panel='absolute z-20 mt-2 max-w-[calc(100vw-2rem)] rounded-2xl border border-slate-200 bg-white p-3 shadow-lg'
const foot='flex-1 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-50'
const cap=s=>s.charAt(0).toUpperCase()+s.slice(1)
const longM=(loc,y,m)=>cap(new Date(y,m-1,1).toLocaleDateString(loc,{month:'long'}))+' '+y
const Chev=({open})=><ChevronDown size={16} className={`ml-auto shrink-0 text-slate-500 transition-transform ${open?'rotate-180':''}`}/>

// Open/close state, close on outside click / Esc, and open to the left or right so the panel never leaves the screen
function usePopover(width){const [open,setOpen]=useState(false),[right,setRight]=useState(false),ref=useRef(null)
useLayoutEffect(()=>{if(open&&ref.current)setRight(ref.current.getBoundingClientRect().left+width>window.innerWidth-8)},[open,width])
useEffect(()=>{if(!open)return
const down=e=>ref.current&&!ref.current.contains(e.target)&&setOpen(false)
const key=e=>e.key==='Escape'&&setOpen(false)
document.addEventListener('mousedown',down);document.addEventListener('keydown',key)
return()=>{document.removeEventListener('mousedown',down);document.removeEventListener('keydown',key)}},[open])
return [open,setOpen,ref,right]}
const side=r=>r?'right-0':'left-0'
// Panels can sit inside a <label>; this stops clicks on empty panel space from re-triggering the label's button
const stop=e=>e.preventDefault()

// options: [[value,label],...]. Keyboard: Arrows, Home/End, Enter/Space, Esc.
export function Dropdown({value,onChange,options,ariaLabel,icon:Icon,className=''}){
const [open,setOpen,ref,right]=usePopover(176),[hi,setHi]=useState(0),uid=useId()
const idx=Math.max(0,options.findIndex(o=>o[0]===value)),cur=options[idx]
const openMenu=()=>{setHi(idx);setOpen(true)}
const pick=v=>{onChange(v);setOpen(false)}
const onKey=e=>{
if(!open){if(['ArrowDown','ArrowUp','Enter',' '].includes(e.key)){e.preventDefault();openMenu()}return}
if(e.key==='ArrowDown'){e.preventDefault();setHi(h=>(h+1)%options.length)}
else if(e.key==='ArrowUp'){e.preventDefault();setHi(h=>(h-1+options.length)%options.length)}
else if(e.key==='Home'){e.preventDefault();setHi(0)}
else if(e.key==='End'){e.preventDefault();setHi(options.length-1)}
else if(e.key==='Enter'||e.key===' '){e.preventDefault();pick(options[hi][0])}
else if(e.key==='Tab')setOpen(false)}
return <div ref={ref} className={`relative ${className}`}>
<button type="button" aria-label={ariaLabel} aria-haspopup="listbox" aria-expanded={open} aria-controls={uid} aria-activedescendant={open?`${uid}-${hi}`:undefined}
onClick={()=>open?setOpen(false):openMenu()} onKeyDown={onKey} onKeyUp={e=>e.key===' '&&e.preventDefault()} className={trigger}>
{Icon&&<Icon size={16} className="text-slate-500"/>}<span>{cur[1]}</span><Chev open={open}/></button>
{open&&<ul id={uid} role="listbox" aria-label={ariaLabel} className={`absolute ${side(right)} z-20 mt-2 w-44 rounded-xl border border-slate-200 bg-white p-1 shadow-lg`}>
{options.map(([v,l],i)=>{const sel=v===value
return <li key={v} id={`${uid}-${i}`} role="option" aria-selected={sel} onMouseEnter={()=>setHi(i)} onMouseDown={e=>e.preventDefault()} onClick={()=>pick(v)}
className={`flex cursor-pointer items-center justify-between rounded-lg px-3 py-2 text-sm font-semibold ${sel?'bg-emerald-50 text-em':hi===i?'bg-slate-50':''}`}>{l}{sel&&<Check size={16}/>}</li>})}</ul>}</div>}

// Month grid with year arrows. Without props it controls the app-wide month (Dashboard, Budget).
// With value/onChange it is a normal field ("" = nothing chosen); clearable adds a reset button; block makes it full-width.
export function MonthPicker({value,onChange,clearable,block}){const {t,loc,month,setMonth}=useApp()
const shared=value===undefined,val=shared?month:value,set=shared?setMonth:onChange
const [open,setOpen,ref,right]=usePopover(256),[yr,setYr]=useState(0)
const now=ym(new Date()),[ny,nm]=now.split('-').map(Number),[y,m]=(val||now).split('-').map(Number)
const names=[...Array(12)].map((_,i)=>cap(new Date(2000,i,1).toLocaleDateString(loc,{month:'short'}).replace('.','')))
const pick=v=>{set(v);setOpen(false)}
return <div ref={ref} className={`relative ${block?'w-full':''}`}>
<button type="button" aria-haspopup="dialog" aria-expanded={open} onClick={()=>{if(!open)setYr(y);setOpen(!open)}} className={block?triggerBlock:trigger}>
<CalendarDays size={16} className="shrink-0 text-slate-500"/><span className={val?'':'text-slate-400'}>{val?longM(loc,y,m):t.date}</span><Chev open={open}/></button>
{open&&<div role="dialog" aria-label={t.date} onClick={stop} className={`${panel} ${side(right)} w-64`}>
<div className="mb-2 flex items-center justify-between"><button type="button" aria-label={String(yr-1)} className={nav} onClick={()=>setYr(yr-1)}><ChevronLeft size={18}/></button>
<span className="text-sm font-extrabold">{yr}</span>
<button type="button" aria-label={String(yr+1)} className={nav} onClick={()=>setYr(yr+1)}><ChevronRight size={18}/></button></div>
<div className="grid grid-cols-3 gap-1">{names.map((n,i)=>{const v=`${yr}-${String(i+1).padStart(2,'0')}`,sel=v===val
return <button key={v} type="button" aria-pressed={sel} onClick={()=>pick(v)}
className={`rounded-lg px-2 py-2 text-sm font-semibold transition-colors ${sel?'bg-em text-white':'hover:bg-emerald-50 hover:text-em'} ${!sel&&v===now?'text-em ring-1 ring-inset ring-em/60':''}`}>{n}</button>})}</div>
{(val!==now||(clearable&&val))&&<div className="mt-2 flex gap-2">{val!==now&&<button type="button" onClick={()=>pick(now)} className={foot}>{longM(loc,ny,nm)}</button>}
{clearable&&val&&<button type="button" aria-label={t.del} onClick={()=>pick('')} className={nav+' border border-slate-200'}><X size={16}/></button>}</div>}</div>}</div>}

// Day calendar (Monday first). value is "YYYY-MM-DD" or "". Use clearable for optional dates.
export function DatePicker({value,onChange,clearable}){const {t,loc,fd}=useApp()
const [open,setOpen,ref,right]=usePopover(288),[view,setView]=useState({y:0,m:0})
const today=iso(new Date()),base=value?new Date(value+'T00:00'):new Date()
const toggle=()=>{if(!open)setView({y:base.getFullYear(),m:base.getMonth()});setOpen(!open)}
const shift=k=>{const d=new Date(view.y,view.m+k,1);setView({y:d.getFullYear(),m:d.getMonth()})}
const prev=new Date(view.y,view.m-1,1),next=new Date(view.y,view.m+1,1)
const offset=(new Date(view.y,view.m,1).getDay()+6)%7
const cells=[...Array(42)].map((_,i)=>new Date(view.y,view.m,1-offset+i))
const wd=[...Array(7)].map((_,i)=>cap(new Date(2024,0,1+i).toLocaleDateString(loc,{weekday:'short'}).replace('.','')))
const pick=v=>{onChange(v);setOpen(false)}
return <div ref={ref} className="relative">
<button type="button" aria-haspopup="dialog" aria-expanded={open} onClick={toggle} className={triggerBlock}>
<CalendarDays size={16} className="shrink-0 text-slate-500"/><span className={value?'':'text-slate-400'}>{value?fd(value):t.date}</span><Chev open={open}/></button>
{open&&<div role="dialog" aria-label={t.date} onClick={stop} className={`${panel} ${side(right)} w-72`}>
<div className="mb-2 flex items-center justify-between"><button type="button" aria-label={longM(loc,prev.getFullYear(),prev.getMonth()+1)} className={nav} onClick={()=>shift(-1)}><ChevronLeft size={18}/></button>
<span aria-live="polite" className="text-sm font-extrabold">{longM(loc,view.y,view.m+1)}</span>
<button type="button" aria-label={longM(loc,next.getFullYear(),next.getMonth()+1)} className={nav} onClick={()=>shift(1)}><ChevronRight size={18}/></button></div>
<div className="mb-1 grid grid-cols-7 text-center text-xs font-semibold text-slate-400">{wd.map(d=><span key={d} className="py-1">{d}</span>)}</div>
<div className="grid grid-cols-7 gap-0.5">{cells.map(d=>{const v=iso(d),sel=v===value,out=d.getMonth()!==view.m
return <button key={v} type="button" aria-label={fd(v)} aria-pressed={sel} onClick={()=>pick(v)}
className={`h-9 rounded-lg text-sm font-semibold transition-colors ${sel?'bg-em text-white':out?'text-slate-300 hover:bg-slate-50':'hover:bg-emerald-50 hover:text-em'} ${!sel&&v===today?'text-em ring-1 ring-inset ring-em/60':''}`}>{d.getDate()}</button>})}</div>
{(value!==today||(clearable&&value))&&<div className="mt-2 flex gap-2">{value!==today&&<button type="button" onClick={()=>pick(today)} className={foot}>{fd(today)}</button>}
{clearable&&value&&<button type="button" aria-label={t.del} onClick={()=>pick('')} className={nav+' border border-slate-200'}><X size={16}/></button>}</div>}</div>}</div>}
