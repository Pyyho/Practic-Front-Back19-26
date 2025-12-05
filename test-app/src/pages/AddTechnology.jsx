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
        notes: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        
        const saved = localStorage.getItem('technologies');
        const technologies = saved ? JSON.parse(saved) : [];
        
        const newTechnology = {
            id: Date.now(),
            ...formData,
            createdAt: new Date().toISOString()
        };
        
        const updatedTechnologies = [...technologies, newTechnology];
        localStorage.setItem('technologies', JSON.stringify(updatedTechnologies));
        
        alert('✅ Технология успешно добавлена!');
        navigate('/technologies');
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <div className="add-technology-page">
            <div className="page-header">
                <h1>➕ Добавить новую технологию</h1>
                <p>Заполните форму для добавления новой технологии для изучения</p>
            </div>

            <form onSubmit={handleSubmit} className="add-tech-form">
                <div className="form-section">
                    <h2>📋 Основная информация</h2>
                    
                    <div className="form-group">
                        <label htmlFor="title">
                            🏷️ Название технологии
                        </label>
                        <input
                            id="title"
                            name="title"
                            type="text"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="Например: React Hooks"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="description">
                            📝 Описание
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Опишите, что это за технология, какие задачи решает..."
                            rows="4"
                            required
                        />
                    </div>
                </div>

                <div className="form-section">
                    <h2>🏷️ Категория и статус</h2>
                    
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="category">
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
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="status">
                                📊 Начальный статус
                            </label>
                            <select
                                id="status"
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                            >
                                <option value="not-started">⭕ Не начато</option>
                                <option value="in-progress">🔄 В процессе</option>
                                <option value="completed">✅ Изучено</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="form-section">
                    <h2>📝 Заметки (необязательно)</h2>
                    
                    <div className="form-group">
                        <label htmlFor="notes">
                            📌 Ваши заметки
                        </label>
                        <textarea
                            id="notes"
                            name="notes"
                            value={formData.notes}
                            onChange={handleChange}
                            placeholder="Добавьте свои мысли, ссылки на ресурсы, важные моменты..."
                            rows="3"
                        />
                    </div>
                </div>

                <div className="form-actions">
                    <button
                        type="button"
                        onClick={() => navigate('/technologies')}
                        className="cancel-btn"
                    >
                        Отмена
                    </button>
                    <button type="submit" className="submit-btn">
                        🚀 Добавить технологию
                    </button>
                </div>
            </form>
        </div>
    );
}

export default AddTechnology;