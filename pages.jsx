import {useEffect,useState} from 'react'
import {BarChart,Bar,XAxis,YAxis,Tooltip,Legend,ResponsiveContainer,CartesianGrid,PieChart,Pie,Cell} from 'recharts'
import {Pencil,Trash2,Plus,PiggyBank,Lightbulb,Download,Upload} from 'lucide-react'
import {useApp,iso,shiftMonth,sanitize} from './store'
import {CATS} from './i18n'
import {MonthPicker,DatePicker} from './ui'
const inp='w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm'
const btn='rounded-lg bg-em px-4 py-2 text-sm font-bold text-white hover:bg-emerald-700'
const ghost='rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold hover:bg-slate-50'
const danger='rounded-lg bg-red-600 px-4 py-2 text-sm font-bold text-white hover:bg-red-700'
// Income-only categories are not offered for expenses and vice versa
const INCOME_ONLY=['salary','freelance'],INC=[...INCOME_ONLY,'other'],EXP=CATS.filter(c=>!INCOME_ONLY.includes(c))
const COLORS=['#059669','#0f1b33','#f59e0b','#3b82f6','#ef4444','#8b5cf6']
const Card=({title,children,className=''})=><section className={`rounded-2xl border border-slate-200 bg-white p-5 shadow-sm ${className}`}>{title&&<h2 className="mb-4 font-bold">{title}</h2>}{children}</section>
const Field=({label,error,children})=><label className="block text-sm font-semibold">{label}<div className="mt-1">{children}</div>{error&&<p role="alert" className="mt-1 text-xs font-medium text-red-600">{error}</p>}</label>
// goal=true: a full bar is a success (green), not "over limit" (red)
const Bar2=({pct,goal})=><div className="h-2 overflow-hidden rounded-full bg-slate-100"><div className={`h-full rounded-full transition-all ${goal?'bg-em':pct>=100?'bg-red-500':pct>=80?'bg-amber-500':'bg-em'}`} style={{width:`${Math.min(100,pct)}%`}}/></div>
const sum=(a,ty)=>a.filter(x=>x.type===ty).reduce((p,x)=>p+x.amount,0)
const Empty=({t})=><p className="py-6 text-center text-sm text-slate-500">{t.empty}</p>
const Title=({children,picker})=><div className="mb-5 flex flex-wrap items-center justify-between gap-3"><h1 className="text-2xl font-extrabold tracking-tight">{children}</h1>{picker&&<MonthPicker/>}</div>
function Row({x}){const {t,fd}=useApp();return <div className="flex-1"><p className="text-sm font-semibold">{t.cats[x.category]}{x.description&&<span className="font-normal text-slate-500"> — {x.description}</span>}</p><p className="text-xs text-slate-500">{fd(x.date)}</p></div>}
const Amt=({x})=>{const {fmt}=useApp();return <span className={`text-sm font-bold ${x.type==='income'?'text-em':'text-ink'}`}>{x.type==='income'?'+':'−'}{fmt(x.amount)}</span>}

