import useLocalStorage from './useLocalStorage';

// Начальные данные для технологий
const initialTechnologies = [
    {
        id: 1,
        title: 'React Components',
        description: 'Изучение функциональных и классовых компонентов, их жизненного цикла и лучших практик',
        status: 'not-started',
        notes: '',
        category: 'frontend',
        addedDate: '9 дек. 2025 г.',
        updatedDate: '9 дек. 2025 г.',
        progress: 100
    },
    {
        id: 2,
        title: 'JSX Syntax',
        description: 'Освоение синтаксиса JSX, работа с выражениями JavaScript в разметке',
        status: 'not-started',
        notes: '',
        category: 'frontend',
        addedDate: 'Invalid Date',
        updatedDate: '6 дек. 2025 г.',
        progress: 0
    },
    {
        id: 3,
        title: 'State Management',
        description: 'Работа с состоянием компонентов, использование хуков useState и useEffect',
        status: 'not-started',
        notes: '',
        category: 'frontend',
        addedDate: 'Invalid Date',
        updatedDate: '6 дек. 2025 г.',
        progress: 0
    },
    {
        id: 4,
        title: 'Props and Data Flow',
        description: 'Передача данных между компонентами через props, валидация пропсов',
        status: 'completed',
        notes: '',
        category: 'frontend',
        addedDate: 'Invalid Date',
        updatedDate: '6 дек. 2025 г.',
        progress: 100
    },
    {
        id: 5,
        title: 'Event Handling',
        description: 'Обработка событий в React, синтетические события',
        status: 'in-progress',
        notes: '',
        category: 'frontend',
        addedDate: 'Invalid Date',
        updatedDate: '6 дек. 2025 г.',
        progress: 0
    },
    {
        id: 6,
        title: 'Conditional Rendering',
        description: 'Условный рендеринг компонентов на основе состояния приложения',
        status: 'not-started',
        notes: '',
        category: 'frontend',
        addedDate: 'Invalid Date',
        updatedDate: '6 дек. 2025 г.',
        progress: 100
    },
    {
        id: 7,
        title: 'Node.js Basics',
        description: 'Основы серверного JavaScript, запуск сервера',
        status: 'not-started',
        notes: '',
        category: 'backend',
        addedDate: 'Invalid Date',
        updatedDate: '6 дек. 2025 г.',
        progress: 100
    },
    {
        id: 8,
        title: 'Express Framework',
        description: 'Создание REST API с использованием Express.js',
        status: 'not-started',
        notes: '',
        category: 'backend',
        addedDate: 'Invalid Date',
        updatedDate: '6 дек. 2025 г.',
        progress: 0
    }
];

function useTechnologies() {
    // Используем localStorage для хранения данных
    const [technologies, setTechnologies] = useLocalStorage('technologies', initialTechnologies);

    // Проверяем, если в localStorage пусто, то инициализируем начальными данными
    React.useEffect(() => {
        if (!technologies || technologies.length === 0) {
            setTechnologies(initialTechnologies);
        }
    }, []);

    // Функция для обновления статуса технологии
    const updateStatus = (techId, newStatus) => {
        setTechnologies(prev =>
            prev.map(tech =>
                tech.id === techId ? { 
                    ...tech, 
                    status: newStatus,
                    updatedDate: new Date().toLocaleDateString('ru-RU', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                    })
                } : tech
            )
        );
    };

    // Функция для обновления заметок
    const updateNotes = (techId, newNotes) => {
        setTechnologies(prev =>
            prev.map(tech =>
                tech.id === techId ? { 
                    ...tech, 
                    notes: newNotes,
                    updatedDate: new Date().toLocaleDateString('ru-RU', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                    })
                } : tech
            )
        );
    };

    // Функция для добавления новой технологии
    const addTechnology = (newTech) => {
        const techToAdd = {
            ...newTech,
            id: Date.now(),
            addedDate: new Date().toLocaleDateString('ru-RU', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
            }),
            updatedDate: new Date().toLocaleDateString('ru-RU', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
            }),
            progress: newTech.status === 'completed' ? 100 : 0
        };
        
        setTechnologies(prev => [...prev, techToAdd]);
        return techToAdd;
    };

    // Функция для отметки всех как выполненных
    const markAllCompleted = () => {
        setTechnologies(prev =>
            prev.map(tech => ({ 
                ...tech, 
                status: 'completed',
                progress: 100,
                updatedDate: new Date().toLocaleDateString('ru-RU', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                })
            }))
        );
    };

    // Функция для сброса всех статусов
    const resetAllStatuses = () => {
        setTechnologies(prev =>
            prev.map(tech => ({ 
                ...tech, 
                status: 'not-started',
                progress: 0,
                updatedDate: new Date().toLocaleDateString('ru-RU', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                })
            }))
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
        const categories = ['frontend', 'backend', 'tools'];
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
        addTechnology,
        markAllCompleted,
        resetAllStatuses,
        progress: calculateProgress(),
        getTechnologiesByCategory,
        getCategoryStats
    };
}

export default useTechnologies;