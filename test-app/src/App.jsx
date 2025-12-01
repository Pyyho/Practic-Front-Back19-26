import { useState } from 'react';
import './App.css';
import TechnologyCard from './components/TechnologyCard';
import ProgressHeader from './components/ProgressHeader';
import QuickActions from './components/QuickActions';
import TechnologyFilter from './components/TechnologyFilter';
import TechnologyCardWrapper from './components/TechnologyCardWrapper'; // Добавьте этот импорт

function App() {
    // Состояние для массива технологий
    const [technologies, setTechnologies] = useState([
        { 
            id: 1, 
            title: 'React Components', 
            description: 'Изучение функциональных и классовых компонентов, их жизненного цикла и лучших практик', 
            status: 'not-started' 
        },
        { 
            id: 2, 
            title: 'JSX Syntax', 
            description: 'Освоение синтаксиса JSX, работа с выражениями JavaScript в разметке', 
            status: 'not-started' 
        },
        { 
            id: 3, 
            title: 'State Management', 
            description: 'Работа с состоянием компонентов, использование хуков useState и useEffect', 
            status: 'not-started' 
        },
        { 
            id: 4, 
            title: 'Props and Data Flow', 
            description: 'Передача данных между компонентами через props, валидация пропсов', 
            status: 'completed' 
        },
        { 
            id: 5, 
            title: 'Event Handling', 
            description: 'Обработка событий в React, синтетические события', 
            status: 'in-progress' 
        },
        { 
            id: 6, 
            title: 'Conditional Rendering', 
            description: 'Условный рендеринг компонентов на основе состояния приложения', 
            status: 'not-started' 
        }
    ]);

    // Состояние для активного фильтра
    const [activeFilter, setActiveFilter] = useState('all');

    // Функция для изменения статуса технологии по id
    const updateTechnologyStatus = (id, newStatus) => {
        setTechnologies(prevTechnologies => 
            prevTechnologies.map(tech => 
                tech.id === id 
                    ? { ...tech, status: newStatus }
                    : tech
            )
        );
    };

    // Функция для фильтрации технологий
    const getFilteredTechnologies = () => {
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

    const filteredTechnologies = getFilteredTechnologies();

    return (
        <div className="App">
            <header className="App-header">
                <h1>🚀 Трекер изучения технологий</h1>
                <p>Кликайте на карточки для изменения статуса изучения</p>
            </header>

            <ProgressHeader technologies={technologies} />
            
            <QuickActions 
                technologies={technologies}
                setTechnologies={setTechnologies}
            />
            
            <TechnologyFilter 
                activeFilter={activeFilter}
                setActiveFilter={setActiveFilter}
            />
            
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
                                onStatusChange={updateTechnologyStatus}
                            />
                        </TechnologyCardWrapper>
                    ))}
                    
                    {filteredTechnologies.length === 0 && (
                        <div className="no-results">
                            <p>🚫 Нет технологий с выбранным фильтром</p>
                            <p>Попробуйте выбрать другой фильтр или измените статусы технологий</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}

export default App;