// ---- Modals (replace native confirm()/prompt()) ----
function Modal({children,onClose}){useEffect(()=>{const k=e=>e.key==='Escape'&&onClose();window.addEventListener('keydown',k);return()=>window.removeEventListener('keydown',k)},[onClose])
return <div className="fixed inset-0 z-30 flex items-center justify-center bg-ink/40 p-4" onMouseDown={e=>e.target===e.currentTarget&&onClose()}><div role="dialog" aria-modal="true" className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-xl">{children}</div></div>}
function useConfirm(){const {t}=useApp(),[c,setC]=useState(null),close=()=>setC(null)
return [(text,label,run)=>setC({text,label,run}),c&&<Modal onClose={close}><p className="mb-4 text-sm font-semibold">{c.text}</p><div className="flex justify-end gap-2"><button autoFocus className={ghost} onClick={close}>{t.cancel}</button><button className={danger} onClick={()=>{c.run();close()}}>{c.label}</button></div></Modal>]}
function AddMoney({g,onClose}){const {set,t}=useApp(),[v,setV]=useState(''),[e,setE]=useState('')
const go=ev=>{ev.preventDefault();const n=parseFloat(v);if(!(n>0))return setE(t.errAmount)
set(o=>({goals:o.goals.map(x=>x.id===g.id?{...x,saved:x.saved+n}:x)}));onClose()}
return <Modal onClose={onClose}><form onSubmit={go} noValidate><h2 className="mb-3 font-bold">{t.addMoney} · {g.name}</h2>
<Field label={t.amount} error={e}><input autoFocus type="number" min="0" step="any" className={inp} value={v} onChange={x=>setV(x.target.value)}/></Field>
<div className="mt-4 flex justify-end gap-2"><button type="button" className={ghost} onClick={onClose}>{t.cancel}</button><button className={btn}>{t.save}</button></div></form></Modal>}

export function Dashboard(){const {s,t,fmt,loc,month}=useApp()
const cur=s.tx.filter(x=>x.date.startsWith(month)),prev=s.tx.filter(x=>x.date.startsWith(shiftMonth(month,-1)))
const inc=sum(cur,'income'),exp=sum(cur,'expense'),bal=inc-exp,rate=inc?Math.round(bal/inc*100):0
const pct=(a,b)=>b?Math.round((a-b)/b*100):null
const data=[...Array(6)].map((_,i)=>{const m=shiftMonth(month,i-5),a=s.tx.filter(x=>x.date.startsWith(m))
return{m:new Date(m+'-01T00:00').toLocaleDateString(loc,{month:'short'}),[t.income]:sum(a,'income'),[t.expense]:sum(a,'expense')}})
const pie=CATS.map(c=>({name:t.cats[c],value:cur.filter(x=>x.type==='expense'&&x.category===c).reduce((p,x)=>p+x.amount,0)})).filter(d=>d.value>0)
const recent=[...cur].sort((a,b)=>b.date.localeCompare(a.date)).slice(0,5)
// [label, value, change vs previous month, is "up" good?]
const stats=[[t.income,fmt(inc),pct(inc,sum(prev,'income')),true],[t.expense,fmt(exp),pct(exp,sum(prev,'expense')),false],[t.balance,fmt(bal)],[t.rate,rate+'%']]
return <><Title picker>{t.dash}</Title>
<div className="grid grid-cols-2 gap-3 md:grid-cols-4">{stats.map(([l,v,d,good])=><Card key={l}><p className="text-xs font-semibold text-slate-500">{l}</p><p className="mt-1 text-lg font-extrabold md:text-xl">{v}</p>
<p className={`h-4 text-xs font-bold ${(d>0)===good?'text-em':'text-red-600'}`}>{d?`${d>0?'▲':'▼'} ${Math.abs(d)}%`:''}</p></Card>)}</div>
<div className="mt-4 grid gap-4 md:grid-cols-5"><Card title={t.chart} className="md:col-span-3"><div className="h-60"><ResponsiveContainer><BarChart data={data}><CartesianGrid vertical={false} stroke="#e2e8f0"/><XAxis dataKey="m" tickLine={false}/><YAxis width={40} tickFormatter={v=>v===0?'0':v>=1e6?v/1e6+'M':v/1e3+'k'} tickLine={false} axisLine={false}/><Tooltip formatter={v=>fmt(v)}/><Bar dataKey={t.income} fill="#059669" radius={[4,4,0,0]}/><Bar dataKey={t.expense} fill="#0f1b33" radius={[4,4,0,0]}/></BarChart></ResponsiveContainer></div></Card>
<Card title={`${t.expense} · ${t.category}`} className="md:col-span-2">{pie.length?<div className="h-60"><ResponsiveContainer><PieChart><Pie data={pie} dataKey="value" nameKey="name" innerRadius={45} outerRadius={80} paddingAngle={2}>{pie.map((_,i)=><Cell key={i} fill={COLORS[i%COLORS.length]}/>)}</Pie><Tooltip formatter={v=>fmt(v)}/><Legend iconType="circle" wrapperStyle={{fontSize:12}}/></PieChart></ResponsiveContainer></div>:<Empty t={t}/>}</Card></div>
<div className="mt-4 grid gap-4 md:grid-cols-5"><Card title={t.recent} className="md:col-span-3">{recent.length?recent.map(x=><div key={x.id} className="flex items-center border-b border-slate-100 py-2 last:border-0"><Row x={x}/><Amt x={x}/></div>):<Empty t={t}/>}</Card>
<div className="space-y-4 md:col-span-2"><Card title={t.goals}>{s.goals.length?s.goals.slice(0,3).map(g=>{const p=Math.round(g.saved/g.target*100);return <div key={g.id} className="mb-3 last:mb-0"><div className="mb-1 flex justify-between text-sm"><b>{g.name}</b><span>{p}%</span></div><Bar2 pct={p} goal/></div>}):<Empty t={t}/>}</Card>
<Card title={t.tip}><div className="flex gap-3"><Lightbulb className="shrink-0 text-em"/><p className="text-sm leading-relaxed">{t.tips[new Date().getDate()%t.tips.length]}</p></div></Card></div></div></>}

export function Transactions(){const {s,set,t,fmt}=useApp()
const blank={type:'expense',amount:'',date:iso(new Date()),category:'food',description:''}
const [f,setF]=useState(blank),[eid,setEid]=useState(null),[err,setErr]=useState({}),[ask,confirmNode]=useConfirm()
const [q,setQ]=useState(''),[ft,setFt]=useState(''),[fc,setFc]=useState(''),[fm,setFm]=useState('')
const allowed=f.type==='income'?INC:EXP
const onType=e=>{const ty=e.target.value,ok=ty==='income'?INC:EXP;setF({...f,type:ty,category:ok.includes(f.category)?f.category:ok[0]})}
const submit=e=>{e.preventDefault();const er={},amount=parseFloat(f.amount)
if(!(amount>0))er.amount=t.errAmount;if(!f.date)er.date=t.errDate;setErr(er);if(Object.keys(er).length)return
const x={...f,amount,category:allowed.includes(f.category)?f.category:allowed[0],description:f.description.trim()}
set(o=>({tx:eid?o.tx.map(y=>y.id===eid?{...x,id:eid}:y):[...o.tx,{...x,id:Date.now()}]}));setF(blank);setEid(null)}
const list=s.tx.filter(x=>(!ft||x.type===ft)&&(!fc||x.category===fc)&&(!fm||x.date.startsWith(fm))&&(!q||(x.description+t.cats[x.category]).toLowerCase().includes(q.toLowerCase()))).sort((a,b)=>b.date.localeCompare(a.date))
const up=k=>e=>setF({...f,[k]:e.target.value})
return <><Title>{t.tx}</Title>
<Card><form onSubmit={submit} noValidate className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
<Field label={t.type}><select className={inp} value={f.type} onChange={onType}><option value="expense">{t.expense}</option><option value="income">{t.income}</option></select></Field>
<Field label={t.amount} error={err.amount}><input className={inp} type="number" min="0" step="any" value={f.amount} onChange={up('amount')}/></Field>
<Field label={t.date} error={err.date}><DatePicker value={f.date} onChange={v=>setF({...f,date:v})}/></Field>
<Field label={t.category}><select className={inp} value={allowed.includes(f.category)?f.category:allowed[0]} onChange={up('category')}>{allowed.map(c=><option key={c} value={c}>{t.cats[c]}</option>)}</select></Field>
<Field label={t.description}><input className={inp} value={f.description} onChange={up('description')}/></Field>
<div className="flex items-end gap-2"><button className={btn}>{eid?t.save:t.add}</button>{eid&&<button type="button" className={ghost} onClick={()=>{setEid(null);setF(blank);setErr({})}}>{t.cancel}</button>}</div></form></Card>
<Card className="mt-4"><div className="mb-4 grid gap-2 sm:grid-cols-4"><input aria-label={t.search} placeholder={t.search} className={inp} value={q} onChange={e=>setQ(e.target.value)}/>
<select aria-label={t.type} className={inp} value={ft} onChange={e=>setFt(e.target.value)}><option value="">{t.type}: {t.all}</option><option value="income">{t.income}</option><option value="expense">{t.expense}</option></select>
<select aria-label={t.category} className={inp} value={fc} onChange={e=>setFc(e.target.value)}><option value="">{t.category}: {t.all}</option>{CATS.map(c=><option key={c} value={c}>{t.cats[c]}</option>)}</select>
<MonthPicker block clearable value={fm} onChange={setFm}/></div>
<p className="mb-2 flex gap-4 text-sm font-bold"><span className="text-em">{t.income}: {fmt(sum(list,'income'))}</span><span>{t.expense}: {fmt(sum(list,'expense'))}</span></p>
{list.length?list.map(x=><div key={x.id} className="flex items-center gap-2 border-b border-slate-100 py-2 last:border-0"><Row x={x}/><Amt x={x}/>
<button aria-label={t.edit} className="p-1.5 text-slate-500 hover:text-em" onClick={()=>{setEid(x.id);setF({...x,amount:String(x.amount)});window.scrollTo({top:0,behavior:'smooth'})}}><Pencil size={16}/></button>
<button aria-label={t.del} className="p-1.5 text-slate-500 hover:text-red-600" onClick={()=>ask(t.confirmDel,t.del,()=>set(o=>({tx:o.tx.filter(y=>y.id!==x.id)})))}><Trash2 size={16}/></button></div>):<Empty t={t}/>}</Card>{confirmNode}</>}

export function Budget(){const {s,set,t,fmt,month}=useApp()
const cur=s.tx.filter(x=>x.date.startsWith(month)&&x.type==='expense')
const spent=c=>cur.filter(x=>x.category===c).reduce((p,x)=>p+x.amount,0)
const setCat=(c,v)=>set(o=>({budget:{...o.budget,cats:{...o.budget.cats,[c]:Math.max(0,parseFloat(v)||0)}}}))
// No limit but money spent = already "over" (before: it silently showed 0%)
const Line=({label,limit,used})=>{const p=limit?Math.round(used/limit*100):used>0?100:0
return <div className="mb-4"><div className="mb-1 flex justify-between text-sm"><b>{label}</b><span>{fmt(used)} / {fmt(limit)} · {p}%</span></div><Bar2 pct={p}/>
<p className={`mt-1 text-xs font-semibold ${p>=100?'text-red-600':p>=80?'text-amber-600':'text-slate-500'}`}>{p>=100?`${t.over}: ${fmt(used-limit)}`:`${p>=80?t.near+' · ':''}${t.left}: ${fmt(limit-used)}`}</p></div>}
return <><Title picker>{t.budget}</Title>
<Card><Field label={t.totalBudget}><input type="number" min="0" className={inp+' max-w-xs'} value={s.budget.total} onChange={e=>set(o=>({budget:{...o.budget,total:Math.max(0,parseFloat(e.target.value)||0)}}))}/></Field>
<div className="mt-4"><Line label={t.totalBudget} limit={s.budget.total} used={cur.reduce((p,x)=>p+x.amount,0)}/></div></Card>
<Card className="mt-4">{EXP.map(c=><div key={c} className="mb-2 grid items-center gap-2 border-b border-slate-100 pb-3 sm:grid-cols-[1fr_9rem] last:border-0">
<Line label={t.cats[c]} limit={s.budget.cats[c]||0} used={spent(c)}/><input aria-label={`${t.limit}: ${t.cats[c]}`} type="number" min="0" className={inp} value={s.budget.cats[c]||''} placeholder={t.limit} onChange={e=>setCat(c,e.target.value)}/></div>)}</Card></>}

// Whole months from now until the goal date (null if no date, reached, or date already passed)
const monthsLeft=g=>{if(!g.date||g.saved>=g.target)return null;const n=new Date(),d=new Date(g.date+'T00:00'),k=(d.getFullYear()-n.getFullYear())*12+d.getMonth()-n.getMonth();return k>=1?k:null}

export function Goals(){const {s,set,t,fmt,fd}=useApp()
const blank={name:'',target:'',saved:'0',date:''}
const [f,setF]=useState(blank),[eid,setEid]=useState(null),[err,setErr]=useState({}),[am,setAm]=useState(null),[ask,confirmNode]=useConfirm()
const submit=e=>{e.preventDefault();const er={},target=parseFloat(f.target),saved=parseFloat(f.saved)||0
if(!f.name.trim())er.name=t.errName;if(!(target>0))er.target=t.errTarget;setErr(er);if(Object.keys(er).length)return
const g={name:f.name.trim(),target,saved:Math.max(0,saved),date:f.date}
set(o=>({goals:eid?o.goals.map(x=>x.id===eid?{...g,id:eid}:x):[...o.goals,{...g,id:Date.now()}]}));setF(blank);setEid(null)}
const up=k=>e=>setF({...f,[k]:e.target.value})
return <><Title>{t.goals}</Title>
<Card title={eid?t.edit:t.newGoal}><form onSubmit={submit} noValidate className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
<Field label={t.name} error={err.name}><input className={inp} value={f.name} onChange={up('name')}/></Field>
<Field label={t.target} error={err.target}><input type="number" min="0" className={inp} value={f.target} onChange={up('target')}/></Field>
<Field label={t.saved}><input type="number" min="0" className={inp} value={f.saved} onChange={up('saved')}/></Field>
<Field label={t.targetDate}><DatePicker clearable value={f.date} onChange={v=>setF({...f,date:v})}/></Field>
<div className="flex gap-2"><button className={btn}>{eid?t.save:t.add}</button>{eid&&<button type="button" className={ghost} onClick={()=>{setEid(null);setF(blank)}}>{t.cancel}</button>}</div></form></Card>
<div className="mt-4 grid gap-4 md:grid-cols-2">{s.goals.length?s.goals.map(g=>{const p=Math.round(g.saved/g.target*100),ml=monthsLeft(g);return <Card key={g.id}>
<div className="mb-2 flex items-start justify-between"><div><p className="font-bold">{g.name}</p>{g.date&&<p className="text-xs text-slate-500">{fd(g.date)}</p>}</div><span className="text-lg font-extrabold text-em">{p}%</span></div>
<Bar2 pct={p} goal/><p className="mt-2 text-sm">{fmt(g.saved)} / {fmt(g.target)}</p><p className="text-xs text-slate-500">{g.saved>=g.target?t.reached:`${t.left}: ${fmt(g.target-g.saved)}`}</p>
{ml&&<p className="text-xs font-semibold text-em">{t.monthly}: {fmt(Math.ceil((g.target-g.saved)/ml))}</p>}
<div className="mt-3 flex gap-2"><button className={btn+' flex items-center gap-1'} onClick={()=>setAm(g)}><Plus size={14}/>{t.addMoney}</button>
<button aria-label={t.edit} className={ghost} onClick={()=>{setEid(g.id);setF({name:g.name,target:String(g.target),saved:String(g.saved),date:g.date})}}><Pencil size={14}/></button>
<button aria-label={t.del} className={ghost} onClick={()=>ask(t.confirmDel,t.del,()=>set(o=>({goals:o.goals.filter(x=>x.id!==g.id)})))}><Trash2 size={14}/></button></div></Card>}):<Card className="md:col-span-2"><div className="py-6 text-center text-sm text-slate-500"><PiggyBank className="mx-auto mb-2 text-em"/>{t.noGoals}</div></Card>}</div>
{am&&<AddMoney g={am} onClose={()=>setAm(null)}/>}{confirmNode}</>}

export function Calc(){const {t,fmt}=useApp()
const [a,setA]=useState({cur:'0',tar:'10000000',mon:'500000'}),[c,setC]=useState({p:'1000000',m:'200000',r:'10',y:'5'})
const n=v=>Math.max(0,parseFloat(v)||0),need=Math.max(0,n(a.tar)-n(a.cur)),mons=n(a.mon)>0?Math.ceil(need/n(a.mon)):null
let b=n(c.p);const r=n(c.r)/1200,N=Math.round(n(c.y)*12);for(let i=0;i<N;i++)b=b*(1+r)+n(c.m)
const contrib=n(c.p)+n(c.m)*N
const F=(o,set,k,l)=><Field label={l}><input type="number" min="0" className={inp} value={o[k]} onChange={e=>set({...o,[k]:e.target.value})}/></Field>
return <><Title>{t.calc}</Title><div className="grid gap-4 md:grid-cols-2">
<Card title={t.savCalc}><div className="space-y-3">{F(a,setA,'cur',t.currentSavings)}{F(a,setA,'tar',t.target)}{F(a,setA,'mon',t.monthly)}</div>
<div className="mt-4 rounded-xl bg-emerald-50 p-4 text-sm"><p>{t.needMore}: <b>{fmt(need)}</b></p><p className="mt-1 font-bold text-em">{need===0?t.reached:mons===null?t.enterMonthly:`≈ ${mons} ${t.months}`}</p></div></Card>
<Card title={t.compound}><div className="space-y-3">{F(c,setC,'p',t.principal)}{F(c,setC,'m',t.monthly)}{F(c,setC,'r',t.annual)}{F(c,setC,'y',t.years)}</div>
<div className="mt-4 rounded-xl bg-emerald-50 p-4 text-sm"><p>{t.finalBal}: <b>{fmt(b)}</b></p><p>{t.contrib}: {fmt(contrib)}</p><p>{t.interest}: {fmt(b-contrib)}</p></div><p className="mt-3 text-xs text-slate-500">{t.assume}</p></Card></div></>}

export function Settings(){const {s,set,t,reset,replaceAll}=useApp(),[bad,setBad]=useState(false),[ask,confirmNode]=useConfirm()
const dl=(text,type,name)=>{const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([text],{type}));a.download=name;a.click();URL.revokeObjectURL(a.href)}
const csv=()=>{const rows=[['date','type','category','amount','description'],...s.tx.map(x=>[x.date,x.type,x.category,x.amount,x.description])]
dl('\ufeff'+rows.map(r=>r.map(v=>`"${String(v).replace(/"/g,'""')}"`).join(',')).join('\n'),'text/csv','pulora-transactions.csv')}
const backup=()=>dl(JSON.stringify(s,null,2),'application/json','pulora-backup.json')
const restore=e=>{const file=e.target.files[0];e.target.value='';if(!file)return
file.text().then(x=>{const d=sanitize(JSON.parse(x));if(d){replaceAll(d);setBad(false)}else setBad(true)}).catch(()=>setBad(true))}
const row=ghost+' inline-flex items-center gap-2'
return <><Title>{t.settings}</Title><Card><div className="space-y-6">
<div><p className="mb-2 text-sm font-bold">{t.language}</p><div className="flex gap-2">{[['uz','O‘zbekcha'],['ru','Русский'],['en','English']].map(([k,l])=><button key={k} aria-pressed={s.lang===k} onClick={()=>set({lang:k})} className={s.lang===k?btn:ghost}>{l}</button>)}</div></div>
<div><div className="flex flex-wrap gap-2"><button className={row} onClick={csv}><Download size={16}/>{t.exportCsv}</button>
<button className={row} onClick={backup}><Download size={16}/>JSON</button>
<label className={row+' cursor-pointer focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-em'}><Upload size={16}/>JSON<input type="file" accept="application/json,.json" className="sr-only" onChange={restore}/></label></div>
{bad&&<p role="alert" className="mt-2 text-xs font-medium text-red-600">⚠ JSON</p>}</div>
<div><button className="rounded-lg border border-red-300 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-50" onClick={()=>ask(t.resetConfirm,t.reset,reset)}>{t.reset}</button></div></div></Card>{confirmNode}</>}
