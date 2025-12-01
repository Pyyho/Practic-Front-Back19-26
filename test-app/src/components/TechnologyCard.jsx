function TechnologyCard({ title, description, status }) {
    return (
        <div className={`technology-card ${status}`}>
            <div className="card-header">
                <h3 className="card-title">{title}</h3>
                <span className={`status-badge ${status}`}>
                    {getStatusText(status)}
                </span>
            </div>
            <p className="card-description">{description}</p>
            <div className="progress-indicator">
                {renderProgressIndicator(status)}
            </div>
        </div>
    );
}

// Функция для получения текста статуса
function getStatusText(status) {
    const statusMap = {
        'completed': 'Изучено',
        'in-progress': 'В процессе',
        'not-started': 'Не начато'
    };
    return statusMap[status] || status;
}

// Функция для отображения индикатора прогресса
function renderProgressIndicator(status) {
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
}

export default TechnologyCard;