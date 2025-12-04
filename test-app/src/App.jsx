import { useState } from 'react';
import './App.css';
import TechnologyCard from './components/TechnologyCard';
import ProgressHeader from './components/ProgressHeader';
import QuickActions from './components/QuickActions';
import TechnologyFilter from './components/TechnologyFilter';
import TechnologyCardWrapper from './components/TechnologyCardWrapper';
import ProgressBar from './components/ProgressBar';
import Modal from './components/Modal';
import useTechnologies from './hooks/useTechnologies';

function App() {
    // Используем кастомный хук для работы с технологиями
    const {
        technologies,
        updateStatus,
        updateNotes,
        markAllCompleted,
        resetAllStatuses,
        progress: overallProgress,
        getCategoryStats
    } = useTechnologies();

    // Состояние для активного фильтра
    const [activeFilter, setActiveFilter] = useState('all');
    // Состояние для поискового запроса
    const [searchQuery, setSearchQuery] = useState('');
    // Состояние для модалки экспорта
    const [showExportModal, setShowExportModal] = useState(false);
    // Состояние для выбора категории
    const [activeCategory, setActiveCategory] = useState('all');

    // Функция для фильтрации технологий по статусу
    const getFilteredByStatus = () => {
        switch (activeFilter) {
            case 'not-started':
                return technologies.filter(tech => tech.status === 'not-started');
            case 'in-progress':
                return technologies.filter(tech => tech.status === 'in-progress');
            case 'completed':
                return technologies.filter(tech => tech.status === 'completed');
            default:
                return technologies;
        }
    };

    // Функция для фильтрации технологий по категории
    const getFilteredByCategory = () => {
        if (activeCategory === 'all') return technologies;
        return technologies.filter(tech => tech.category === activeCategory);
    };

    // Функция для фильтрации технологий по поисковому запросу
    const getFilteredTechnologies = () => {
        const statusFiltered = getFilteredByStatus();
        const categoryFiltered = getFilteredByCategory();

        // Объединяем фильтры по статусу и категории
        const combinedFiltered = statusFiltered.filter(tech =>
            categoryFiltered.some(catTech => catTech.id === tech.id)
        );

        if (!searchQuery.trim()) {
            return combinedFiltered;
        }

        const query = searchQuery.toLowerCase();
        return combinedFiltered.filter(tech =>
            tech.title.toLowerCase().includes(query) ||
            tech.description.toLowerCase().includes(query) ||
            tech.notes.toLowerCase().includes(query) ||
            tech.category.toLowerCase().includes(query)
        );
    };

    const filteredTechnologies = getFilteredTechnologies();
    const categoryStats = getCategoryStats();

    // Функция для экспорта данных
    const handleExportData = () => {
        const exportData = {
            exportedAt: new Date().toISOString(),
            totalTechnologies: technologies.length,
            completed: technologies.filter(tech => tech.status === 'completed').length,
            inProgress: technologies.filter(tech => tech.status === 'in-progress').length,
            notStarted: technologies.filter(tech => tech.status === 'not-started').length,
            technologies: technologies
        };

        const dataStr = JSON.stringify(exportData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const dataUrl = URL.createObjectURL(dataBlob);

        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = `tech-tracker-export-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        setShowExportModal(true);
    };

    // Функция для сброса всех данных
    const handleResetAllData = () => {
        if (window.confirm('Вы уверены, что хотите сбросить все данные? Это действие нельзя отменить.')) {
            localStorage.removeItem('technologies');
            window.location.reload();
        }
    };

    return (
        <div className="App">
            <header className="App-header">
                <h1>🚀 Трекер изучения технологий</h1>
                <p>Кликайте на карточки для изменения статуса изучения</p>

                {/* Общий прогресс-бар */}
                <div className="overall-progress-bar">
                    <ProgressBar
                        progress={overallProgress}
                        label="Общий прогресс изучения"
                        color="#667eea"
                        height={25}
                        animated={true}
                        showPercentage={true}
                    />
                </div>
            </header>

            <ProgressHeader technologies={technologies} />

            {/* Статистика по категориям */}
            // Заменяем блок category-stats на улучшенную версию:
            <div className="category-stats">
                <h3>📊 Прогресс по категориям</h3>
                <div className="category-bars">
                    {categoryStats.map(stat => (
                        <div key={stat.category} className={`category-stat-item category-${stat.category}`}>
                            <div className="category-info">
                                <span className="category-name">
                                    {stat.category === 'frontend' ? '🎨 Фронтенд' : '⚙️ Бэкенд'}
                                    <span className="category-tech-count">
                                        ({stat.total} технологий)
                                    </span>
                                </span>
                                <span className="category-progress">{stat.progress}%</span>
                            </div>

                            {/* Прогресс-бар для категории */}
                            <div className="category-progress-bar-wrapper">
                                <ProgressBar
                                    progress={stat.progress}
                                    height={18}
                                    color={stat.category === 'frontend' ? '#2196F3' : '#FF9800'}
                                    animated={stat.progress > 0}
                                    showPercentage={false}
                                    showLabel={false}
                                />
                            </div>

                            <div className="category-details">
                                <span className="completed-count">
                                    <strong>{stat.completed}</strong> из <strong>{stat.total}</strong> изучено
                                </span>
                                {stat.category === 'frontend' && (
                                    <div className="category-hint">
                                        🎨 Интерфейсы и клиентская часть
                                    </div>
                                )}
                                {stat.category === 'backend' && (
                                    <div className="category-hint">
                                        ⚙️ Серверная логика и базы данных
                                    </div>
                                )}
                            </div>

                            {/* Разделитель между категориями */}
                            <div className="category-divider"></div>
                        </div>
                    ))}

                    {/* Общая статистика по категориям */}
                    <div className="category-total">
                        <div className="total-info">
                            <span className="total-label">📈 Общий прогресс по категориям:</span>
                            <span className="total-value">
                                {Math.round(categoryStats.reduce((sum, stat) => sum + stat.progress, 0) / categoryStats.length)}%
                            </span>
                        </div>
                        <div className="total-hint">
                            Средний прогресс по всем категориям
                        </div>
                    </div>
                </div>
            </div>

            <QuickActions
                technologies={technologies}
                setTechnologies={markAllCompleted}
                onMarkAllCompleted={markAllCompleted}
                onResetAll={resetAllStatuses}
                onExport={handleExportData}
                onResetData={handleResetAllData}
            />

            {/* Фильтры */}
            <div className="filters-container">
                <TechnologyFilter
                    activeFilter={activeFilter}
                    setActiveFilter={setActiveFilter}
                />

                {/* Фильтр по категориям */}
                <div className="category-filter">
                    <h3>Категории</h3>
                    <div className="filter-buttons">
                        <button
                            className={`filter-btn ${activeCategory === 'all' ? 'active' : ''}`}
                            onClick={() => setActiveCategory('all')}
                        >
                            🌐 Все
                        </button>
                        <button
                            className={`filter-btn ${activeCategory === 'frontend' ? 'active' : ''}`}
                            onClick={() => setActiveCategory('frontend')}
                        >
                            🎨 Фронтенд
                        </button>
                        <button
                            className={`filter-btn ${activeCategory === 'backend' ? 'active' : ''}`}
                            onClick={() => setActiveCategory('backend')}
                        >
                            ⚙️ Бэкенд
                        </button>
                    </div>
                </div>
            </div>

            {/* Поле поиска */}
            <div className="search-box">
                <input
                    type="text"
                    placeholder="🔍 Поиск технологий по названию, описанию, заметкам или категории..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <span className="search-results-count">
                    Найдено: {filteredTechnologies.length} из {technologies.length}
                </span>
            </div>

            <main className="technologies-container">
                <h2>Дорожная карта технологий</h2>
                <div className="technologies-grid">
                    {filteredTechnologies.map(technology => (
                        <TechnologyCardWrapper
                            key={technology.id}
                            status={technology.status}
                        >
                            <TechnologyCard
                                id={technology.id}
                                title={technology.title}
                                description={technology.description}
                                status={technology.status}
                                notes={technology.notes}
                                category={technology.category}
                                onStatusChange={updateStatus}
                                onNotesChange={updateNotes}
                            />
                        </TechnologyCardWrapper>
                    ))}

                    {filteredTechnologies.length === 0 && (
                        <div className="no-results">
                            <p>🚫 Нет технологий с выбранными фильтрами</p>
                            <p>Попробуйте выбрать другой фильтр или измените статусы технологий</p>
                        </div>
                    )}
                </div>
            </main>

            {/* Модальное окно экспорта */}
            <Modal
                isOpen={showExportModal}
                onClose={() => setShowExportModal(false)}
                title="✅ Экспорт данных завершен"
            >
                <div className="export-modal-content">
                    <p>📥 Данные успешно подготовлены и скачаны!</p>
                    <p>Файл содержит всю информацию о вашем прогрессе в изучении технологий.</p>
                    <div className="export-info">
                        <p><strong>📊 Статистика экспорта:</strong></p>
                        <ul>
                            <li>Всего технологий: {technologies.length}</li>
                            <li>Изучено: {technologies.filter(tech => tech.status === 'completed').length}</li>
                            <li>В процессе: {technologies.filter(tech => tech.status === 'in-progress').length}</li>
                            <li>Не начато: {technologies.filter(tech => tech.status === 'not-started').length}</li>
                        </ul>
                    </div>
                    <button
                        className="modal-close-btn"
                        onClick={() => setShowExportModal(false)}
                    >
                        Закрыть
                    </button>
                </div>
            </Modal>
        </div>
    );
}

export default App;