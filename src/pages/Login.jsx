import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

function Login({ onLogin }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (username === 'admin' && password === 'password') {
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('username', username);
            
            onLogin(username);
            navigate('/');
        } else {
            alert('Неверное имя пользователя или пароль');
        }
    };

    return (
        <div className="login-page">
            <div className="login-container">
                <div className="login-header">
                    <h1>🔐 Вход в систему</h1>
                    <p>Войдите в свой аккаунт для доступа к полному функционалу</p>
                </div>
                
                <form onSubmit={handleSubmit} className="login-form">
                    <div className="form-group">
                        <label htmlFor="username">👤 Имя пользователя</label>
                        <input
                            id="username"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Введите имя пользователя"
                            required
                        />
                        <div className="form-hint">Используйте: admin</div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">🔒 Пароль</label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Введите пароль"
                            required
                        />
                        <div className="form-hint">Используйте: password</div>
                    </div>

                    <button type="submit" className="login-btn">
                        🚀 Войти
                    </button>
                </form>
                
                <div className="login-footer">
                    <p className="demo-info">
                        <strong>Демо доступ:</strong><br/>
                        Логин: <code>admin</code><br/>
                        Пароль: <code>password</code>
                    </p>
                    <p className="back-link">
                        <a href="/">← Вернуться на главную</a>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Login;