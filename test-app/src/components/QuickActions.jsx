import './QuickActions.css';

function QuickActions({ technologies, setTechnologies }) {
    // Отметить все как выполненные
    const markAllCompleted = () => {
        setTechnologies(prev => 
            prev.map(tech => ({ ...tech, status: 'completed' }))
        );
    };

    // Сбросить все статусы
    const resetAllStatuses = () => {
        setTechnologies(prev => 
            prev.map(tech => ({ ...tech, status: 'not-started' }))
        );
    };

    // Случайный выбор следующей технологии
    const randomNextTechnology = () => {
        const notStarted = technologies.filter(tech => tech.status === 'not-started');
        if (notStarted.length === 0) return;
        
        const randomTech = notStarted[Math.floor(Math.random() * notStarted.length)];
        const updatedTechs = technologies.map(tech => 
            tech.id === randomTech.id 
                ? { ...tech, status: 'in-progress' }
                : tech
        );
        setTechnologies(updatedTechs);
        
        // Прокрутка к выбранной технологии
        const element = document.getElementById(`tech-${randomTech.id}`);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    };

    return (
        <div className="quick-actions">
            <h3>Быстрые действия</h3>
            <div className="action-buttons">
                <button 
                    className="action-btn complete-all"
                    onClick={markAllCompleted}
                    disabled={technologies.every(tech => tech.status === 'completed')}
                >
                    ✅ Отметить все как выполненные
                </button>
                
                <button 
                    className="action-btn reset-all"
                    onClick={resetAllStatuses}
                    disabled={technologies.every(tech => tech.status === 'not-started')}
                >
                    🔄 Сбросить все статусы
                </button>
                
                <button 
                    className="action-btn random-next"
                    onClick={randomNextTechnology}
                    disabled={technologies.filter(tech => tech.status === 'not-started').length === 0}
                >
                    🎲 Случайная следующая технология
                </button>
            </div>
        </div>
    );
}

export default QuickActions;