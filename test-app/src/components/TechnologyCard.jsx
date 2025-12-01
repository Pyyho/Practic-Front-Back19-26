function TechnologyCard({ id, title, description, status, onStatusChange }) {
    // Функция для обработки клика по карточке
    const handleClick = () => {
        // Определяем следующий статус в цикле
        const nextStatus = getNextStatus(status);
        // Вызываем функцию из props для обновления статуса
        onStatusChange(id, nextStatus);
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
            onClick={handleClick}
            title="Кликните для изменения статуса"
        >
            <div className="card-header">
                <h3 className="card-title">{title}</h3>
                <span className={`status-badge ${status}`}>
                    {getStatusText(status)}
                </span>
            </div>
            <p className="card-description">{description}</p>
            <div className="progress-indicator">
                {renderProgressIndicator(status)}
                <span className="click-hint">Кликните для смены статуса →</span>
            </div>
        </div>
    );
}

export default TechnologyCard;