import {NavLink,Route,Routes,Navigate} from 'react-router-dom'
import {LayoutDashboard,ArrowLeftRight,PieChart,Target,Calculator,Settings as Cog,Globe} from 'lucide-react'
import {useApp} from './store'
import {Dropdown} from './ui'
import {Dashboard,Transactions,Budget,Goals,Calc,Settings} from './pages'
const nav=[['/','dash',LayoutDashboard],['/transactions','tx',ArrowLeftRight],['/budget','budget',PieChart],['/goals','goals',Target],['/calculators','calc',Calculator],['/settings','settings',Cog]]
export default function App(){const {s,set,t}=useApp()
const link=(mob)=>({isActive})=>`flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-semibold transition-colors ${mob?'flex-col gap-0.5 text-[10px] px-1 flex-1':''} ${isActive?'bg-emerald-50 text-em':'text-slate-500 hover:text-ink'}`
return <div className="min-h-screen md:pl-60">
<aside className="fixed inset-y-0 left-0 hidden w-60 border-r border-slate-200 bg-white p-4 md:block">
<div className="mb-8 px-3 pt-2 text-2xl font-extrabold tracking-tight">Pulora<span className="text-em">.</span></div>
<nav className="space-y-1">{nav.map(([to,k,I])=><NavLink key={to} to={to} end={to==='/'} className={link()}><I size={18}/>{t[k]}</NavLink>)}</nav></aside>
<header className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-paper/90 px-4 py-3 backdrop-blur md:px-8">
<span className="text-lg font-extrabold md:hidden">Pulora<span className="text-em">.</span></span><span className="hidden md:block"/>
<Dropdown ariaLabel={t.language} icon={Globe} value={s.lang} onChange={v=>set({lang:v})} options={[['uz','O‘zbekcha'],['ru','Русский'],['en','English']]}/></header>
<main className="mx-auto max-w-5xl p-4 pb-24 md:p-8"><Routes>
<Route path="/" element={<Dashboard/>}/><Route path="/transactions" element={<Transactions/>}/><Route path="/budget" element={<Budget/>}/>
<Route path="/goals" element={<Goals/>}/><Route path="/calculators" element={<Calc/>}/><Route path="/settings" element={<Settings/>}/><Route path="*" element={<Navigate to="/"/>}/></Routes></main>
<nav className="fixed inset-x-0 bottom-0 z-10 flex border-t border-slate-200 bg-white p-1 md:hidden">{nav.map(([to,k,I])=><NavLink key={to} to={to} end={to==='/'} className={link(true)}><I size={20}/><span className="truncate">{t[k]}</span></NavLink>)}</nav></div>}
