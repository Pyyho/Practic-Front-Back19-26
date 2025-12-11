import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import './Navigation.css';

function Navigation({ isLoggedIn, username, onLogout }) {
    const location = useLocation();

    // Добавляем состояние для меню
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Функция для переключения меню (открыть/закрыть)
    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    // Функция для закрытия меню
    const closeMenu = () => {
        setIsMenuOpen(false);
    };

    return (
        <nav className="main-navigation">
            <div className="nav-brand">
                <Link to="/" onClick={closeMenu}>
                    <h2>🚀 Трекер технологий</h2>
                </Link>
            </div>

            {/* Гамбургер-меню для мобильных устройств */}
            <div className="hamburger" onClick={toggleMenu}>
                <div className={`bar ${isMenuOpen ? 'active' : ''}`}></div>
                <div className={`bar ${isMenuOpen ? 'active' : ''}`}></div>
                <div className={`bar ${isMenuOpen ? 'active' : ''}`}></div>
            </div>

            <ul className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
                <li>
                    <Link
                        to="/"
                        className={location.pathname === '/' ? 'active' : ''}
                        onClick={closeMenu}
                    >
                        🏠 Главная
                    </Link>
                </li>
                <li>
                    <Link
                        to="/technologies"
                        className={location.pathname === '/technologies' ? 'active' : ''}
                        onClick={closeMenu}
                    >
                        📚 Все технологии
                    </Link>
                </li>
                <li>
                    <Link
                        to="/add-technology"
                        className={location.pathname === '/add-technology' ? 'active' : ''}
                        onClick={closeMenu}
                    >
                        ➕ Добавить технологию
                    </Link>
                </li>
                <li>
                    <Link
                        to="/statistics"
                        className={location.pathname === '/statistics' ? 'active' : ''}
                        onClick={closeMenu}
                    >
                        📊 Статистика
                    </Link>
                </li>
                <li>
                    <Link
                        to="/settings"
                        className={location.pathname === '/settings' ? 'active' : ''}
                        onClick={closeMenu}
                    >
                        ⚙️ Настройки
                    </Link>
                </li>

                {isLoggedIn ? (
                    <li className="user-info">
                        <span className="user-greeting">👤 Привет, {username}!</span>
                        <button onClick={() => { onLogout(); closeMenu(); }} className="logout-btn">
                            Выйти
                        </button>
                    </li>
                ) : (
                    <li>
                        <Link
                            to="/login"
                            className={location.pathname === '/login' ? 'active' : ''}
                            onClick={closeMenu}
                        >
                            🔐 Войти
                        </Link>
                    </li>
                )}
            </ul>

            {/* Затемнение фона при открытом меню */}
            {isMenuOpen && <div className="menu-overlay" onClick={closeMenu}></div>}
        </nav>
    );
}

export default Navigation;