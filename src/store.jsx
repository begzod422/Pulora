import {createContext,useCallback,useContext,useEffect,useMemo,useState} from 'react'
import {L,CATS} from './i18n'
const Ctx=createContext(),KEY='pulora.v1',pad=n=>String(n).padStart(2,'0'),LOC={uz:'uz-UZ',ru:'ru-RU',en:'en-US'},DATE=/^\d{4}-\d{2}-\d{2}$/
export const iso=d=>`${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`
export const ym=d=>iso(d).slice(0,7)
export const shiftMonth=(m,k)=>{const [y,mo]=m.split('-').map(Number);return ym(new Date(y,mo-1+k,1))}
const num=v=>Number.isFinite(+v)?+v:0

// Validates any data (LocalStorage or imported JSON). Returns a clean state or null if it is not an object.
export function sanitize(r){if(!r||typeof r!=='object'||Array.isArray(r))return null
const tx=(Array.isArray(r.tx)?r.tx:[]).filter(x=>x&&(x.type==='income'||x.type==='expense')&&num(x.amount)>0&&DATE.test(x.date))
.map((x,i)=>({id:x.id??Date.now()+i,type:x.type,amount:num(x.amount),date:x.date,category:CATS.includes(x.category)?x.category:'other',description:String(x.description??'')}))
const goals=(Array.isArray(r.goals)?r.goals:[]).filter(x=>x&&typeof x.name==='string'&&num(x.target)>0)
.map((x,i)=>({id:x.id??Date.now()+1000+i,name:x.name,target:num(x.target),saved:Math.max(0,num(x.saved)),date:DATE.test(x.date)?x.date:''}))
const b=r.budget&&typeof r.budget==='object'?r.budget:{},cats={}
CATS.forEach(c=>{const v=num(b.cats?.[c]);if(v>0)cats[c]=v})
return{lang:['uz','ru','en'].includes(r.lang)?r.lang:'uz',tx,goals,budget:{total:Math.max(0,num(b.total)),cats}}}

// Demo data for the last 6 months so the chart is not empty
const demo=()=>{const cm=ym(new Date()),tx=[];let id=1
for(let k=5;k>=0;k--){const m=shiftMonth(cm,-k),add=(type,amount,d,category,description)=>tx.push({id:id++,type,amount,date:`${m}-${d}`,category,description})
add('income',5000000,'01','salary','Salary');add('expense',1200000+(k%3)*150000,'03','food','Groceries')
add('expense',300000,'05','transport','Metro card');add('expense',1500000,'07','housing','Rent')}
return{lang:'uz',tx,budget:{total:4000000,cats:{food:1500000,transport:600000,entertainment:400000}},
goals:[{id:1,name:'Laptop',target:8000000,saved:2000000,date:`${new Date().getFullYear()+1}-06-01`}]}}

const load=()=>{try{return sanitize(JSON.parse(localStorage.getItem(KEY)))||demo()}catch{return demo()}}

export function Provider({children}){
const [s,setS]=useState(load),[month,setMonth]=useState(()=>ym(new Date()))
useEffect(()=>{try{localStorage.setItem(KEY,JSON.stringify(s))}catch{}},[s])
useEffect(()=>{document.documentElement.lang=s.lang},[s.lang])
const set=useCallback(p=>setS(o=>({...o,...(typeof p==='function'?p(o):p)})),[])
const value=useMemo(()=>{const loc=LOC[s.lang]
return{s,set,month,setMonth,loc,t:L[s.lang],
fmt:n=>new Intl.NumberFormat(loc,{style:'currency',currency:'UZS',maximumFractionDigits:0}).format(n||0),
fd:d=>new Date(d+'T00:00').toLocaleDateString(loc,{day:'numeric',month:'short',year:'numeric'}),
reset:()=>setS(o=>({...demo(),lang:o.lang})),
replaceAll:d=>setS(o=>({...d,lang:o.lang}))}},[s,month,set])
return <Ctx.Provider value={value}>{children}</Ctx.Provider>}
export const useApp=()=>useContext(Ctx)
