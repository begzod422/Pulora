import React,{Component} from 'react'
import {createRoot} from 'react-dom/client'
import {HashRouter} from 'react-router-dom'
import {Provider} from './store'
import App from './App'
import Splash from './Splash'
import './index.css'
// Language-neutral fallback (no i18n available if the crash is in the store itself)
class Boundary extends Component{
state={failed:false}
static getDerivedStateFromError(){return{failed:true}}
render(){return this.state.failed
?<div className="grid min-h-screen place-items-center p-6 text-center"><div><p className="text-2xl font-extrabold">Pulora<span className="text-em">.</span></p><p className="mt-2 text-slate-500">⚠</p>
<button className="mt-4 rounded-lg bg-em px-4 py-2 text-sm font-bold text-white" onClick={()=>location.reload()}>↻</button></div></div>
:this.props.children}}
createRoot(document.getElementById('root')).render(<Boundary><HashRouter><Provider><App/></Provider></HashRouter><Splash/></Boundary>)
