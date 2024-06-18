import ReactDOM from 'react-dom/client'

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import './index.scss'
import reportWebVitals from './reportWebVitals'
import Header from './components/static/Header'
import Footer from './components/static/Footer'
import Dashboard from './components/Dashboard/Dashboard'
import BlogEditor from './components/TutorialEditor/TutorialEditor'
import { Provider } from 'react-redux'
import { store } from './redux/store'
import { AuthProvider } from './lib/AuthContext'
import { Toaster } from './lib/toaster'

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(
  <Provider store={store}>
    <Router>
      <Header />
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Navigate to={'/dashboard'} />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/my-tutorials" Component={() => <BlogEditor />} />
          <Route
            path="/dashboard/media"
            Component={() => <main className="flex-auto">Media</main>}
          />
          <Route path="/login" element={<>Please log in</>} />
        </Routes>
      </AuthProvider>
      <Footer />
    </Router>
    <Toaster />
  </Provider>,
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
