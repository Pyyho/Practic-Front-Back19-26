import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect, useMemo } from 'react';
import {
    FaSearch,
    FaFilter,
    FaSortAmountDown,
    FaSortAmountUp,
    FaDownload,
    FaUpload,
    FaTrash,
    FaCheck,
    FaSync,
    FaClock
} from 'react-icons/fa';
import './TechnologyList.css';

function TechnologyList() {
    const [technologies, setTechnologies] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [sortBy, setSortBy] = useState('date');
    const [sortOrder, setSortOrder] = useState('desc');
    const [selectedTechs, setSelectedTechs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showFilters, setShowFilters] = useState(false);
    const [showBulkActions, setShowBulkActions] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        loadTechnologies();

        // Парсим параметры URL
        const params = new URLSearchParams(location.search);
        const category = params.get('category');
        const status = params.get('status');

        if (category) setCategoryFilter(category);
        if (status) setStatusFilter(status);
    }, [location.search]);

    const loadTechnologies = () => {
        setLoading(true);
        const saved = localStorage.getItem('technologies');
        if (saved) {
            const techData = JSON.parse(saved);
            setTechnologies(techData);
        }
        setLoading(false);
    };

    // Получаем уникальные категории
    const categories = useMemo(() => {
        const cats = new Set();
        technologies.forEach(tech => cats.add(tech.category));
        return Array.from(cats);
    }, [technologies]);

    // Фильтрация и сортировка
    const filteredTechnologies = useMemo(() => {
        let filtered = [...technologies];

        // Фильтр по статусу
        if (statusFilter !== 'all') {
            filtered = filtered.filter(tech => tech.status === statusFilter);
        }

        // Фильтр по категории
        if (categoryFilter !== 'all') {
            filtered = filtered.filter(tech => tech.category === categoryFilter);
        }

        // Поиск по запросу
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(tech =>
                tech.title.toLowerCase().includes(query) ||
                tech.description.toLowerCase().includes(query) ||
                tech.notes.toLowerCase().includes(query)
            );
        }

        // Сортировка
        filtered.sort((a, b) => {
            let comparison = 0;

            switch (sortBy) {
                case 'title':
                    comparison = a.title.localeCompare(b.title);
                    break;
                case 'status':
                    const statusOrder = { 'completed': 3, 'in-progress': 2, 'not-started': 1 };
                    comparison = (statusOrder[a.status] || 0) - (statusOrder[b.status] || 0);
                    break;
                case 'category':
                    comparison = a.category.localeCompare(b.category);
                    break;
                case 'date':
                    comparison = new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
                    break;
                case 'progress':
                    const progressA = a.status === 'completed' ? 100 : a.status === 'in-progress' ? 50 : 0;
                    const progressB = b.status === 'completed' ? 100 : b.status === 'in-progress' ? 50 : 0;
                    comparison = progressB - progressA;
                    break;
                default:
                    comparison = 0;
            }

            return sortOrder === 'desc' ? -comparison : comparison;
        });

        return filtered;
    }, [technologies, statusFilter, categoryFilter, searchQuery, sortBy, sortOrder]);

    // Функции для отображения
    const getStatusIcon = (status) => {
        switch (status) {
            case 'completed': return <FaCheck className="completed" />;
            case 'in-progress': return <FaSync className="in-progress" />;
            case 'not-started': return <FaClock className="not-started" />;
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

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('ru-RU', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    // Управление выбранными технологиями
    const toggleTechSelection = (techId) => {
        setSelectedTechs(prev =>
            prev.includes(techId)
                ? prev.filter(id => id !== techId)
                : [...prev, techId]
        );
    };

    const selectAllTechs = () => {
        if (selectedTechs.length === filteredTechnologies.length) {
            setSelectedTechs([]);
        } else {
            setSelectedTechs(filteredTechnologies.map(tech => tech.id));
        }
    };

    // Массовые действия
    const handleBulkAction = (action) => {
        if (selectedTechs.length === 0) return;

        const updatedTechs = technologies.map(tech => {
            if (selectedTechs.includes(tech.id)) {
                switch (action) {
                    case 'complete':
                        return { ...tech, status: 'completed', lastUpdated: new Date().toISOString() };
                    case 'reset':
                        return { ...tech, status: 'not-started', lastUpdated: new Date().toISOString() };
                    case 'in-progress':
                        return { ...tech, status: 'in-progress', lastUpdated: new Date().toISOString() };
                    case 'delete':
                        return null;
                    default:
                        return tech;
                }
            }
            return tech;
        }).filter(Boolean);

        localStorage.setItem('technologies', JSON.stringify(updatedTechs));
        setTechnologies(updatedTechs);

        if (action === 'delete') {
            setSelectedTechs([]);
            setShowBulkActions(false);
        }
    };

    // Экспорт данных
    const exportData = () => {
        const exportData = {
            exportedAt: new Date().toISOString(),
            technologies: filteredTechnologies,
            filters: {
                searchQuery,
                statusFilter,
                categoryFilter,
                sortBy,
                sortOrder
            }
        };

        const dataStr = JSON.stringify(exportData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const dataUrl = URL.createObjectURL(dataBlob);

        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = `tech-export-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // Импорт данных
    const importData = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);

                if (data.technologies && Array.isArray(data.technologies)) {
                    const existingTechs = JSON.parse(localStorage.getItem('technologies') || '[]');
                    const mergedTechs = [...existingTechs, ...data.technologies];

                    // Убираем дубликаты по ID
                    const uniqueTechs = Array.from(
                        new Map(mergedTechs.map(tech => [tech.id, tech])).values()
                    );

                    localStorage.setItem('technologies', JSON.stringify(uniqueTechs));
                    setTechnologies(uniqueTechs);
                    alert(`✅ Импортировано ${data.technologies.length} технологий`);
                }
            } catch (error) {
                alert('❌ Ошибка при импорте данных. Проверьте формат файла.');
            }
        };
        reader.readAsText(file);
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Загрузка технологий...</p>
            </div>
        );
    }

    return (
        <div className="technology-list-page">
            <div className="page-header">
                <div className="header-content">
                    <h1>📚 Все технологии</h1>
                    <p>Управляйте своими технологиями для изучения. Всего: {technologies.length}</p>
                </div>
                <Link to="/add-technology" className="add-btn">
                    ➕ Добавить технологию
                </Link>
            </div>

            {/* Баннер массовых действий */}
            {showBulkActions && selectedTechs.length > 0 && (
                <div className="bulk-actions-banner">
                    <div className="bulk-info">
                        <span className="selected-count">
                            Выбрано: {selectedTechs.length} технологий
                        </span>
                        <button
                            onClick={() => setShowBulkActions(false)}
                            className="close-bulk"
                        >
                            ✕
                        </button>
                    </div>
                    <div className="bulk-buttons">
                        <button
                            onClick={() => handleBulkAction('complete')}
                            className="bulk-btn complete"
                        >
                            <FaCheck /> Отметить как изученные
                        </button>
                        <button
                            onClick={() => handleBulkAction('in-progress')}
                            className="bulk-btn in-progress"
                        >
                            <FaSync /> Отметить как в процессе
                        </button>
                        <button
                            onClick={() => handleBulkAction('reset')}
                            className="bulk-btn reset"
                        >
                            🔄 Сбросить статус
                        </button>
                        <button
                            onClick={() => {
                                if (window.confirm(`Удалить ${selectedTechs.length} технологий?`)) {
                                    handleBulkAction('delete');
                                }
                            }}
                            className="bulk-btn delete"
                        >
                            <FaTrash /> Удалить
                        </button>
                    </div>
                </div>
            )}

            {/* Панель управления */}
            <div className="control-panel">
                <div className="search-section">
                    <div className="search-box">
                        <FaSearch className="search-icon" />
                        <input
                            type="text"
                            placeholder="Поиск технологий..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="search-input"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery('')}
                                className="clear-search"
                            >
                                ✕
                            </button>
                        )}
                    </div>

                    <div className="result-info">
                        Найдено: <strong>{filteredTechnologies.length}</strong> из {technologies.length}
                    </div>
                </div>

                <div className="action-buttons">
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className="action-btn filter-btn"
                    >
                        <FaFilter /> Фильтры
                    </button>

                    <div className="sort-controls">
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="sort-select"
                        >
                            <option value="date">📅 По дате</option>
                            <option value="title">🔤 По названию</option>
                            <option value="status">📊 По статусу</option>
                            <option value="category">🏷️ По категории</option>
                            <option value="progress">📈 По прогрессу</option>
                        </select>

                        <button
                            onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
                            className="sort-order-btn"
                        >
                            {sortOrder === 'desc' ? <FaSortAmountDown /> : <FaSortAmountUp />}
                        </button>
                    </div>

                    <button
                        onClick={exportData}
                        className="action-btn export-btn"
                    >
                        <FaDownload style={{ color: '#9C27B0' }} /> Экспорт
                    </button>

                    <label className="action-btn import-btn">
                        <FaUpload style={{ color: '#2196F3' }} /> Импорт
                        <input
                            type="file"
                            accept=".json"
                            onChange={importData}
                            style={{ display: 'none' }}
                        />
                    </label>
                </div>

                {/* Расширенные фильтры */}
                {showFilters && (
                    <div className="advanced-filters">
                        <div className="filter-group">
                            <h4>Статус изучения</h4>
                            <div className="filter-buttons">
                                <button
                                    className={`filter-btn ${statusFilter === 'all' ? 'active' : ''}`}
                                    onClick={() => setStatusFilter('all')}
                                >
                                    🌐 Все
                                </button>
                                <button
                                    className={`filter-btn ${statusFilter === 'not-started' ? 'active' : ''}`}
                                    onClick={() => setStatusFilter('not-started')}
                                >
                                    ⭕ Не начато
                                </button>
                                <button
                                    className={`filter-btn ${statusFilter === 'in-progress' ? 'active' : ''}`}
                                    onClick={() => setStatusFilter('in-progress')}
                                >
                                    🔄 В процессе
                                </button>
                                <button
                                    className={`filter-btn ${statusFilter === 'completed' ? 'active' : ''}`}
                                    onClick={() => setStatusFilter('completed')}
                                >
                                    ✅ Изучено
                                </button>
                            </div>
                        </div>

                        <div className="filter-group">
                            <h4>Категории</h4>
                            <div className="category-filters">
                                <button
                                    className={`category-btn ${categoryFilter === 'all' ? 'active' : ''}`}
                                    onClick={() => setCategoryFilter('all')}
                                >
                                    🌐 Все
                                </button>
                                {categories.map(category => (
                                    <button
                                        key={category}
                                        className={`category-btn ${categoryFilter === category ? 'active' : ''}`}
                                        onClick={() => setCategoryFilter(category)}
                                    >
                                        {getCategoryIcon(category)} {getCategoryName(category)}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Управление выбором */}
            <div className="selection-controls">
                <div className="select-all">
                    <input
                        type="checkbox"
                        checked={selectedTechs.length === filteredTechnologies.length && filteredTechnologies.length > 0}
                        onChange={selectAllTechs}
                        className="select-checkbox"
                    />
                    <span className="select-label">
                        Выбрать все ({selectedTechs.length})
                    </span>
                </div>

                {selectedTechs.length > 0 && (
                    <button
                        onClick={() => setShowBulkActions(true)}
                        className="bulk-actions-btn"
                    >
                        Массовые действия ({selectedTechs.length})
                    </button>
                )}
            </div>

            {/* Список технологий */}
            {filteredTechnologies.length > 0 ? (
                <div className="technologies-grid">
                    {filteredTechnologies.map(tech => (
                        <div key={tech.id} className="technology-card-list">
                            <div className="card-header">
                                <div className="tech-meta">
                                    <span className="tech-category">
                                        {getCategoryIcon(tech.category)} {getCategoryName(tech.category)}
                                    </span>
                                    <span className={`tech-status ${tech.status}`}>
                                        {getStatusIcon(tech.status)} {getStatusName(tech.status)}
                                    </span>
                                </div>

                                <div className="tech-selection">
                                    <input
                                        type="checkbox"
                                        checked={selectedTechs.includes(tech.id)}
                                        onChange={() => toggleTechSelection(tech.id)}
                                        className="tech-checkbox"
                                    />
                                </div>

                                <h3 className="tech-title">{tech.title}</h3>
                                <p className="tech-description">{tech.description}</p>

                                <div className="tech-details">
                                    <div className="detail-item">
                                        <span className="detail-label">Добавлено:</span>
                                        <span className="detail-value">{formatDate(tech.createdAt)}</span>
                                    </div>
                                    {tech.lastUpdated && (
                                        <div className="detail-item">
                                            <span className="detail-label">Обновлено:</span>
                                            <span className="detail-value">{formatDate(tech.lastUpdated)}</span>
                                        </div>
                                    )}
                                    {tech.notes && tech.notes.trim() && (
                                        <div className="detail-item">
                                            <span className="detail-label">Заметки:</span>
                                            <span className="detail-value">
                                                {tech.notes.length > 50 ? tech.notes.substring(0, 50) + '...' : tech.notes}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="card-footer">
                                <div className="progress-indicator">
                                    <div className={`progress-circle ${tech.status}`}>
                                        {tech.status === 'completed' ? '100%' :
                                            tech.status === 'in-progress' ? '50%' : '0%'}
                                    </div>
                                </div>

                                <div className="card-actions">
                                    <Link to={`/technology/${tech.id}`} className="detail-link">
                                        Подробнее →
                                    </Link>
                                    <button
                                        onClick={() => {
                                            const newStatus =
                                                tech.status === 'not-started' ? 'in-progress' :
                                                    tech.status === 'in-progress' ? 'completed' : 'not-started';

                                            const updatedTechs = technologies.map(t =>
                                                t.id === tech.id
                                                    ? { ...t, status: newStatus, lastUpdated: new Date().toISOString() }
                                                    : t
                                            );
                                            localStorage.setItem('technologies', JSON.stringify(updatedTechs));
                                            setTechnologies(updatedTechs);
                                        }}
                                        className="quick-status-btn"
                                    >
                                        Сменить статус
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="empty-state">
                    <div className="empty-icon">📚</div>
                    <h2>Технологий не найдено</h2>
                    <p>
                        {searchQuery || statusFilter !== 'all' || categoryFilter !== 'all'
                            ? 'Попробуйте изменить параметры поиска или фильтры'
                            : 'Добавьте свою первую технологию для изучения'}
                    </p>
                    <Link to="/add-technology" className="btn-primary">
                        ➕ Добавить технологию
                    </Link>
                </div>
            )}
        </div>
    );
}

export default TechnologyList;