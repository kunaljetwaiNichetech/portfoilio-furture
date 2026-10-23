import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { blockText } from './lib/blockFont'

console.log(`%c${blockText('KUNAL.EXE', '█', ' ').main}`, 'color:#FF1E1E;font-family:monospace;line-height:1.05')
console.log(
  '%c Hey developer — inspecting the source? Let\'s talk: kunaljetwani@gmail.com  //  Try ↑↑↓↓←→←→BA or press R ',
  'background:#000;color:#fff;border:1px solid #FF1E1E;padding:6px 10px;font-family:monospace',
)

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
