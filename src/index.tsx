import ReactDOM from 'react-dom/client';

import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
} from 'react-router-dom';
import './index.scss';
import reportWebVitals from './reportWebVitals';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import Dashboard from './components/Dashboard/Dashboard';
import BlogEditor from './components/BlogEditor/BlogEditor';

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);
root.render(
    <>
        <Router>
            <Header />

            <Routes>
                <Route path="/" element={<Navigate to={`/dashboard`} />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route
                    path="/dashboard/my-tutorials"
                    Component={() => <BlogEditor />}
                />
                <Route
                    path="/dashboard/media"
                    Component={() => <main className="flex-auto">Media</main>}
                />
            </Routes>
            <Footer />
        </Router>
    </>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
