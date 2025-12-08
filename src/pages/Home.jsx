import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useSettings } from "../context/SettingsContext";
import ProgressBar from '../components/ProgressBar';
import './Home.css';

function Home() {
    const { settings } = useSettings();
    const [technologies, setTechnologies] = useState([]);
    const [stats, setStats] = useState({
        total: 0,
        completed: 0,
        inProgress: 0,
        notStarted: 0,
        progress: 0,
        categoryStats: {}
    });
    const [recentActivity, setRecentActivity] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = () => {
        setLoading(true);
        const saved = localStorage.getItem('technologies');
        if (saved) {
            const techData = JSON.parse(saved);
            setTechnologies(techData);

            const total = techData.length;
            const completed = techData.filter(tech => tech.status === 'completed').length;
            const inProgress = techData.filter(tech => tech.status === 'in-progress').length;
            const notStarted = techData.filter(tech => tech.status === 'not-started').length;
            const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

            // Статистика по категориям
            const categoryStats = {};
            techData.forEach(tech => {
                if (!categoryStats[tech.category]) {
                    categoryStats[tech.category] = {
                        total: 0,
                        completed: 0,
                        inProgress: 0,
                        notStarted: 0,
                        progress: 0
                    };
                }
                categoryStats[tech.category].total++;
                categoryStats[tech.category][tech.status]++;
            });

            // Рассчитываем прогресс по категориям
            Object.keys(categoryStats).forEach(category => {
                const catStats = categoryStats[category];
                catStats.progress = Math.round((catStats.completed / catStats.total) * 100);
            });

            // Недавняя активность (последние изменения)
            const activity = [];
            techData.forEach(tech => {
                if (tech.lastUpdated) {
                    activity.push({
                        type: 'updated',
                        techId: tech.id,
                        title: tech.title,
                        status: tech.status,
                        date: new Date(tech.lastUpdated),
                        category: tech.category
                    });
                }
            });

            activity.sort((a, b) => b.date - a.date);
            setRecentActivity(activity.slice(0, 5));

            setStats({
                total,
                completed,
                inProgress,
                notStarted,
                progress,
                categoryStats
            });
        }
        setLoading(false);
    };

    const getCategoryIcon = (category) => {
        switch (category) {
            case 'frontend': return '🎨';
            case 'backend': return '⚙️';
            case 'database': return '🗄️';
            case 'devops': return '🔧';
            case 'tools': return '🛠️';
            default: return '📁';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'completed': return '✅';
            case 'in-progress': return '🔄';
            case 'not-started': return '⭕';
            default: return '📁';
        }
    };

    const getStatusName = (status) => {
        switch (status) {
            case 'completed': return 'Изучено';
            case 'in-progress': return 'В процессе';
            case 'not-started': return 'Не начато';
            default: return status;
        }
    };

    const getCategoryName = (category) => {
        switch (category) {
            case 'frontend': return 'Фронтенд';
            case 'backend': return 'Бэкенд';
            case 'database': return 'Базы данных';
            case 'devops': return 'DevOps';
            case 'tools': return 'Инструменты';
            default: return category;
        }
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('ru-RU', {
            day: 'numeric',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getTopCategories = () => {
        return Object.entries(stats.categoryStats)
            .sort((a, b) => b[1].progress - a[1].progress)
            .slice(0, 3);
    };

    const handleQuickAction = (action) => {
        switch (action) {
            case 'markAllCompleted':
                const updatedTechs = technologies.map(tech => ({
                    ...tech,
                    status: 'completed',
                    lastUpdated: new Date().toISOString()
                }));
                localStorage.setItem('technologies', JSON.stringify(updatedTechs));
                loadData();
                break;
            case 'resetAll':
                const resetTechs = technologies.map(tech => ({
                    ...tech,
                    status: 'not-started',
                    lastUpdated: new Date().toISOString()
                }));
                localStorage.setItem('technologies', JSON.stringify(resetTechs));
                loadData();
                break;
            default:
                break;
        }
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Загрузка данных...</p>
            </div>
        );
    }

    const topCategories = getTopCategories();

    return (
        <div className="home-page">
            <div className="hero-section">
                <h1 className="color-text">🚀 Добро пожаловать в Трекер технологий!</h1>
                <p className="hero-subtitle">
                    Отслеживайте свой прогресс в изучении {stats.total} технологий.
                    {stats.progress > 0 ? ` Вы уже изучили ${stats.completed} из них!` : ' Начните прямо сейчас!'}
                </p>
            </div>


            <div className="quick-stats">
                <div className="stat-card overview">
                    <div className="stat-icon">📈</div>
                    <div className="stat-content">
                        <div className="stat-number">{stats.progress}%</div>
                        <div className="color-text">Общий прогресс</div>
                    </div>
                </div>

                <div className="stat-grid">
                    <div className="stat-card">
                        <div className="stat-icon">📚</div>
                        <div className="stat-content">
                            <div className="stat-number">{stats.total}</div>
                            <div className="stat-label">Всего технологий</div>
                        </div>
                    </div>

                    <div className="stat-card completed">
                        <div className="stat-icon">✅</div>
                        <div className="stat-content">
                            <div className="stat-number">{stats.completed}</div>
                            <div className="stat-label">Изучено</div>
                        </div>
                    </div>

                    <div className="stat-card in-progress">
                        <div className="stat-icon">🔄</div>
                        <div className="stat-content">
                            <div className="stat-number">{stats.inProgress}</div>
                            <div className="stat-label">В процессе</div>
                        </div>
                    </div>

                    <div className="stat-card not-started">
                        <div className="stat-icon">⭕</div>
                        <div className="stat-content">
                            <div className="stat-number">{stats.notStarted}</div>
                            <div className="stat-label">Не начато</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="main-progress">
                <ProgressBar
                    progress={stats.progress}
                    label="Общий прогресс изучения"
                    color="#667eea"
                    height={30}
                    animated={true}
                    showPercentage={true}
                />
                <div className="progress-details">
                    <span className="progress-text">
                        {stats.completed} из {stats.total} технологий изучено
                    </span>
                    <div className="progress-actions">
                        <button
                            onClick={() => handleQuickAction('markAllCompleted')}
                            className="progress-btn complete-btn"
                            disabled={stats.completed === stats.total}
                        >
                            ✅ Отметить все как выполненные
                        </button>
                        <button
                            onClick={() => handleQuickAction('resetAll')}
                            className="progress-btn reset-btn"
                            disabled={stats.notStarted === stats.total}
                        >
                            🔄 Сбросить все статусы
                        </button>
                    </div>
                </div>
            </div>

            <div className="home-sections">
                <div className="section category-overview">
                    <div className="section-header">
                        <h2 className="color-text">🏆 Топ категории</h2>
                        <Link to="/statistics" className="view-all">
                            Вся статистика →
                        </Link>
                    </div>

                    {topCategories.length > 0 ? (
                        <div className="categories-grid">
                            {topCategories.map(([category, catStats]) => (
                                <div key={category} className="category-card">
                                    <div className="category-header">
                                        <div className="category-icon">
                                            {getCategoryIcon(category)}
                                        </div>
                                        <div className="category-info">
                                            <h3 className="color-text">{getCategoryName(category)}</h3>
                                            <div className="category-progress-value">
                                                {catStats.progress}%
                                            </div>
                                        </div>
                                    </div>

                                    <div className="category-progress-bar">
                                        <ProgressBar
                                            progress={catStats.progress}
                                            height={12}
                                            color={
                                                category === 'frontend' ? '#2196F3' :
                                                    category === 'backend' ? '#FF9800' :
                                                        category === 'database' ? '#4CAF50' :
                                                            category === 'devops' ? '#9C27B0' : '#795548'
                                            }
                                            animated={true}
                                            showPercentage={false}
                                        />
                                    </div>

                                    <div className="category-stats">
                                        <div className="category-stat">
                                            <span className="stat-label">Всего:</span>
                                            <span className="stat-value">{catStats.total}</span>
                                        </div>
                                        <div className="category-stat">
                                            <span className="stat-label">Изучено:</span>
                                            <span className="stat-value">{catStats.completed}</span>
                                        </div>
                                        <div className="category-stat">
                                            <span className="stat-label">В процессе:</span>
                                            <span className="stat-value">{catStats.inProgress}</span>
                                        </div>
                                    </div>

                                    <Link to={`/technologies?category=${category}`} className="category-link">
                                        Посмотреть технологии →
                                    </Link>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="no-categories">
                            <p>Нет данных по категориям. Добавьте технологии с указанием категорий.</p>
                        </div>
                    )}
                </div>

                <div className="section recent-activity">
                    <div className="section-header">
                        <h2 className="color-text">🕒 Недавняя активность</h2>
                        <Link to="/technologies" className="view-all">
                            Все технологии →
                        </Link>
                    </div>

                    {recentActivity.length > 0 ? (
                        <div className="activity-list">
                            {recentActivity.map((activity, index) => (
                                <div key={index} className="activity-item">
                                    <div className="activity-icon">
                                        {getStatusIcon(activity.status)}
                                    </div>
                                    <div className="activity-content">
                                        <div className="activity-title">
                                            <Link className="color-text" to={`/technology/${activity.techId}`}>
                                                {activity.title}
                                            </Link>
                                            <span className={`activity-status ${activity.status}`}>
                                                {getStatusName(activity.status)}
                                            </span>
                                        </div>
                                        <div className="activity-details">
                                            <span className="activity-category">
                                                {getCategoryIcon(activity.category)} {getCategoryName(activity.category)}
                                            </span>
                                            <span className="activity-date">
                                                {formatDate(activity.date)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="no-activity">
                            <p>Нет недавней активности. Начните изучать технологии!</p>
                        </div>
                    )}
                </div>

                <div className="section quick-actions-home">
                    <div className="section-header">
                        <h2 className="color-text">⚡ Быстрые действия</h2>
                    </div>
                    <div className="action-grid">
                        <Link to="/add-technology" className="action-card primary">
                            <div className="action-icon">➕</div>
                            <div className="action-content">
                                <h3 className="color-text">Добавить технологию</h3>
                                <p className="color-text">Добавьте новую технологию для изучения</p>
                            </div>
                        </Link>
                        <Link to="/technologies" className="action-card">
                            <div className="action-icon">📚</div>
                            <div className="action-content">
                                <h3 className="color-text">Все технологии</h3>
                                <p className="color-text">Просмотр и управление всеми технологиями</p>
                            </div>
                        </Link>
                        <Link to="/statistics" className="action-card">
                            <div className="action-icon">📊</div>
                            <div className="action-content">
                                <h3 className="color-text">Статистика</h3>
                                <p className="color-text">Анализ прогресса и достижений</p>
                            </div>
                        </Link>
                        <Link to="/settings" className="action-card">
                            <div className="action-icon">⚙️</div>
                            <div className="action-content">
                                <h3 className="color-text">Настройки</h3>
                                <p className="color-text">Настройте приложение под себя</p>
                            </div>
                        </Link>
                    </div>

                    <div className="quick-tips">
                        <h3 className="color-text">💡 Советы по использованию:</h3>
                        <ul className="tips-list">
                            <li className="color-text">Кликайте на карточки технологий для быстрой смены статуса</li>
                            <li className="color-text">Добавляйте заметки к каждой технологии</li>
                            <li className="color-text">Используйте фильтры для поиска нужных технологий</li>
                            <li className="color-text">Экспортируйте данные для резервного копирования</li>
                        </ul>
                    </div>
                </div>
            </div>

            <div className="motivation-section">
                <div className="motivation-card">
                    <div className="motivation-icon">🏆</div>
                    <div className="motivation-content">
                        <h3>Достижения и мотивация</h3>
                        <div className="motivation-stats">
                            {stats.progress >= 100 ? (
                                <p className="achievement">🎉 Поздравляем! Вы изучили все технологии!</p>
                            ) : stats.progress >= 75 ? (
                                <p className="achievement">🌟 Отличный результат! Почти все технологии изучены!</p>
                            ) : stats.progress >= 50 ? (
                                <p className="achievement">🚀 Отлично! Вы прошли больше половины пути!</p>
                            ) : stats.progress >= 25 ? (
                                <p className="achievement">🔥 Хороший старт! Продолжайте в том же духе!</p>
                            ) : stats.progress > 0 ? (
                                <p className="achievement">👍 Начало положено! Каждый день приближает к цели!</p>
                            ) : (
                                <p className="achievement">🚀 Начните прямо сейчас! Добавьте первую технологию!</p>
                            )}

                            {stats.completed > 0 && (
                                <div className="motivation-numbers">
                                    <div className="motivation-item">
                                        <span className="motivation-label">Средний прогресс:</span>
                                        <span className="motivation-value">{stats.progress}%</span>
                                    </div>
                                    <div className="motivation-item">
                                        <span className="motivation-label">Следующая цель:</span>
                                        <span className="motivation-value">
                                            {stats.completed + 1} из {stats.total} технологий
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;