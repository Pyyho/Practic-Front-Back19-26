// src/components/RoadmapImporter.jsx
import { useState, useRef } from 'react';
import './RoadmapImporter.css';
import useTechnologiesApi from '../hooks/useTechnologiesApi';

function RoadmapImporter() {
    const { addTechnology, technologies } = useTechnologiesApi();
    const [importing, setImporting] = useState(false);
    const [importUrl, setImportUrl] = useState('');
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');
    const abortControllerRef = useRef(null);

    // Примеры публичных API
    const exampleApis = [
        { 
            name: 'Frontend Roadmap', 
            url: 'https://roadmap.sh/api/roadmaps/frontend',
            category: 'frontend'
        },
        { 
            name: 'Backend Roadmap', 
            url: 'https://roadmap.sh/api/roadmaps/backend',
            category: 'backend'
        },
        { 
            name: 'React Roadmap', 
            url: 'https://roadmap.sh/api/roadmaps/react',
            category: 'frontend'
        }
    ];

    const handleImportRoadmap = async (roadmapUrl, category = '') => {
        // Отменяем предыдущий запрос, если он есть
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }

        abortControllerRef.current = new AbortController();

        try {
            setImporting(true);
            setError(null);
            setSuccessMessage('');

            // Реальный запрос к API
            const response = await fetch(roadmapUrl, {
                signal: abortControllerRef.current.signal
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const roadmapData = await response.json();

            // Обработка данных в зависимости от структуры API
            let techNodes = [];
            
            // Обработка для roadmap.sh API
            if (roadmapData.data && Array.isArray(roadmapData.data)) {
                techNodes = roadmapData.data;
            } 
            // Альтернативный формат
            else if (roadmapData.nodes && Array.isArray(roadmapData.nodes)) {
                techNodes = roadmapData.nodes;
            }
            // Если данные в другом формате
            else if (roadmapData.technologies && Array.isArray(roadmapData.technologies)) {
                techNodes = roadmapData.technologies;
            } 
            else {
                // Пробуем найти любые данные, похожие на технологии
                const possibleKeys = Object.keys(roadmapData).find(key => 
                    Array.isArray(roadmapData[key]) && 
                    roadmapData[key].length > 0 &&
                    typeof roadmapData[key][0] === 'object'
                );
                
                if (possibleKeys) {
                    techNodes = roadmapData[possibleKeys];
                } else {
                    throw new Error('Не удалось распознать формат данных дорожной карты');
                }
            }

            if (techNodes.length === 0) {
                throw new Error('Дорожная карта пуста или не содержит технологий');
            }

            // Добавляем каждую технологию из дорожной карты
            let importedCount = 0;
            let skippedCount = 0;

            for (const node of techNodes) {
                try {
                    // Проверяем, не существует ли уже такая технология
                    const existingTech = technologies.find(tech => 
                        tech.title.toLowerCase() === (node.title || node.name || '').toLowerCase()
                    );

                    if (existingTech) {
                        skippedCount++;
                        continue;
                    }

                    // Создаем объект технологии
                    const techData = {
                        title: node.title || node.name || 'Неизвестная технология',
                        description: node.description || node.desc || 
                                   `Технология из дорожной карты ${category || 'разработки'}`,
                        category: category || node.category || 'other',
                        difficulty: determineDifficulty(node),
                        resources: extractResources(node),
                        status: 'not-started',
                        notes: node.notes || '',
                        tags: node.tags || [],
                        progress: 0
                    };

                    // Добавляем технологию
                    await addTechnology(techData);
                    importedCount++;

                } catch (err) {
                    console.error('Ошибка при импорте отдельной технологии:', err);
                    // Продолжаем импорт остальных
                }
            }

            // Формируем сообщение о результате
            let message = `✅ Импорт завершен!`;
            if (importedCount > 0) {
                message += ` Добавлено ${importedCount} новых технологий.`;
            }
            if (skippedCount > 0) {
                message += ` Пропущено ${skippedCount} дубликатов.`;
            }
            
            setSuccessMessage(message);
            
            // Сбрасываем URL если импорт был успешным
            if (importedCount > 0) {
                setImportUrl('');
            }

        } catch (err) {
            // Игнорируем ошибку отмены запроса
            if (err.name === 'AbortError') {
                console.log('Запрос отменен');
                return;
            }
            
            console.error('Ошибка импорта дорожной карты:', err);
            setError(`❌ Ошибка: ${err.message || 'Не удалось загрузить дорожную карту'}`);
        } finally {
            setImporting(false);
            abortControllerRef.current = null;
        }
    };

    // Вспомогательные функции
    const determineDifficulty = (node) => {
        if (node.level || node.difficulty) {
            const level = (node.level || node.difficulty).toLowerCase();
            if (level.includes('beginner') || level.includes('easy')) return 'beginner';
            if (level.includes('intermediate') || level.includes('medium')) return 'intermediate';
            if (level.includes('advanced') || level.includes('hard')) return 'advanced';
        }
        return 'intermediate';
    };

    const extractResources = (node) => {
        const resources = [];
        
        // Добавляем ссылки из разных полей
        if (node.links && Array.isArray(node.links)) {
            resources.push(...node.links);
        }
        
        if (node.url) {
            resources.push(node.url);
        }
        
        if (node.resources && Array.isArray(node.resources)) {
            resources.push(...node.resources);
        }
        
        // Дефолтные ресурсы если ничего не найдено
        if (resources.length === 0) {
            const title = encodeURIComponent(node.title || node.name || '');
            resources.push(`https://www.google.com/search?q=${title}+programming`);
            resources.push(`https://en.wikipedia.org/wiki/${title}`);
        }
        
        return resources;
    };

    const handleCustomImport = () => {
        if (!importUrl.trim()) {
            setError('❌ Введите URL дорожной карты');
            return;
        }
        
        // Проверяем, является ли URL валидным
        try {
            new URL(importUrl);
        } catch {
            setError('❌ Введите корректный URL');
            return;
        }
        
        handleImportRoadmap(importUrl);
    };

    const handleExampleImport = (apiUrl, category, name) => {
        setImportUrl(apiUrl);
        handleImportRoadmap(apiUrl, category);
    };

    const handleClear = () => {
        setImportUrl('');
        setError(null);
        setSuccessMessage('');
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
    };

    return (
        <div className="roadmap-importer">
            <h3>📥 Импорт дорожной карты из API</h3>
            
            <div className="import-controls">
                <div className="url-input-group">
                    <input
                        type="text"
                        placeholder="Введите URL API дорожной карты..."
                        value={importUrl}
                        onChange={(e) => {
                            setImportUrl(e.target.value);
                            setError(null);
                            setSuccessMessage('');
                        }}
                        className="import-input"
                        disabled={importing}
                    />
                    <button
                        onClick={handleCustomImport}
                        disabled={importing || !importUrl.trim()}
                        className="import-button"
                    >
                        {importing ? 'Импорт...' : 'Импорт'}
                    </button>
                </div>

                {/* Сообщения об ошибках и успехе */}
                {error && (
                    <div style={{
                        background: 'rgba(231, 76, 60, 0.1)',
                        border: '1px solid #e74c3c',
                        color: '#e74c3c',
                        padding: '10px 15px',
                        borderRadius: '6px',
                        fontSize: '0.9rem'
                    }}>
                        {error}
                    </div>
                )}
                
                {successMessage && (
                    <div style={{
                        background: 'rgba(46, 204, 113, 0.1)',
                        border: '1px solid #2ecc71',
                        color: '#2ecc71',
                        padding: '10px 15px',
                        borderRadius: '6px',
                        fontSize: '0.9rem'
                    }}>
                        {successMessage}
                    </div>
                )}

                <div className="import-actions">
                    <p>Или используйте пример:</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {exampleApis.map((api, index) => (
                            <button
                                key={index}
                                onClick={() => handleExampleImport(api.url, api.category, api.name)}
                                disabled={importing}
                                className="example-button"
                            >
                                {importing ? 'Импорт...' : `Импорт ${api.name}`}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="import-info">
                    <p>💡 Примеры публичных API для дорожных карт:</p>
                    <ul>
                        <li>https://roadmap.sh/api/roadmaps/frontend</li>
                        <li>https://roadmap.sh/api/roadmaps/backend</li>
                        <li>https://roadmap.sh/api/roadmaps/react</li>
                    </ul>
                    <p style={{ marginTop: '10px', fontSize: '0.85rem', opacity: 0.8 }}>
                        * Поддерживаются API в формате JSON. Технологии-дубликаты автоматически пропускаются.
                    </p>
                </div>
            </div>
        </div>
    );
}

export default RoadmapImporter;