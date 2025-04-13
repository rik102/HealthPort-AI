import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import {GoogleOAuthProvider} from '@react-oauth/google'

// just putting this for now, might have to put in the .env"
const CLIENT_ID = "274784093767-r7hi5ctsc2scv6q67orvi46l88ov1na2.apps.googleusercontent.com"

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={CLIENT_ID}>
    <App />
    </GoogleOAuthProvider>
  </React.StrictMode>,
) 