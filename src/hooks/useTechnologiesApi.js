// src/hooks/useTechnologiesApi.js - ВЕРСИЯ С РЕАЛЬНЫМ API
import { useState, useEffect, useCallback } from 'react';

function useTechnologiesApi() {
    const [technologies, setTechnologies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const API_URL = 'https://api.github.com/search/repositories?q=topic:react';
    const USE_MOCK_DATA = true;

    const fetchTechnologies = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            if (USE_MOCK_DATA) {
                // Моковые данные для демонстрации (как сейчас)
                await new Promise(resolve => setTimeout(resolve, 1000));
                const mockTechnologies = [/* твои моковые данные */];
                setTechnologies(mockTechnologies);
            } else {
                // РЕАЛЬНЫЙ ЗАПРОС К API
                const response = await fetch(`${API_URL}/posts`);

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();

                // Преобразуем данные API в формат твоего приложения
                const transformedData = data.slice(0, 10).map((item, index) => ({
                    id: item.id,
                    title: item.title,
                    description: item.body.substring(0, 100),
                    category: ['frontend', 'backend', 'tools'][index % 3],
                    difficulty: ['beginner', 'intermediate', 'advanced'][index % 3],
                    resources: [`https://jsonplaceholder.typicode.com/posts/${item.id}`],
                    status: 'not-started',
                    progress: 0,
                    createdAt: new Date().toISOString()
                }));

                setTechnologies(transformedData);
            }

        } catch (err) {
            setError(`Не удалось загрузить технологии: ${err.message}`);
            console.error('Ошибка загрузки:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    // Добавление новой технологии
    const addTechnology = async (techData) => {
        try {
            setLoading(true);

            if (USE_MOCK_DATA) {
                // Моковый ответ
                await new Promise(resolve => setTimeout(resolve, 500));
                const newTech = {
                    id: Date.now(),
                    ...techData,
                    createdAt: new Date().toISOString(),
                    progress: 0
                };
                setTechnologies(prev => [...prev, newTech]);
                return newTech;
            } else {
                // РЕАЛЬНЫЙ POST запрос к API
                const response = await fetch(`${API_URL}/posts`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(techData)
                });

                if (!response.ok) {
                    throw new Error('Ошибка при добавлении технологии');
                }

                const savedTech = await response.json();

                // Обновляем локальное состояние
                setTechnologies(prev => [...prev, {
                    id: savedTech.id || Date.now(),
                    ...techData,
                    createdAt: new Date().toISOString()
                }]);

                return savedTech;
            }

        } catch (err) {
            throw new Error(`Не удалось добавить технологию: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    // Загружаем технологии при монтировании
    useEffect(() => {
        fetchTechnologies();
    }, [fetchTechnologies]);

    return {
        technologies,
        loading,
        error,
        refetch: fetchTechnologies,
        addTechnology,
        updateTechnology, // нужно будет реализовать
        deleteTechnology  // нужно будет реализовать
    };
}

export default useTechnologiesApi;