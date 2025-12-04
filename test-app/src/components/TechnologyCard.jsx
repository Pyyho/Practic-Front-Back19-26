import { useState } from 'react';
import './TechnologyCard.css';

function TechnologyCard({ id, title, description, status, notes, onStatusChange, onNotesChange }) {
    // Состояние для отображения/скрытия заметок
    const [showNotes, setShowNotes] = useState(false);
    const [localNotes, setLocalNotes] = useState(notes || '');

    // Функция для обработки клика по карточке
    const handleCardClick = () => {
        // Определяем следующий статус в цикле
        const nextStatus = getNextStatus(status);
        // Вызываем функцию из props для обновления статуса
        onStatusChange(id, nextStatus);
    };

    // Функция для обработки клика по кнопке заметок (чтобы не менялся статус)
    const handleNotesClick = (e) => {
        e.stopPropagation();
        setShowNotes(!showNotes);
    };

    // Функция для обработки изменения заметок
    const handleNotesChange = (e) => {
        const newNotes = e.target.value;
        setLocalNotes(newNotes);
        onNotesChange(id, newNotes);
    };

    // Функция для получения следующего статуса
    const getNextStatus = (currentStatus) => {
        switch (currentStatus) {
            case 'not-started':
                return 'in-progress';
            case 'in-progress':
                return 'completed';
            case 'completed':
                return 'not-started';
            default:
                return 'not-started';
        }
    };

    // Функция для получения текста статуса
    const getStatusText = (status) => {
        const statusMap = {
            'completed': 'Изучено',
            'in-progress': 'В процессе',
            'not-started': 'Не начато'
        };
        return statusMap[status] || status;
    };

    // Функция для отображения индикатора прогресса
    const renderProgressIndicator = (status) => {
        switch (status) {
            case 'completed':
                return <div className="indicator completed">✓</div>;
            case 'in-progress':
                return <div className="indicator in-progress">⟳</div>;
            case 'not-started':
                return <div className="indicator not-started">○</div>;
            default:
                return null;
        }
    };

    return (
        <div 
            className={`technology-card ${status}`}
            onClick={handleCardClick}
            title="Кликните для изменения статуса"
        >
            <div className="card-header">
                <h3 className="card-title">{title}</h3>
                <span className={`status-badge ${status}`}>
                    {getStatusText(status)}
                </span>
            </div>
            <p className="card-description">{description}</p>
            
            {/* Кнопка для заметок */}
            <div className="notes-button-container">
                <button 
                    className="notes-toggle-btn"
                    onClick={handleNotesClick}
                    title={showNotes ? "Скрыть заметки" : "Показать заметки"}
                >
                    📝 {showNotes ? "Скрыть заметки" : "Мои заметки"}
                    {localNotes && <span className="notes-indicator"> •</span>}
                </button>
            </div>
            
            {/* Поле для заметок */}
            {showNotes && (
                <div className="notes-section" onClick={e => e.stopPropagation()}>
                    <textarea
                        className="notes-textarea"
                        value={localNotes}
                        onChange={handleNotesChange}
                        placeholder="Записывайте сюда важные моменты..."
                        rows="3"
                        onClick={e => e.stopPropagation()}
                    />
                    <div className="notes-hint">
                        {localNotes.length > 0 
                            ? `Заметка сохранена (${localNotes.length} символов)` 
                            : 'Добавьте заметку'}
                    </div>
                </div>
            )}
            
            <div className="progress-indicator">
                {renderProgressIndicator(status)}
                <span className="click-hint">Кликните для смены статуса →</span>
            </div>
        </div>
    );
}

export default TechnologyCard;