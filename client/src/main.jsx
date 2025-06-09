import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ToastContainer } from 'react-toastify'
import { Provider } from 'react-redux'
import { persistor, store } from './sotre'
import { PersistGate } from 'redux-persist/integration/react'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ToastContainer/>
      <PersistGate loading={<div>Loading...</div>} persistor={persistor}></PersistGate>
        <Provider store={store}>
        <App />
      </Provider>
  </StrictMode>,
)
