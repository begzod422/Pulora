import {useEffect,useState} from 'react'
// Intro screen shown once when the site opens. Same green "P" icon as the favicon, but with a pulse (heartbeat) line.
// Change DURATION to make it shorter or longer (milliseconds).
const DURATION=4000,FADE=450
export default function Splash(){const [phase,setPhase]=useState('show')
useEffect(()=>{const a=setTimeout(()=>setPhase('out'),DURATION),b=setTimeout(()=>setPhase('done'),DURATION+FADE)
return()=>{clearTimeout(a);clearTimeout(b)}},[])
if(phase==='done')return null
return <div role="status" aria-busy="true" aria-label="Pulora" style={{transitionDuration:FADE+'ms'}}
className={`fixed inset-0 z-50 grid place-items-center bg-paper transition-opacity ${phase==='out'?'pointer-events-none opacity-0':'opacity-100'}`}>
<div className="flex flex-col items-center">
<div className="relative grid h-24 w-24 place-items-center">
<span className="pl-anim pl-ring absolute inset-0 rounded-3xl bg-em"/>
<span className="pl-anim pl-ring absolute inset-0 rounded-3xl bg-em" style={{animationDelay:'0.8s'}}/>
<div className="pl-anim pl-in relative grid h-24 w-24 place-items-center rounded-3xl bg-em shadow-lg shadow-emerald-900/20">
<svg viewBox="0 0 48 48" className="h-14 w-14" fill="none" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
<path className="pl-anim pl-draw" pathLength="100" strokeDasharray="100" d="M5 27h9l4-13 8 24 5-17 3 6h9"/></svg></div></div>
<p className="pl-anim pl-in mt-6 text-3xl font-extrabold tracking-tight" style={{animationDelay:'0.2s',animationFillMode:'backwards'}}>Pulora<span className="text-em">.</span></p>
<div className="mt-6 h-1.5 w-44 overflow-hidden rounded-full bg-slate-200"><div className="pl-anim pl-fill h-full origin-left rounded-full bg-em" style={{animationDuration:DURATION+'ms'}}/></div>
</div></div>}
