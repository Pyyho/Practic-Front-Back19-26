import useLocalStorage from './useLocalStorage';

// Начальные данные для технологий
const initialTechnologies = [
    {
        id: 1,
        title: 'React Components',
        description: 'Изучение функциональных и классовых компонентов, их жизненного цикла и лучших практик',
        status: 'not-started',
        notes: '',
        category: 'frontend'
    },
    {
        id: 2,
        title: 'JSX Syntax',
        description: 'Освоение синтаксиса JSX, работа с выражениями JavaScript в разметке',
        status: 'not-started',
        notes: '',
        category: 'frontend'
    },
    {
        id: 3,
        title: 'State Management',
        description: 'Работа с состоянием компонентов, использование хуков useState и useEffect',
        status: 'not-started',
        notes: '',
        category: 'frontend'
    },
    {
        id: 4,
        title: 'Props and Data Flow',
        description: 'Передача данных между компонентами через props, валидация пропсов',
        status: 'completed',
        notes: '',
        category: 'frontend'
    },
    {
        id: 5,
        title: 'Event Handling',
        description: 'Обработка событий в React, синтетические события',
        status: 'in-progress',
        notes: '',
        category: 'frontend'
    },
    {
        id: 6,
        title: 'Conditional Rendering',
        description: 'Условный рендеринг компонентов на основе состояния приложения',
        status: 'not-started',
        notes: '',
        category: 'frontend'
    },
    {
        id: 7,
        title: 'Node.js Basics',
        description: 'Основы серверного JavaScript, запуск сервера',
        status: 'not-started',
        notes: '',
        category: 'backend'
    },
    {
        id: 8,
        title: 'Express Framework',
        description: 'Создание REST API с использованием Express.js',
        status: 'not-started',
        notes: '',
        category: 'backend'
    }
];

function useTechnologies() {
    const [technologies, setTechnologies] = useLocalStorage('technologies', initialTechnologies);

    // Функция для обновления статуса технологии
    const updateStatus = (techId, newStatus) => {
        setTechnologies(prev =>
            prev.map(tech =>
                tech.id === techId ? { ...tech, status: newStatus } : tech
            )
        );
    };

    // Функция для обновления заметок
    const updateNotes = (techId, newNotes) => {
        setTechnologies(prev =>
            prev.map(tech =>
                tech.id === techId ? { ...tech, notes: newNotes } : tech
            )
        );
    };

    // Функция для отметки всех как выполненных
    const markAllCompleted = () => {
        setTechnologies(prev =>
            prev.map(tech => ({ ...tech, status: 'completed' }))
        );
    };

    // Функция для сброса всех статусов
    const resetAllStatuses = () => {
        setTechnologies(prev =>
            prev.map(tech => ({ ...tech, status: 'not-started' }))
        );
    };

    // Функция для расчета общего прогресса
    const calculateProgress = () => {
        if (technologies.length === 0) return 0;
        const completed = technologies.filter(tech => tech.status === 'completed').length;
        return Math.round((completed / technologies.length) * 100);
    };

    // Функция для получения технологий по категории
    const getTechnologiesByCategory = (category) => {
        if (category === 'all') return technologies;
        return technologies.filter(tech => tech.category === category);
    };

    // Функция для получения статистики по категориям
    const getCategoryStats = () => {
        const categories = ['frontend', 'backend'];
        return categories.map(category => {
            const categoryTechs = technologies.filter(tech => tech.category === category);
            const completed = categoryTechs.filter(tech => tech.status === 'completed').length;
            const progress = categoryTechs.length > 0 ? Math.round((completed / categoryTechs.length) * 100) : 0;
            
            return {
                category,
                total: categoryTechs.length,
                completed,
                progress
            };
        });
    };

    return {
        technologies,
        setTechnologies,
        updateStatus,
        updateNotes,
        markAllCompleted,
        resetAllStatuses,
        progress: calculateProgress(),
        getTechnologiesByCategory,
        getCategoryStats
    };
}

export default useTechnologies;