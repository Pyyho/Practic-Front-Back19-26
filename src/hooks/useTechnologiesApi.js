// src/hooks/useTechnologiesApi.js

import { useState, useEffect } from 'react';



function useTechnologiesApi() {

    const [technologies, setTechnologies] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState(null);



    // Загрузка технологий из API

    const fetchTechnologies = async () => {

        try {

            setLoading(true);

            setError(null);



            // В реальном приложении здесь будет запрос к вашему API

            // Сейчас имитируем загрузку с задержкой

            await new Promise(resolve => setTimeout(resolve, 1000));



            // Мок данные - в реальном приложении замените на реальный API

            const mockTechnologies = [

                {

                    id: 1,

                    title: 'React',

                    description: 'Библиотека для создания пользовательских интерфейсов',

                    category: 'frontend',

                    difficulty: 'beginner',

                    resources: ['https://react.dev', 'https://ru.reactjs.org'],

                    progress: 0

                },

                {

                    id: 2,

                    title: 'Node.js',

                    description: 'Среда выполнения JavaScript на сервере',

                    category: 'backend',

                    difficulty: 'intermediate',

                    resources: ['https://nodejs.org', 'https://nodejs.org/ru/docs/'],

                    progress: 0

                },

                {

                    id: 3,

                    title: 'Typescript',

                    description: 'Типизированное надмножество JavaScript',

                    category: 'language',

                    difficulty: 'intermediate',

                    resources: ['https://www.typescriptlang.org'],

                    progress: 0

                }

            ];



            setTechnologies(mockTechnologies);



        } catch (err) {

            setError('Не удалось загрузить технологии');

            console.error('Ошибка загрузки:', err);

        } finally {

            setLoading(false);

        }

    };



    // Добавление новой технологии

    const addTechnology = async (techData) => {

        try {

            // Имитация API запроса

            await new Promise(resolve => setTimeout(resolve, 500));



            const newTech = {

                id: Date.now(), // В реальном приложении ID генерируется на сервере

                ...techData,

                createdAt: new Date().toISOString(),

                progress: 0

            };



            setTechnologies(prev => [...prev, newTech]);

            return newTech;



        } catch (err) {

            throw new Error('Не удалось добавить технологию');

        }

    };



    // Обновление технологии

    const updateTechnology = async (id, updatedData) => {

        try {

            await new Promise(resolve => setTimeout(resolve, 300));



            setTechnologies(prev =>

                prev.map(tech =>

                    tech.id === id ? { ...tech, ...updatedData } : tech

                )

            );



            return true;

        } catch (err) {

            throw new Error('Не удалось обновить технологию');

        }

    };



    // Удаление технологии

    const deleteTechnology = async (id) => {

        try {

            await new Promise(resolve => setTimeout(resolve, 300));



            setTechnologies(prev => prev.filter(tech => tech.id !== id));

            return true;

        } catch (err) {

            throw new Error('Не удалось удалить технологию');

        }

    };



    // Загружаем технологии при монтировании

    useEffect(() => {

        fetchTechnologies();

    }, []);



    return {

        technologies,

        loading,

        error,

        refetch: fetchTechnologies,

        addTechnology,

        updateTechnology,

        deleteTechnology

    };

}



export default useTechnologiesApi;