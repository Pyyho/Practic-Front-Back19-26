import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './App.css';

import useTechnologiesApi from './hooks/useTechnologiesApi';

// Контекст настроек
import { SettingsProvider } from './context/SettingsContext';

// Компоненты
import Navigation from './components/Navigation';
import ProtectedRoute from './components/ProtectedRoute';

// Страницы
import Home from './pages/Home';
import TechnologyList from './pages/TechnologyList';
import TechnologyDetail from './pages/TechnologyDetail';
import AddTechnology from './pages/AddTechnology';
import Statistics from './pages/Statistics';
import Settings from './pages/Settings';
import Login from './pages/Login';

function App() {
    const { technologies, loading, error, refetch } = useTechnologiesApi();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username, setUsername] = useState('');

    useEffect(() => {
        const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
        const user = localStorage.getItem('username') || '';
        setIsLoggedIn(loggedIn);
        setUsername(user);
    }, []);

    const handleLogin = (user) => {
        setIsLoggedIn(true);
        setUsername(user);
    };

    const handleLogout = () => {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('username');
        setIsLoggedIn(false);
        setUsername('');
    };

    return (
        <SettingsProvider>
            <Router>
                <div className="App">
                    <Navigation
                        isLoggedIn={isLoggedIn}
                        username={username}
                        onLogout={handleLogout}
                    />

                    <main className="main-content">
                        <Routes>
                            <Route path="/" element={<Home />} />

                            <Route
                                path="/technologies"
                                element={
                                    <ProtectedRoute isLoggedIn={isLoggedIn}>
                                        <TechnologyList
                                            technologies={technologies}
                                            loading={loading}
                                            error={error}
                                            refetch={refetch}
                                        />
                                    </ProtectedRoute>
                                }
                            />

                            <Route
                                path="/login"
                                element={<Login onLogin={handleLogin} />}
                            />

                            <Route
                                path="/technologies"
                                element={
                                    <ProtectedRoute isLoggedIn={isLoggedIn}>
                                        <TechnologyList />
                                    </ProtectedRoute>
                                }
                            />

                            <Route
                                path="/technology/:techId"
                                element={
                                    <ProtectedRoute isLoggedIn={isLoggedIn}>
                                        <TechnologyDetail />
                                    </ProtectedRoute>
                                }
                            />

                            <Route
                                path="/add-technology"
                                element={
                                    <ProtectedRoute isLoggedIn={isLoggedIn}>
                                        <AddTechnology />
                                    </ProtectedRoute>
                                }
                            />

                            <Route
                                path="/statistics"
                                element={
                                    <ProtectedRoute isLoggedIn={isLoggedIn}>
                                        <Statistics />
                                    </ProtectedRoute>
                                }
                            />

                            <Route
                                path="/settings"
                                element={
                                    <ProtectedRoute isLoggedIn={isLoggedIn}>
                                        <Settings />
                                    </ProtectedRoute>
                                }
                            />

                            <Route path="*" element={<Home />} />
                        </Routes>
                    </main>
                </div>
            </Router>
        </SettingsProvider>
    );
}

export default App;
