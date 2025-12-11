import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AddTechnology.css';

function AddTechnology() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: 'frontend',
        status: 'not-started',
        priority: 'medium',
        resources: '',
        notes: '',
        tags: ''
    });

    const [errors, setErrors] = useState({});

    const validateForm = () => {
        const newErrors = {};

        if (!formData.title.trim()) {
            newErrors.title = 'Название обязательно';
        } else if (formData.title.length > 100) {
            newErrors.title = 'Название слишком длинное (макс. 100 символов)';
        }

        if (!formData.description.trim()) {
            newErrors.description = 'Описание обязательно';
        } else if (formData.description.length > 500) {
            newErrors.description = 'Описание слишком длинное (макс. 500 символов)';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        const saved = localStorage.getItem('technologies');
        const technologies = saved ? JSON.parse(saved) : [];

        // Обрабатываем ресурсы и теги
        const resourcesArray = formData.resources
            .split(',')
            .map(res => res.trim())
            .filter(res => res.length > 0);

        const tagsArray = formData.tags
            .split(',')
            .map(tag => tag.trim())
            .filter(tag => tag.length > 0);

        const newTechnology = {
            id: Date.now(),
            title: formData.title.trim(),
            description: formData.description.trim(),
            category: formData.category,
            status: formData.status,
            priority: formData.priority,
            resources: resourcesArray,
            notes: formData.notes.trim(),
            tags: tagsArray,
            createdAt: new Date().toISOString(),
            // Добавляем читаемую дату для отображения
            addedDate: new Date().toLocaleDateString('ru-RU', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            }),
            // Автоматический прогресс в зависимости от статуса
            progress: formData.status === 'not-started' ? 0 :
                formData.status === 'in-progress' ? 50 :
                    formData.status === 'completed' ? 100 : 25
        };

        const updatedTechnologies = [...technologies, newTechnology];
        localStorage.setItem('technologies', JSON.stringify(updatedTechnologies));

        alert('✅ Технология успешно добавлена!');
        setTimeout(() => navigate('/technologies'), 500);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Очищаем ошибку при изменении поля
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'not-started': return '⭕';
            case 'in-progress': return '🔄';
            case 'learning': return '📚';
            case 'completed': return '✅';
            case 'review': return '🔍';
            default: return '⭕';
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'low': return '#3b82f6'; // blue
            case 'medium': return '#f59e0b'; // amber
            case 'high': return '#ef4444'; // red
            default: return '#6b7280';
        }
    };

    return (
        <div className="add-technology-page">
            <div className="page-header">
                <h1>➕ Добавить новую технологию</h1>
                <p>Заполните форму для добавления новой технологии для изучения</p>
            </div>

            <form onSubmit={handleSubmit} className="add-tech-form">
                <div className="form-section">
                    <h2 className="color-text">📋 Основная информация</h2>

                    <div className="form-group">
                        <label className="color-text" htmlFor="title">
                            🏷️ Название технологии *
                        </label>
                        <input
                            id="title"
                            name="title"
                            type="text"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="Например: React Hooks, TypeScript, Node.js"
                            className={errors.title ? 'error' : ''}
                            required
                        />
                        {errors.title && <span className="error-message">{errors.title}</span>}
                        <small>Максимум 100 символов</small>
                    </div>

                    <div className="form-group">
                        <label className="color-text" htmlFor="description">
                            📝 Описание *
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Опишите, что это за технология, какие задачи решает, где применяется..."
                            rows="4"
                            className={errors.description ? 'error' : ''}
                            required
                        />
                        {errors.description && <span className="error-message">{errors.description}</span>}
                        <small>Максимум 500 символов</small>
                    </div>
                </div>

                <div className="form-section">
                    <h2 className="color-text">🏷️ Классификация</h2>

                    <div className="form-row">
                        <div className="form-group">
                            <label className="color-text" htmlFor="category">
                                🎯 Категория
                            </label>
                            <select
                                id="category"
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                            >
                                <option value="frontend">🎨 Фронтенд разработка</option>
                                <option value="backend">⚙️ Бэкенд разработка</option>
                                <option value="language">🔤 Языки программирования</option>
                                <option value="tools">🛠️ Инструменты</option>
                                <option value="database">🗄️ Базы данных</option>
                                <option value="devops">🚀 DevOps</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label className="color-text" htmlFor="priority">
                                🎯 Приоритет изучения
                            </label>
                            <select
                                id="priority"
                                name="priority"
                                value={formData.priority}
                                onChange={handleChange}
                                style={{
                                    borderLeftColor: getPriorityColor(formData.priority),
                                    borderLeftWidth: '4px'
                                }}
                            >
                                <option value="low">🔵 Низкий приоритет</option>
                                <option value="medium">🟡 Средний приоритет</option>
                                <option value="high">🔴 Высокий приоритет</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label className="color-text" htmlFor="status">
                                📊 Статус изучения
                            </label>
                            <select
                                id="status"
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                            >
                                <option value="not-started">⭕ Не начато</option>
                                <option value="in-progress">🔄 В процессе</option>
                                <option value="learning">📚 Изучается</option>
                                <option value="completed">✅ Изучено</option>
                                <option value="review">🔍 На повторении</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label className="color-text" htmlFor="tags">
                                🏷️ Теги
                            </label>
                            <input
                                id="tags"
                                name="tags"
                                type="text"
                                value={formData.tags}
                                onChange={handleChange}
                                placeholder="React, JavaScript, Web, API"
                            />
                            <small>Укажите теги через запятую</small>
                        </div>
                    </div>
                </div>

                <div className="form-section">
                    <h2 className="color-text">🔗 Ресурсы и ссылки</h2>

                    <div className="form-group">
                        <label className="color-text" htmlFor="resources">
                            📚 Полезные ресурсы
                        </label>
                        <textarea
                            id="resources"
                            name="resources"
                            value={formData.resources}
                            onChange={handleChange}
                            placeholder="https://react.dev/docs, https://github.com/facebook/react, https://youtube.com/playlist..."
                            rows="3"
                        />
                        <small>Укажите ссылки на документацию, видеоуроки, статьи. Разделяйте запятыми или новой строкой</small>
                    </div>
                </div>

                <div className="form-section">
                    <h2 className="color-text">📝 Дополнительная информация</h2>

                    <div className="form-group">
                        <label className="color-text" htmlFor="notes">
                            📌 Ваши заметки
                        </label>
                        <textarea
                            id="notes"
                            name="notes"
                            value={formData.notes}
                            onChange={handleChange}
                            placeholder="Добавьте свои мысли, план изучения, важные моменты, сроки..."
                            rows="4"
                        />
                        <small>Необязательное поле. Можно добавить позже</small>
                    </div>
                </div>

                <div className="form-preview">
                    <h2 className="color-text">👁️ Предпросмотр</h2>
                    <div className="preview-card">
                        <div className="preview-header">
                            <span className="preview-category">
                                {formData.category === 'frontend' && '🎨 Фронтенд'}
                                {formData.category === 'backend' && '⚙️ Бэкенд'}
                                {formData.category === 'language' && '🔤 Язык'}
                                {formData.category === 'tools' && '🛠️ Инструмент'}
                                {formData.category === 'database' && '🗄️ База данных'}
                                {formData.category === 'devops' && '🚀 DevOps'}
                            </span>
                            <span className="preview-status" style={{
                                color: formData.status === 'completed' ? '#10b981' :
                                    formData.status === 'in-progress' ? '#f59e0b' : '#6b7280'
                            }}>
                                {getStatusIcon(formData.status)} {formData.status === 'not-started' && 'Не начато'}
                                {formData.status === 'in-progress' && 'В процессе'}
                                {formData.status === 'learning' && 'Изучается'}
                                {formData.status === 'completed' && 'Изучено'}
                                {formData.status === 'review' && 'На повторении'}
                            </span>
                        </div>
                        <h3 className="preview-title">{formData.title || 'Название технологии'}</h3>
                        <p className="preview-description">
                            {formData.description || 'Описание технологии появится здесь...'}
                        </p>
                        {formData.tags && (
                            <div className="preview-tags">
                                {formData.tags.split(',').filter(tag => tag.trim()).map((tag, index) => (
                                    <span key={index} className="tag">#{tag.trim()}</span>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className="form-actions">
                    <button
                        type="button"
                        onClick={() => navigate('/technologies')}
                        className="cancel-btn"
                    >
                        ← Назад к списку
                    </button>
                    <div className="action-buttons">
                        <button
                            type="button"
                            onClick={() => {
                                setFormData({
                                    title: '',
                                    description: '',
                                    category: 'frontend',
                                    status: 'not-started',
                                    priority: 'medium',
                                    resources: '',
                                    notes: '',
                                    tags: ''
                                });
                                setErrors({});
                            }}
                            className="reset-btn"
                        >
                            🗑️ Очистить форму
                        </button>
                        <button
                            type="submit"
                            className="submit-btn"
                            disabled={!formData.title.trim() || !formData.description.trim()}
                        >
                            🚀 Добавить технологию
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default AddTechnology;