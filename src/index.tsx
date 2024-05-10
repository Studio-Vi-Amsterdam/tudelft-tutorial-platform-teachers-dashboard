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

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);
root.render(
    <>
        <Router>
            <Header />
            <main className="flex-auto">
                <Routes>
                    <Route path="/" Component={() => <div>Landing</div>} />
                    <Route
                        path="/dashboard"
                        element={<Navigate to={`/dashboard/my-tutorials`} />}
                    />
                    <Route
                        path="/dashboard/my-tutorials"
                        Component={() => <div>My Tutorials</div>}
                    />
                    <Route
                        path="/dashboard/media"
                        Component={() => <div>Media</div>}
                    />
                </Routes>
            </main>
            <Footer />
        </Router>
    </>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
