import { useState, useEffect } from 'react';
import './App.css';
import TechnologyCard from './components/TechnologyCard';
import ProgressHeader from './components/ProgressHeader';
import QuickActions from './components/QuickActions';
import TechnologyFilter from './components/TechnologyFilter';
import TechnologyCardWrapper from './components/TechnologyCardWrapper';

function App() {
    // Состояние для массива технологий
    const [technologies, setTechnologies] = useState([
        {
            id: 1,
            title: 'React Components',
            description: 'Изучение функциональных и классовых компонентов, их жизненного цикла и лучших практик',
            status: 'not-started',
            notes: '' // Новое поле для заметок
        },
        {
            id: 2,
            title: 'JSX Syntax',
            description: 'Освоение синтаксиса JSX, работа с выражениями JavaScript в разметке',
            status: 'not-started',
            notes: ''
        },
        {
            id: 3,
            title: 'State Management',
            description: 'Работа с состоянием компонентов, использование хуков useState и useEffect',
            status: 'not-started',
            notes: ''
        },
        {
            id: 4,
            title: 'Props and Data Flow',
            description: 'Передача данных между компонентами через props, валидация пропсов',
            status: 'completed',
            notes: ''
        },
        {
            id: 5,
            title: 'Event Handling',
            description: 'Обработка событий в React, синтетические события',
            status: 'in-progress',
            notes: ''
        },
        {
            id: 6,
            title: 'Conditional Rendering',
            description: 'Условный рендеринг компонентов на основе состояния приложения',
            status: 'not-started',
            notes: ''
        }
    ]);

    // Состояние для активного фильтра
    const [activeFilter, setActiveFilter] = useState('all');
    // Состояние для поискового запроса
    const [searchQuery, setSearchQuery] = useState('');

    // Сохраняем технологии в localStorage при любом изменении
    useEffect(() => {
        localStorage.setItem('techTrackerData', JSON.stringify(technologies));
        console.log('Данные сохранены в localStorage');
    }, [technologies]);

    // Загружаем данные из localStorage при первом рендере
    useEffect(() => {
        const saved = localStorage.getItem('techTrackerData');
        if (saved) {
            try {
                const parsedData = JSON.parse(saved);
                setTechnologies(parsedData);
                console.log('Данные загружены из localStorage');
            } catch (error) {
                console.error('Ошибка при загрузке данных из localStorage:', error);
            }
        }
    }, []);

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

    // Функция для изменения заметок технологии
    const updateTechnologyNotes = (id, newNotes) => {
        setTechnologies(prevTechnologies =>
            prevTechnologies.map(tech =>
                tech.id === id
                    ? { ...tech, notes: newNotes }
                    : tech
            )
        );
    };

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

    // Функция для фильтрации технологий по поисковому запросу
    const getFilteredTechnologies = () => {
        const statusFiltered = getFilteredByStatus();

        if (!searchQuery.trim()) {
            return statusFiltered;
        }

        const query = searchQuery.toLowerCase();
        return statusFiltered.filter(tech =>
            tech.title.toLowerCase().includes(query) ||
            tech.description.toLowerCase().includes(query) ||
            tech.notes.toLowerCase().includes(query)
        );
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

            {/* Поле поиска */}
            <div className="search-box">
                <input
                    type="text"
                    placeholder="🔍 Поиск технологий по названию, описанию или заметкам..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <span className="search-results-count">
                    Найдено: {filteredTechnologies.length}
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
                                onStatusChange={updateTechnologyStatus}
                                onNotesChange={updateTechnologyNotes}
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