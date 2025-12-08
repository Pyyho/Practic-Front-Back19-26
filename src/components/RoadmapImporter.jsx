// src/components/RoadmapImporter.jsx
import { useState } from 'react';
import './RoadmapImporter.css';
import useTechnologiesApi from '../hooks/useTechnologiesApi';

function RoadmapImporter() {
    const { addTechnology } = useTechnologiesApi();
    const [importing, setImporting] = useState(false);
    const [importUrl, setImportUrl] = useState('');

    const handleImportRoadmap = async (roadmapUrl) => {
        try {
            setImporting(true);

            // Имитация загрузки дорожной карты из API
            // В реальном приложении здесь будет реальный запрос
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Мок данные для примера - фронтенд дорожная карта
            const roadmapData = {
                technologies: [
                    {
                        title: 'HTML5',
                        description: 'Стандарт разметки веб-страниц',
                        category: 'frontend',
                        difficulty: 'beginner',
                        resources: ['https://developer.mozilla.org/ru/docs/Web/HTML']
                    },
                    {
                        title: 'CSS3',
                        description: 'Каскадные таблицы стилей',
                        category: 'frontend',
                        difficulty: 'beginner',
                        resources: ['https://developer.mozilla.org/ru/docs/Web/CSS']
                    },
                    {
                        title: 'JavaScript ES6+',
                        description: 'Современный JavaScript с новыми возможностями',
                        category: 'frontend',
                        difficulty: 'intermediate',
                        resources: ['https://developer.mozilla.org/ru/docs/Web/JavaScript']
                    }
                ]
            };

            // Добавляем каждую технологию из дорожной карты
            let importedCount = 0;
            for (const tech of roadmapData.technologies) {
                await addTechnology(tech);
                importedCount++;
            }

            alert(`Успешно импортировано ${importedCount} технологий из дорожной карты`);
            setImportUrl('');

        } catch (err) {
            alert(`Ошибка импорта: ${err.message}`);
        } finally {
            setImporting(false);
        }
    };

    const handleExampleImport = () => {
        handleImportRoadmap('https://api.example.com/roadmaps/frontend');
    };

    const handleCustomImport = () => {
        if (!importUrl.trim()) {
            alert('Введите URL дорожной карты');
            return;
        }
        handleImportRoadmap(importUrl);
    };

    return (
        <div className="roadmap-importer">
            <h3>📥 Импорт дорожной карты</h3>
            
            <div className="import-controls">
                <div className="url-input-group">
                    <input
                        type="text"
                        placeholder="Введите URL дорожной карты..."
                        value={importUrl}
                        onChange={(e) => setImportUrl(e.target.value)}
                        className="import-input"
                    />
                    <button
                        onClick={handleCustomImport}
                        disabled={importing || !importUrl.trim()}
                        className="import-button"
                    >
                        {importing ? 'Импорт...' : 'Импорт'}
                    </button>
                </div>
                
                <div className="import-actions">
                    <p>Или используйте пример:</p>
                    <button
                        onClick={handleExampleImport}
                        disabled={importing}
                        className="example-button"
                    >
                        {importing ? 'Импорт...' : 'Импорт пример дорожной карты (Frontend)'}
                    </button>
                </div>
            </div>
            
            <div className="import-info">
                <p>💡 Примеры публичных API для дорожных карт:</p>
                <ul>
                    <li>https://api.roadmap.sh/v1/roadmaps/frontend</li>
                    <li>https://api.roadmap.sh/v1/roadmaps/backend</li>
                </ul>
            </div>
        </div>
    );
}

export default RoadmapImporter;