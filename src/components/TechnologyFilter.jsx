import './TechnologyFilter.css';

function TechnologyFilter({ activeFilter, setActiveFilter }) {
    const filters = [
        { id: 'all', label: 'Все', emoji: '🌐' },
        { id: 'not-started', label: 'Не начатые', emoji: '⭕' },
        { id: 'in-progress', label: 'В процессе', emoji: '🔄' },
        { id: 'completed', label: 'Изученные', emoji: '✅' }
    ];

    return (
        <div className="technology-filter">
            <h3>Фильтр по статусу</h3>
            <div className="filter-buttons">
                {filters.map(filter => (
                    <button
                        key={filter.id}
                        className={`filter-btn ${activeFilter === filter.id ? 'active' : ''}`}
                        onClick={() => setActiveFilter(filter.id)}
                        title={`Показать ${filter.label.toLowerCase()}`}
                    >
                        <span className="filter-emoji">{filter.emoji}</span>
                        <span className="filter-text">{filter.label}</span>
                    </button>
                ))}
            </div>
        </div>
    );
}

export default TechnologyFilter;