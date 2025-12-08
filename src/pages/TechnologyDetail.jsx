import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import ProgressBar from '../components/ProgressBar';
import './TechnologyDetail.css';

function TechnologyDetail() {
    const { techId } = useParams();
    const navigate = useNavigate();
    const [technology, setTechnology] = useState(null);
    const [isEditingNotes, setIsEditingNotes] = useState(false);
    const [editedNotes, setEditedNotes] = useState('');

    useEffect(() => {
        const saved = localStorage.getItem('technologies');
        if (saved) {
            const technologies = JSON.parse(saved);
            const tech = technologies.find(t => t.id === parseInt(techId));
            setTechnology(tech);
            setEditedNotes(tech?.notes || '');
        }
    }, [techId]);

    const updateStatus = (newStatus) => {
        const saved = localStorage.getItem('technologies');
        if (saved) {
            const technologies = JSON.parse(saved);
            const updated = technologies.map(tech =>
                tech.id === parseInt(techId) ? { ...tech, status: newStatus } : tech
            );
            localStorage.setItem('technologies', JSON.stringify(updated));
            setTechnology({ ...technology, status: newStatus });
        }
    };

    const saveNotes = () => {
        const saved = localStorage.getItem('technologies');
        if (saved) {
            const technologies = JSON.parse(saved);
            const updated = technologies.map(tech =>
                tech.id === parseInt(techId) ? { ...tech, notes: editedNotes } : tech
            );
            localStorage.setItem('technologies', JSON.stringify(updated));
            setTechnology({ ...technology, notes: editedNotes });
            setIsEditingNotes(false);
        }
    };

    const deleteTechnology = () => {
        if (window.confirm('Вы уверены, что хотите удалить эту технологию? Это действие нельзя отменить.')) {
            const saved = localStorage.getItem('technologies');
            if (saved) {
                const technologies = JSON.parse(saved);
                const updated = technologies.filter(tech => tech.id !== parseInt(techId));
                localStorage.setItem('technologies', JSON.stringify(updated));
                navigate('/technologies');
            }
        }
    };

    if (!technology) {
        return (
            <div className="not-found">
                <h1>🚫 Технология не найдена</h1>
                <p>Технология с ID {techId} не существует или была удалена.</p>
                <Link to="/technologies" className="back-btn">
                    ← Вернуться к списку
                </Link>
            </div>
        );
    }

    // Функции для отображения
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

    const getNextStatus = () => {
        switch (technology.status) {
            case 'not-started': return 'in-progress';
            case 'in-progress': return 'completed';
            case 'completed': return 'not-started';
            default: return 'not-started';
        }
    };

    const getNextStatusName = () => {
        const nextStatus = getNextStatus();
        switch (nextStatus) {
            case 'completed': return 'Изучено';
            case 'in-progress': return 'В процессе';
            case 'not-started': return 'Не начато';
            default: return nextStatus;
        }
    };

    const getCategoryIcon = (category) => {
        switch (category) {
            case 'frontend': return '🎨';
            case 'backend': return '⚙️';
            default: return '📁';
        }
    };

    const getCategoryName = (category) => {
        switch (category) {
            case 'frontend': return 'Фронтенд';
            case 'backend': return 'Бэкенд';
            default: return category;
        }
    };

    const handleStatusChange = () => {
        updateStatus(getNextStatus());
    };

    return (
        <div className="technology-detail-page">
            <div className="detail-header">
                <Link to="/technologies" className="back-link">
                    ← Назад к списку
                </Link>
                <div className="header-actions">
                    <button onClick={handleStatusChange} className="change-status-btn">
                        Сменить статус
                    </button>
                    <button onClick={deleteTechnology} className="delete-btn">
                        🗑️ Удалить
                    </button>
                </div>
            </div>

            <div className="detail-content">
                <div className="main-info">
                    <div className="tech-header">
                        <div className="tech-meta">
                            <span className="category-badge">
                                {getCategoryIcon(technology.category)} {getCategoryName(technology.category)}
                            </span>
                            <span className={`status-badge ${technology.status}`}>
                                {getStatusIcon(technology.status)} {getStatusName(technology.status)}
                            </span>
                        </div>
                        <h1 className="color-text">{technology.title}</h1>
                        <p className="creation-date">
                            Добавлено: {new Date().toLocaleDateString('ru-RU')}
                        </p>
                    </div>

                    <div className="description-section">
                        <h2 className="color-text">📝 Описание</h2>
                        <p className="tech-description">{technology.description}</p>
                    </div>

                    <div className="status-section">
                        <h2 className="color-text">📊 Статус изучения</h2>
                        <div className="status-indicator">
                            <div className="status-visual">
                                <div className="status-circle-container">
                                    <div className={`status-circle ${technology.status}`}>
                                        {getStatusIcon(technology.status)}
                                    </div>
                                    <p className="status-circle-label">{getStatusName(technology.status)}</p>
                                </div>

                                <div className="status-info">
                                    <h3>Текущий статус</h3>
                                    <p className="status-description">
                                        {technology.status === 'completed' ? 'Технология полностью изучена' :
                                            technology.status === 'in-progress' ? 'В процессе изучения' :
                                                'Изучение еще не начато'}
                                    </p>

                                    <div className="status-actions">
                                        <button onClick={handleStatusChange} className="status-change-btn">
                                            Сменить на {getNextStatusName()} →
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="status-progress">
                                <ProgressBar
                                    progress={
                                        technology.status === 'completed' ? 100 :
                                            technology.status === 'in-progress' ? 50 : 0
                                    }
                                    height={20}
                                    color={
                                        technology.status === 'completed' ? '#4CAF50' :
                                            technology.status === 'in-progress' ? '#FF9800' : '#f44336'
                                    }
                                    animated={technology.status === 'in-progress'}
                                    showPercentage={false}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="sidebar">
                    <div className="notes-section">
                        <div className="notes-header">
                            <h2>📝 Мои заметки</h2>
                            <button
                                onClick={() => setIsEditingNotes(!isEditingNotes)}
                                className="edit-notes-btn"
                            >
                                {isEditingNotes ? '❌ Отмена' : '✏️ Редактировать'}
                            </button>
                        </div>

                        {isEditingNotes ? (
                            <div className="notes-editor">
                                <textarea
                                    value={editedNotes}
                                    onChange={(e) => setEditedNotes(e.target.value)}
                                    placeholder="Записывайте сюда важные моменты изучения..."
                                    rows="6"
                                />
                                <div className="editor-actions">
                                    <button onClick={saveNotes} className="save-btn">
                                        💾 Сохранить
                                    </button>
                                    <button onClick={() => setIsEditingNotes(false)} className="cancel-btn">
                                        Отмена
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="notes-content">
                                {technology.notes && technology.notes.trim() ? (
                                    <p className="notes-text">{technology.notes}</p>
                                ) : (
                                    <p className="no-notes">Заметок пока нет. Добавьте свои мысли!</p>
                                )}
                                {technology.notes && (
                                    <div className="notes-stats">
                                        <span className="char-count">
                                            {technology.notes.length} символов
                                        </span>
                                        <span className="word-count">
                                            {technology.notes.split(/\s+/).filter(w => w.length > 0).length} слов
                                        </span>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="quick-actions-sidebar">
                        <h3>⚡ Быстрые действия</h3>
                        <div className="sidebar-buttons">
                            <button onClick={handleStatusChange} className="sidebar-btn">
                                🔄 Сменить статус
                            </button>
                            <Link to={`/technology/${techId}/edit`} className="sidebar-btn">
                                ✏️ Редактировать
                            </Link>
                            <button onClick={() => setIsEditingNotes(true)} className="sidebar-btn">
                                📝 Добавить заметку
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TechnologyDetail;