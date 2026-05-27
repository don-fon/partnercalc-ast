import * as React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ROUTER_BASENAME } from 'util/publicPath'
import { App } from './App'

const container = document.getElementById('output')
const root = createRoot(container)
root.render(<BrowserRouter basename={ROUTER_BASENAME}><App /></BrowserRouter>)
