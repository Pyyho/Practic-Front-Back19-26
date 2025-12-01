import './App.css';
import TechnologyCard from './components/TechnologyCard';
import ProgressHeader from './components/ProgressHeader';

function App() {
    // Тестовые данные
    const technologies = [
        { 
            id: 1, 
            title: 'React Components', 
            description: 'Изучение функциональных и классовых компонентов, их жизненного цикла и лучших практик', 
            status: 'completed' 
        },
        { 
            id: 2, 
            title: 'JSX Syntax', 
            description: 'Освоение синтаксиса JSX, работа с выражениями JavaScript в разметке', 
            status: 'in-progress' 
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
    ];

    return (
        <div className="App">
            <header className="App-header">
                <h1>🚀 Трекер изучения технологий</h1>
                <p>Отслеживайте ваш прогресс в изучении React и связанных технологий</p>
            </header>

            <ProgressHeader technologies={technologies} />
            
            <main className="technologies-container">
                <h2>Дорожная карта технологий</h2>
                <div className="technologies-grid">
                    {technologies.map(technology => (
                        <TechnologyCard
                            key={technology.id}
                            title={technology.title}
                            description={technology.description}
                            status={technology.status}
                        />
                    ))}
                </div>
            </main>
        </div>
    );
}

export default App;