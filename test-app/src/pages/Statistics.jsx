import { useState, useEffect, useMemo } from 'react';
import ProgressBar from '../components/ProgressBar';
import { 
    FaChartLine, 
    FaChartBar, 
    FaChartPie, 
    FaCalendarAlt,
    FaDownload,
    FaFilter,
    FaCalendarCheck,
    FaTrophy,
    FaLightbulb
} from 'react-icons/fa';
import './Statistics.css';

function Statistics() {
    const [technologies, setTechnologies] = useState([]);
    const [stats, setStats] = useState({
        total: 0,
        completed: 0,
        inProgress: 0,
        notStarted: 0,
        overallProgress: 0,
        byCategory: {},
        byStatus: {},
        byMonth: {},
        trends: []
    });
    const [timeRange, setTimeRange] = useState('all');
    const [loading, setLoading] = useState(true);
    const [activeChart, setActiveChart] = useState('category');
    const [achievements, setAchievements] = useState([]);

    useEffect(() => {
        loadData();
    }, []);

    useEffect(() => {
        if (technologies.length > 0) {
            calculateStats();
        }
    }, [technologies, timeRange]);

    const loadData = () => {
        setLoading(true);
        const saved = localStorage.getItem('technologies');
        if (saved) {
            const techData = JSON.parse(saved);
            setTechnologies(techData);
        }
        setLoading(false);
    };

    const calculateStats = () => {
        let filteredTechs = [...technologies];
        
        // Фильтрация по времени
        if (timeRange !== 'all') {
            const now = new Date();
            const cutoffDate = new Date();
            
            switch(timeRange) {
                case 'week':
                    cutoffDate.setDate(now.getDate() - 7);
                    break;
                case 'month':
                    cutoffDate.setMonth(now.getMonth() - 1);
                    break;
                case 'quarter':
                    cutoffDate.setMonth(now.getMonth() - 3);
                    break;
                case 'year':
                    cutoffDate.setFullYear(now.getFullYear() - 1);
                    break;
            }
            
            filteredTechs = filteredTechs.filter(tech => 
                new Date(tech.createdAt) >= cutoffDate
            );
        }

        const total = filteredTechs.length;
        const completed = filteredTechs.filter(tech => tech.status === 'completed').length;
        const inProgress = filteredTechs.filter(tech => tech.status === 'in-progress').length;
        const notStarted = filteredTechs.filter(tech => tech.status === 'not-started').length;
        const overallProgress = total > 0 ? Math.round((completed / total) * 100) : 0;
        
        // Статистика по категориям
        const byCategory = {};
        filteredTechs.forEach(tech => {
            if (!byCategory[tech.category]) {
                byCategory[tech.category] = {
                    total: 0,
                    completed: 0,
                    inProgress: 0,
                    notStarted: 0,
                    progress: 0
                };
            }
            byCategory[tech.category].total++;
            byCategory[tech.category][tech.status]++;
        });
        
        // Рассчитываем прогресс по категориям
        Object.keys(byCategory).forEach(category => {
            const catStats = byCategory[category];
            catStats.progress = Math.round((catStats.completed / catStats.total) * 100);
        });

        // Статистика по статусам
        const byStatus = {
            completed: completed,
            'in-progress': inProgress,
            'not-started': notStarted
        };

        // Статистика по месяцам
        const byMonth = {};
        filteredTechs.forEach(tech => {
            if (tech.createdAt) {
                const date = new Date(tech.createdAt);
                const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`;
                const monthName = date.toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' });
                
                if (!byMonth[monthKey]) {
                    byMonth[monthKey] = {
                        name: monthName,
                        total: 0,
                        completed: 0,
                        inProgress: 0,
                        notStarted: 0
                    };
                }
                
                byMonth[monthKey].total++;
                byMonth[monthKey][tech.status]++;
            }
        });

        // Тренды прогресса
        const trends = [];
        const months = Object.keys(byMonth).sort();
        
        let cumulativeCompleted = 0;
        let cumulativeTotal = 0;
        
        months.forEach(monthKey => {
            const month = byMonth[monthKey];
            cumulativeTotal += month.total;
            cumulativeCompleted += month.completed;
            
            trends.push({
                month: month.name,
                progress: cumulativeTotal > 0 ? Math.round((cumulativeCompleted / cumulativeTotal) * 100) : 0,
                added: month.total,
                completed: month.completed
            });
        });

        // Достижения
        const newAchievements = calculateAchievements(filteredTechs);
        setAchievements(newAchievements);

        setStats({
            total,
            completed,
            inProgress,
            notStarted,
            overallProgress,
            byCategory,
            byStatus,
            byMonth,
            trends
        });
    };

    const calculateAchievements = (techs) => {
        const achievements = [];
        const total = techs.length;
        const completed = techs.filter(t => t.status === 'completed').length;
        const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

        // Проверяем достижения
        if (completed >= 1) achievements.push({
            id: 'first',
            title: '🎯 Первые шаги',
            description: 'Вы изучили свою первую технологию!',
            unlocked: true,
            progress: 100
        });

        if (completed >= 5) achievements.push({
            id: 'expert',
            title: '🌟 Начинающий эксперт',
            description: 'Вы изучили 5 технологий!',
            unlocked: true,
            progress: 100
        });

        if (completed >= 10) achievements.push({
            id: 'master',
            title: '🏆 Мастер технологий',
            description: 'Покорены 10 технологий!',
            unlocked: completed >= 10,
            progress: completed >= 10 ? 100 : Math.round((completed / 10) * 100)
        });

        if (progress >= 25) achievements.push({
            id: 'quarter',
            title: '📊 25% Прогресса',
            description: 'Вы прошли четверть пути!',
            unlocked: true,
            progress: 100
        });

        if (progress >= 50) achievements.push({
            id: 'halfway',
            title: '🚀 Полпути пройдено',
            description: '50% технологий изучено!',
            unlocked: progress >= 50,
            progress: progress >= 50 ? 100 : progress / 50 * 100
        });

        if (progress >= 75) achievements.push({
            id: 'almost',
            title: '💪 Почти у цели',
            description: '75% технологий изучено!',
            unlocked: progress >= 75,
            progress: progress >= 75 ? 100 : progress / 75 * 100
        });

        if (progress === 100 && total > 0) achievements.push({
            id: 'perfect',
            title: '🎉 Идеальный результат!',
            description: 'Все технологии изучены!',
            unlocked: true,
            progress: 100
        });

        // Проверяем разные категории
        const categories = new Set(techs.map(t => t.category));
        if (categories.size >= 3) achievements.push({
            id: 'diverse',
            title: '🌍 Разнообразие',
            description: 'Изучаете технологии из 3+ категорий',
            unlocked: true,
            progress: 100
        });

        return achievements;
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

    const exportStatistics = () => {
        const exportData = {
            exportedAt: new Date().toISOString(),
            statistics: stats,
            technologies: technologies,
            achievements: achievements,
            settings: {
                timeRange,
                activeChart
            }
        };
        
        const dataStr = JSON.stringify(exportData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const dataUrl = URL.createObjectURL(dataBlob);
        
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = `statistics-export-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const getInsights = () => {
        const insights = [];
        
        if (stats.overallProgress === 0 && stats.total > 0) {
            insights.push({
                type: 'warning',
                message: 'Начните изучать технологии! Вы еще не начали ни одну.',
                icon: '🚀'
            });
        }
        
        if (stats.notStarted > stats.total * 0.5) {
            insights.push({
                type: 'info',
                message: `У вас ${stats.notStarted} технологий в статусе "Не начато". Попробуйте выбрать одну и начать изучение.`,
                icon: '🎯'
            });
        }
        
        if (stats.completed >= stats.total * 0.8) {
            insights.push({
                type: 'success',
                message: 'Отличный результат! Вы изучили большинство технологий!',
                icon: '🏆'
            });
        }
        
        // Находим лучшую категорию
        const categories = Object.entries(stats.byCategory);
        if (categories.length > 0) {
            const bestCategory = categories.sort((a, b) => b[1].progress - a[1].progress)[0];
            insights.push({
                type: 'info',
                message: `Ваша лучшая категория: ${getCategoryName(bestCategory[0])} (${bestCategory[1].progress}% изучено)`,
                icon: '⭐'
            });
        }
        
        // Находим категорию для улучшения
        const worstCategory = categories.sort((a, b) => a[1].progress - b[1].progress)[0];
        if (worstCategory && worstCategory[1].progress < 50) {
            insights.push({
                type: 'warning',
                message: `Обратите внимание на категорию "${getCategoryName(worstCategory[0])}" (${worstCategory[1].progress}% изучено)`,
                icon: '💡'
            });
        }

        return insights;
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Загрузка статистики...</p>
            </div>
        );
    }

    const insights = getInsights();
    const categoriesArray = Object.entries(stats.byCategory);
    const sortedCategories = categoriesArray.sort((a, b) => b[1].progress - a[1].progress);

    return (
        <div className="statistics-page">
            <div className="page-header">
                <div className="header-content">
                    <h1><FaChartLine /> Статистика и аналитика</h1>
                    <p>Подробная статистика вашего прогресса в изучении технологий</p>
                </div>
                <button onClick={exportStatistics} className="export-btn">
                    <FaDownload /> Экспорт статистики
                </button>
            </div>

            {/* Контролы времени */}
            <div className="time-controls">
                <div className="time-label">
                    <FaCalendarAlt /> Период:
                </div>
                <div className="time-buttons">
                    <button 
                        className={`time-btn ${timeRange === 'all' ? 'active' : ''}`}
                        onClick={() => setTimeRange('all')}
                    >
                        Всё время
                    </button>
                    <button 
                        className={`time-btn ${timeRange === 'year' ? 'active' : ''}`}
                        onClick={() => setTimeRange('year')}
                    >
                        Год
                    </button>
                    <button 
                        className={`time-btn ${timeRange === 'quarter' ? 'active' : ''}`}
                        onClick={() => setTimeRange('quarter')}
                    >
                        Квартал
                    </button>
                    <button 
                        className={`time-btn ${timeRange === 'month' ? 'active' : ''}`}
                        onClick={() => setTimeRange('month')}
                    >
                        Месяц
                    </button>
                    <button 
                        className={`time-btn ${timeRange === 'week' ? 'active' : ''}`}
                        onClick={() => setTimeRange('week')}
                    >
                        Неделя
                    </button>
                </div>
            </div>

            {/* Общая статистика */}
            <div className="overview-stats">
                <div className="stat-card overview">
                    <div className="stat-icon">📈</div>
                    <div className="stat-content">
                        <div className="stat-number">{stats.overallProgress}%</div>
                        <div className="stat-label">Общий прогресс</div>
                        <div className="stat-subtitle">
                            {stats.completed} из {stats.total} изучено
                        </div>
                    </div>
                </div>
                
                <div className="stat-grid">
                    <div className="stat-card">
                        <div className="stat-icon">📚</div>
                        <div className="stat-content">
                            <div className="stat-number">{stats.total}</div>
                            <div className="stat-label">Всего технологий</div>
                            <div className="stat-subtitle">
                                за {timeRange === 'all' ? 'всё время' : timeRange}
                            </div>
                        </div>
                    </div>
                    
                    <div className="stat-card completed">
                        <div className="stat-icon">✅</div>
                        <div className="stat-content">
                            <div className="stat-number">{stats.completed}</div>
                            <div className="stat-label">Изучено</div>
                            <div className="stat-subtitle">
                                {stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0}%
                            </div>
                        </div>
                    </div>
                    
                    <div className="stat-card in-progress">
                        <div className="stat-icon">🔄</div>
                        <div className="stat-content">
                            <div className="stat-number">{stats.inProgress}</div>
                            <div className="stat-label">В процессе</div>
                            <div className="stat-subtitle">
                                {stats.total > 0 ? Math.round((stats.inProgress / stats.total) * 100) : 0}%
                            </div>
                        </div>
                    </div>
                    
                    <div className="stat-card not-started">
                        <div className="stat-icon">⭕</div>
                        <div className="stat-content">
                            <div className="stat-number">{stats.notStarted}</div>
                            <div className="stat-label">Не начато</div>
                            <div className="stat-subtitle">
                                {stats.total > 0 ? Math.round((stats.notStarted / stats.total) * 100) : 0}%
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Графики переключения */}
            <div className="chart-selector">
                <button 
                    className={`chart-btn ${activeChart === 'category' ? 'active' : ''}`}
                    onClick={() => setActiveChart('category')}
                >
                    <FaChartPie /> По категориям
                </button>
                <button 
                    className={`chart-btn ${activeChart === 'status' ? 'active' : ''}`}
                    onClick={() => setActiveChart('status')}
                >
                    <FaChartBar /> По статусам
                </button>
                <button 
                    className={`chart-btn ${activeChart === 'trend' ? 'active' : ''}`}
                    onClick={() => setActiveChart('trend')}
                >
                    <FaChartLine /> Тренды
                </button>
            </div>

            {/* Основной график */}
            <div className="main-chart-section">
                {activeChart === 'category' && (
                    <div className="chart-container">
                        <h3><FaChartPie /> Распределение по категориям</h3>
                        <div className="categories-chart">
                            {sortedCategories.length > 0 ? (
                                <>
                                    <div className="chart-bars">
                                        {sortedCategories.map(([category, catStats]) => (
                                            <div key={category} className="chart-bar-item">
                                                <div className="bar-label">
                                                    <span className="category-icon">
                                                        {getCategoryIcon(category)}
                                                    </span>
                                                    <span className="category-name">
                                                        {getCategoryName(category)}
                                                    </span>
                                                    <span className="category-progress">
                                                        {catStats.progress}%
                                                    </span>
                                                </div>
                                                <div className="bar-container">
                                                    <div 
                                                        className="bar-fill"
                                                        style={{ 
                                                            width: `${catStats.progress}%`,
                                                            background: category === 'frontend' ? '#2196F3' :
                                                                      category === 'backend' ? '#FF9800' :
                                                                      category === 'database' ? '#4CAF50' :
                                                                      category === 'devops' ? '#9C27B0' : '#795548'
                                                        }}
                                                    ></div>
                                                </div>
                                                <div className="bar-stats">
                                                    <span className="bar-stat">
                                                        {catStats.completed}/{catStats.total}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            ) : (
                                <div className="no-data">
                                    Нет данных по категориям
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {activeChart === 'status' && (
                    <div className="chart-container">
                        <h3><FaChartBar /> Распределение по статусам</h3>
                        <div className="status-chart">
                            <div className="status-bars">
                                <div className="status-bar-item completed">
                                    <div className="status-label">
                                        <span className="status-icon">✅</span>
                                        <span className="status-name">Изучено</span>
                                        <span className="status-count">
                                            {stats.completed} ({stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0}%)
                                        </span>
                                    </div>
                                    <div className="status-bar-container">
                                        <div 
                                            className="status-bar-fill"
                                            style={{ width: `${stats.total > 0 ? (stats.completed / stats.total) * 100 : 0}%` }}
                                        ></div>
                                    </div>
                                </div>
                                
                                <div className="status-bar-item in-progress">
                                    <div className="status-label">
                                        <span className="status-icon">🔄</span>
                                        <span className="status-name">В процессе</span>
                                        <span className="status-count">
                                            {stats.inProgress} ({stats.total > 0 ? Math.round((stats.inProgress / stats.total) * 100) : 0}%)
                                        </span>
                                    </div>
                                    <div className="status-bar-container">
                                        <div 
                                            className="status-bar-fill"
                                            style={{ width: `${stats.total > 0 ? (stats.inProgress / stats.total) * 100 : 0}%` }}
                                        ></div>
                                    </div>
                                </div>
                                
                                <div className="status-bar-item not-started">
                                    <div className="status-label">
                                        <span className="status-icon">⭕</span>
                                        <span className="status-name">Не начато</span>
                                        <span className="status-count">
                                            {stats.notStarted} ({stats.total > 0 ? Math.round((stats.notStarted / stats.total) * 100) : 0}%)
                                        </span>
                                    </div>
                                    <div className="status-bar-container">
                                        <div 
                                            className="status-bar-fill"
                                            style={{ width: `${stats.total > 0 ? (stats.notStarted / stats.total) * 100 : 0}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeChart === 'trend' && (
                    <div className="chart-container">
                        <h3><FaChartLine /> Динамика прогресса</h3>
                        <div className="trend-chart">
                            {stats.trends.length > 0 ? (
                                <div className="trend-lines">
                                    <div className="trend-line">
                                        <div className="trend-points">
                                            {stats.trends.map((trend, index) => (
                                                <div key={index} className="trend-point">
                                                    <div 
                                                        className="point"
                                                        style={{ 
                                                            left: `${(index / (stats.trends.length - 1)) * 100}%`,
                                                            bottom: `${trend.progress}%`
                                                        }}
                                                        title={`${trend.month}: ${trend.progress}%`}
                                                    >
                                                        <div className="point-tooltip">
                                                            {trend.month}: {trend.progress}%
                                                            <br />
                                                            Добавлено: {trend.added}
                                                            <br />
                                                            Изучено: {trend.completed}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="trend-grid">
                                            {[0, 25, 50, 75, 100].map(percent => (
                                                <div key={percent} className="grid-line">
                                                    <span className="grid-label">{percent}%</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="no-data">
                                    Нет данных для отображения трендов
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Достижения */}
            <div className="achievements-section">
                <h3><FaTrophy /> Достижения</h3>
                <div className="achievements-grid">
                    {achievements.length > 0 ? (
                        achievements.map(achievement => (
                            <div key={achievement.id} className={`achievement-card ${achievement.unlocked ? 'unlocked' : 'locked'}`}>
                                <div className="achievement-icon">
                                    {achievement.unlocked ? achievement.title.split(' ')[0] : '🔒'}
                                </div>
                                <div className="achievement-content">
                                    <h4>{achievement.title}</h4>
                                    <p>{achievement.description}</p>
                                    {!achievement.unlocked && (
                                        <div className="achievement-progress">
                                            <ProgressBar
                                                progress={achievement.progress}
                                                height={8}
                                                color="#667eea"
                                                showPercentage={false}
                                            />
                                            <span className="progress-text">
                                                {Math.round(achievement.progress)}%
                                            </span>
                                        </div>
                                    )}
                                </div>
                                <div className="achievement-status">
                                    {achievement.unlocked ? '✅' : '🔒'}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="no-achievements">
                            <p>Выполняйте задачи, чтобы получать достижения!</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Инсайты */}
            <div className="insights-section">
                <h3><FaLightbulb /> Инсайты и рекомендации</h3>
                <div className="insights-grid">
                    {insights.length > 0 ? (
                        insights.map((insight, index) => (
                            <div key={index} className={`insight-card ${insight.type}`}>
                                <div className="insight-icon">{insight.icon}</div>
                                <div className="insight-content">
                                    <p>{insight.message}</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="no-insights">
                            <p>Продолжайте изучать технологии для получения рекомендаций</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Детальная статистика */}
            <div className="detailed-stats">
                <div className="stats-section">
                    <h4><FaCalendarCheck /> Ежемесячная активность</h4>
                    <div className="monthly-stats">
                        {Object.entries(stats.byMonth).slice(-6).reverse().map(([key, month]) => (
                            <div key={key} className="month-stat">
                                <div className="month-name">{month.name}</div>
                                <div className="month-progress">
                                    <ProgressBar
                                        progress={month.total > 0 ? Math.round((month.completed / month.total) * 100) : 0}
                                        height={10}
                                        color="#667eea"
                                        showPercentage={false}
                                    />
                                </div>
                                <div className="month-numbers">
                                    <span className="month-total">+{month.total}</span>
                                    <span className="month-completed">✅{month.completed}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="stats-section">
                    <h4>📊 Детали по категориям</h4>
                    <div className="category-details">
                        {sortedCategories.map(([category, catStats]) => (
                            <div key={category} className="category-detail">
                                <div className="category-header">
                                    <span className="detail-icon">
                                        {getCategoryIcon(category)}
                                    </span>
                                    <span className="detail-name">
                                        {getCategoryName(category)}
                                    </span>
                                    <span className="detail-progress">
                                        {catStats.progress}%
                                    </span>
                                </div>
                                <div className="detail-stats">
                                    <div className="detail-stat">
                                        <span className="stat-label">Всего:</span>
                                        <span className="stat-value">{catStats.total}</span>
                                    </div>
                                    <div className="detail-stat">
                                        <span className="stat-label">Изучено:</span>
                                        <span className="stat-value completed">{catStats.completed}</span>
                                    </div>
                                    <div className="detail-stat">
                                        <span className="stat-label">В процессе:</span>
                                        <span className="stat-value in-progress">{catStats.inProgress}</span>
                                    </div>
                                    <div className="detail-stat">
                                        <span className="stat-label">Не начато:</span>
                                        <span className="stat-value not-started">{catStats.notStarted}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Statistics;