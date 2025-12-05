import { useState, useEffect } from 'react';
import { 
    FaSave, 
    FaMoon, 
    FaSun, 
    FaBell, 
    FaLanguage, 
    FaDatabase,
    FaTrash,
    FaDownload,
    FaUpload,
    FaUser,
    FaLock,
    FaPalette,
    FaChartBar,
    FaCog,
    FaCheck,
    FaEye,
    FaEyeSlash,
    FaCalendar,
    FaClock,
    FaQuestionCircle,
    FaUndo,
    FaFileExport,
    FaFileImport,
    FaEraser,
    FaBroom
} from 'react-icons/fa';
import './Settings.css';

function Settings() {
    const [settings, setSettings] = useState({
        // Тема и внешний вид
        theme: 'light',
        accentColor: '#667eea',
        fontSize: 'medium',
        animations: true,
        
        // Уведомления
        emailNotifications: true,
        pushNotifications: true,
        weeklyReports: true,
        achievementAlerts: true,
        
        // Приватность
        profileVisibility: 'public',
        showProgress: true,
        showAchievements: true,
        
        // Данные
        autoBackup: true,
        backupFrequency: 'weekly',
        exportFormat: 'json',
        
        // Язык и регион
        language: 'ru',
        dateFormat: 'DD.MM.YYYY',
        timeFormat: '24h',
        
        // Дополнительно
        showTutorial: false,
        confirmDeletion: true,
        autoSave: true,
        
        // Статистика хранилища
        storageUsed: '0 KB',
        technologiesCount: 0,
        lastBackup: null
    });

    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [actionType, setActionType] = useState('');
    const [saveMessage, setSaveMessage] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadSettings();
        calculateStorageStats();
    }, []);

    const loadSettings = () => {
        const saved = localStorage.getItem('appSettings');
        if (saved) {
            setSettings(prev => ({ ...prev, ...JSON.parse(saved) }));
        }
    };

    const calculateStorageStats = () => {
        const techs = JSON.parse(localStorage.getItem('technologies') || '[]');
        const techsSize = new Blob([JSON.stringify(techs)]).size;
        const totalSize = techsSize + (localStorage.getItem('appSettings')?.length || 0);
        
        const formatSize = (bytes) => {
            if (bytes < 1024) return `${bytes} B`;
            if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
            return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
        };

        setSettings(prev => ({
            ...prev,
            storageUsed: formatSize(totalSize),
            technologiesCount: techs.length,
            lastBackup: localStorage.getItem('lastBackupDate') || 'Никогда'
        }));
    };

    const handleSettingChange = (category, key, value) => {
        setSettings(prev => ({
            ...prev,
            [key]: value
        }));
    };

    const saveSettings = () => {
        setLoading(true);
        localStorage.setItem('appSettings', JSON.stringify(settings));
        
        // Применяем тему сразу
        if (settings.theme === 'dark') {
            document.documentElement.setAttribute('data-theme', 'dark');
        } else {
            document.documentElement.removeAttribute('data-theme');
        }

        // Применяем акцентный цвет
        document.documentElement.style.setProperty('--primary-color', settings.accentColor);

        setTimeout(() => {
            setSaveMessage('✅ Настройки успешно сохранены!');
            setLoading(false);
            
            setTimeout(() => {
                setSaveMessage('');
            }, 3000);
        }, 500);
    };

    const handleDataAction = (action) => {
        setActionType(action);
        setShowConfirmModal(true);
    };

    const confirmAction = () => {
        switch (actionType) {
            case 'export':
                exportData();
                break;
            case 'import':
                document.getElementById('import-file').click();
                break;
            case 'reset':
                resetAllData();
                break;
            case 'clear':
                clearCache();
                break;
            default:
                break;
        }
        setShowConfirmModal(false);
    };

    const exportData = () => {
        const techs = JSON.parse(localStorage.getItem('technologies') || '[]');
        const savedSettings = localStorage.getItem('appSettings') || '{}';
        
        const exportData = {
            exportedAt: new Date().toISOString(),
            version: '1.0.0',
            technologies: techs,
            settings: JSON.parse(savedSettings),
            metadata: {
                totalTechnologies: techs.length,
                exportFormat: 'json'
            }
        };

        const dataStr = JSON.stringify(exportData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const dataUrl = URL.createObjectURL(dataBlob);

        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = `tech-tracker-backup-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        localStorage.setItem('lastBackupDate', new Date().toLocaleDateString('ru-RU'));
        calculateStorageStats();
        
        setSaveMessage('✅ Данные успешно экспортированы!');
        setTimeout(() => setSaveMessage(''), 3000);
    };

    const importData = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                
                if (data.technologies && Array.isArray(data.technologies)) {
                    localStorage.setItem('technologies', JSON.stringify(data.technologies));
                    
                    if (data.settings) {
                        localStorage.setItem('appSettings', JSON.stringify(data.settings));
                        setSettings(prev => ({ ...prev, ...data.settings }));
                    }
                    
                    calculateStorageStats();
                    setSaveMessage(`✅ Данные успешно импортированы! Загружено ${data.technologies.length} технологий.`);
                    setTimeout(() => setSaveMessage(''), 3000);
                } else {
                    setSaveMessage('❌ Ошибка: неверный формат файла');
                    setTimeout(() => setSaveMessage(''), 3000);
                }
            } catch (error) {
                setSaveMessage('❌ Ошибка при импорте данных. Проверьте формат файла.');
                setTimeout(() => setSaveMessage(''), 3000);
            }
        };
        reader.readAsText(file);
    };

    const resetAllData = () => {
        localStorage.clear();
        setSettings({
            theme: 'light',
            accentColor: '#667eea',
            fontSize: 'medium',
            animations: true,
            emailNotifications: true,
            pushNotifications: true,
            weeklyReports: true,
            achievementAlerts: true,
            profileVisibility: 'public',
            showProgress: true,
            showAchievements: true,
            autoBackup: true,
            backupFrequency: 'weekly',
            exportFormat: 'json',
            language: 'ru',
            dateFormat: 'DD.MM.YYYY',
            timeFormat: '24h',
            showTutorial: false,
            confirmDeletion: true,
            autoSave: true,
            storageUsed: '0 KB',
            technologiesCount: 0,
            lastBackup: null
        });
        
        setSaveMessage('✅ Все данные сброшены к заводским настройкам!');
        setTimeout(() => {
            setSaveMessage('');
            window.location.reload();
        }, 1000);
    };

    const clearCache = () => {
        const keysToKeep = ['technologies', 'appSettings', 'lastBackupDate', 'isLoggedIn', 'username'];
        const allKeys = Object.keys(localStorage);
        
        allKeys.forEach(key => {
            if (!keysToKeep.includes(key)) {
                localStorage.removeItem(key);
            }
        });
        
        calculateStorageStats();
        setSaveMessage('✅ Кэш успешно очищен!');
        setTimeout(() => setSaveMessage(''), 3000);
    };

    const resetToDefaults = () => {
        setSettings({
            theme: 'light',
            accentColor: '#667eea',
            fontSize: 'medium',
            animations: true,
            emailNotifications: true,
            pushNotifications: true,
            weeklyReports: true,
            achievementAlerts: true,
            profileVisibility: 'public',
            showProgress: true,
            showAchievements: true,
            autoBackup: true,
            backupFrequency: 'weekly',
            exportFormat: 'json',
            language: 'ru',
            dateFormat: 'DD.MM.YYYY',
            timeFormat: '24h',
            showTutorial: false,
            confirmDeletion: true,
            autoSave: true,
            storageUsed: settings.storageUsed,
            technologiesCount: settings.technologiesCount,
            lastBackup: settings.lastBackup
        });
        
        setSaveMessage('✅ Настройки сброшены к значениям по умолчанию!');
        setTimeout(() => setSaveMessage(''), 3000);
    };

    return (
        <div className="settings-page">
            <div className="page-header">
                <h1><FaCog /> Настройки приложения</h1>
                <p>Настройте трекер технологий под свои предпочтения и управляйте данными</p>
            </div>

            {saveMessage && (
                <div className="save-message">
                    <FaCheck /> {saveMessage}
                </div>
            )}

            <div className="settings-sections">
                {/* Внешний вид */}
                <div className="settings-section">
                    <h2><FaPalette /> Внешний вид</h2>
                    
                    <div className="setting-item">
                        <div className="setting-info">
                            <h3><FaPalette /> Тема оформления</h3>
                            <p>Выберите светлую или темную тему интерфейса</p>
                        </div>
                        <div className="setting-control">
                            <div className="theme-buttons">
                                <button
                                    className={`theme-btn ${settings.theme === 'light' ? 'active' : ''}`}
                                    onClick={() => handleSettingChange('appearance', 'theme', 'light')}
                                >
                                    <FaSun /> Светлая
                                </button>
                                <button
                                    className={`theme-btn ${settings.theme === 'dark' ? 'active' : ''}`}
                                    onClick={() => handleSettingChange('appearance', 'theme', 'dark')}
                                >
                                    <FaMoon /> Темная
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="setting-item">
                        <div className="setting-info">
                            <h3><FaPalette /> Акцентный цвет</h3>
                            <p>Основной цвет интерфейса и элементов управления</p>
                        </div>
                        <div className="setting-control">
                            <div className="color-picker">
                                {['#667eea', '#4CAF50', '#2196F3', '#FF9800', '#9C27B0', '#f44336'].map(color => (
                                    <button
                                        key={color}
                                        className={`color-option ${settings.accentColor === color ? 'active' : ''}`}
                                        style={{ backgroundColor: color }}
                                        onClick={() => handleSettingChange('appearance', 'accentColor', color)}
                                        title={color}
                                    />
                                ))}
                                <input
                                    type="color"
                                    value={settings.accentColor}
                                    onChange={(e) => handleSettingChange('appearance', 'accentColor', e.target.value)}
                                    className="color-input"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="setting-item">
                        <div className="setting-info">
                            <h3><FaPalette /> Размер шрифта</h3>
                            <p>Настройте удобный для чтения размер текста интерфейса</p>
                        </div>
                        <div className="setting-control">
                            <select
                                value={settings.fontSize}
                                onChange={(e) => handleSettingChange('appearance', 'fontSize', e.target.value)}
                                className="theme-select"
                            >
                                <option value="small">Мелкий</option>
                                <option value="medium">Средний</option>
                                <option value="large">Крупный</option>
                            </select>
                        </div>
                    </div>

                    <div className="setting-item">
                        <div className="setting-info">
                            <h3><FaPalette /> Анимации</h3>
                            <p>Плавные переходы и анимации элементов интерфейса</p>
                        </div>
                        <div className="setting-control">
                            <label className="switch">
                                <input
                                    type="checkbox"
                                    checked={settings.animations}
                                    onChange={(e) => handleSettingChange('appearance', 'animations', e.target.checked)}
                                />
                                <span className="slider"></span>
                            </label>
                        </div>
                    </div>
                </div>

                {/* Уведомления */}
                <div className="settings-section">
                    <h2><FaBell /> Уведомления</h2>
                    
                    <div className="setting-item">
                        <div className="setting-info">
                            <h3><FaBell /> Email уведомления</h3>
                            <p>Отправлять отчеты и напоминания на email</p>
                        </div>
                        <div className="setting-control">
                            <label className="switch">
                                <input
                                    type="checkbox"
                                    checked={settings.emailNotifications}
                                    onChange={(e) => handleSettingChange('notifications', 'emailNotifications', e.target.checked)}
                                />
                                <span className="slider"></span>
                            </label>
                        </div>
                    </div>

                    <div className="setting-item">
                        <div className="setting-info">
                            <h3><FaBell /> Push-уведомления</h3>
                            <p>Всплывающие уведомления в браузере</p>
                        </div>
                        <div className="setting-control">
                            <label className="switch">
                                <input
                                    type="checkbox"
                                    checked={settings.pushNotifications}
                                    onChange={(e) => handleSettingChange('notifications', 'pushNotifications', e.target.checked)}
                                />
                                <span className="slider"></span>
                            </label>
                        </div>
                    </div>

                    <div className="setting-item">
                        <div className="setting-info">
                            <h3><FaBell /> Еженедельные отчеты</h3>
                            <p>Отправлять сводку прогресса каждую неделю</p>
                        </div>
                        <div className="setting-control">
                            <label className="switch">
                                <input
                                    type="checkbox"
                                    checked={settings.weeklyReports}
                                    onChange={(e) => handleSettingChange('notifications', 'weeklyReports', e.target.checked)}
                                />
                                <span className="slider"></span>
                            </label>
                        </div>
                    </div>

                    <div className="setting-item">
                        <div className="setting-info">
                            <h3><FaBell /> Уведомления о достижениях</h3>
                            <p>Оповещать о полученных достижениях</p>
                        </div>
                        <div className="setting-control">
                            <label className="switch">
                                <input
                                    type="checkbox"
                                    checked={settings.achievementAlerts}
                                    onChange={(e) => handleSettingChange('notifications', 'achievementAlerts', e.target.checked)}
                                />
                                <span className="slider"></span>
                            </label>
                        </div>
                    </div>
                </div>

                {/* Приватность */}
                <div className="settings-section">
                    <h2><FaLock /> Приватность</h2>
                    
                    <div className="setting-item">
                        <div className="setting-info">
                            <h3><FaEye /> Видимость профиля</h3>
                            <p>Кто может видеть ваш прогресс изучения технологий</p>
                        </div>
                        <div className="setting-control">
                            <select
                                value={settings.profileVisibility}
                                onChange={(e) => handleSettingChange('privacy', 'profileVisibility', e.target.value)}
                                className="theme-select"
                            >
                                <option value="public">Публичный</option>
                                <option value="private">Приватный</option>
                                <option value="friends">Только друзьям</option>
                            </select>
                        </div>
                    </div>

                    <div className="setting-item">
                        <div className="setting-info">
                            <h3><FaChartBar /> Показывать прогресс</h3>
                            <p>Разрешить другим пользователям видеть ваш прогресс изучения</p>
                        </div>
                        <div className="setting-control">
                            <label className="switch">
                                <input
                                    type="checkbox"
                                    checked={settings.showProgress}
                                    onChange={(e) => handleSettingChange('privacy', 'showProgress', e.target.checked)}
                                />
                                <span className="slider"></span>
                            </label>
                        </div>
                    </div>

                    <div className="setting-item">
                        <div className="setting-info">
                            <h3><FaChartBar /> Показывать достижения</h3>
                            <p>Делиться полученными достижениями с другими</p>
                        </div>
                        <div className="setting-control">
                            <label className="switch">
                                <input
                                    type="checkbox"
                                    checked={settings.showAchievements}
                                    onChange={(e) => handleSettingChange('privacy', 'showAchievements', e.target.checked)}
                                />
                                <span className="slider"></span>
                            </label>
                        </div>
                    </div>
                </div>

                {/* Данные и резервные копии */}
                <div className="settings-section">
                    <h2><FaDatabase /> Данные и резервные копии</h2>
                    
                    <div className="data-actions">
                        <button onClick={() => handleDataAction('export')} className="data-btn export-btn">
                            <FaFileExport /> Экспорт данных
                        </button>
                        
                        <label className="data-btn import-btn">
                            <FaFileImport /> Импорт данных
                            <input
                                id="import-file"
                                type="file"
                                accept=".json"
                                onChange={importData}
                                style={{ display: 'none' }}
                            />
                        </label>
                        
                        <button onClick={() => handleDataAction('clear')} className="data-btn clear-btn">
                            <FaBroom /> Очистить кэш
                        </button>
                    </div>

                    <div className="storage-info">
                        <h3><FaChartBar /> Статистика хранилища</h3>
                        <div className="storage-stats">
                            <div className="storage-item">
                                <span className="storage-label">Использовано памяти:</span>
                                <span className="storage-value">{settings.storageUsed}</span>
                            </div>
                            <div className="storage-item">
                                <span className="storage-label">Технологий в базе:</span>
                                <span className="storage-value">{settings.technologiesCount}</span>
                            </div>
                            <div className="storage-item">
                                <span className="storage-label">Последний бэкап:</span>
                                <span className="storage-value">{settings.lastBackup}</span>
                            </div>
                        </div>
                    </div>

                    <div className="setting-item">
                        <div className="setting-info">
                            <h3><FaDatabase /> Автоматическое резервное копирование</h3>
                            <p>Автоматически сохранять копию данных по расписанию</p>
                        </div>
                        <div className="setting-control">
                            <label className="switch">
                                <input
                                    type="checkbox"
                                    checked={settings.autoBackup}
                                    onChange={(e) => handleSettingChange('data', 'autoBackup', e.target.checked)}
                                />
                                <span className="slider"></span>
                            </label>
                        </div>
                    </div>

                    {settings.autoBackup && (
                        <div className="setting-item">
                            <div className="setting-info">
                                <h3><FaDatabase /> Частота резервного копирования</h3>
                                <p>Как часто создавать резервные копии данных</p>
                            </div>
                            <div className="setting-control">
                                <select
                                    value={settings.backupFrequency}
                                    onChange={(e) => handleSettingChange('data', 'backupFrequency', e.target.value)}
                                    className="theme-select"
                                >
                                    <option value="daily">Ежедневно</option>
                                    <option value="weekly">Еженедельно</option>
                                    <option value="monthly">Ежемесячно</option>
                                </select>
                            </div>
                        </div>
                    )}

                    <div className="setting-item">
                        <div className="setting-info">
                            <h3><FaDatabase /> Формат экспорта</h3>
                            <p>В каком формате сохранять данные при экспорте</p>
                        </div>
                        <div className="setting-control">
                            <select
                                value={settings.exportFormat}
                                onChange={(e) => handleSettingChange('data', 'exportFormat', e.target.value)}
                                className="theme-select"
                            >
                                <option value="json">JSON (рекомендуется)</option>
                                <option value="csv">CSV</option>
                                <option value="pdf">PDF</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Дополнительно */}
                <div className="settings-section">
                    <h2><FaLanguage /> Язык и дополнительные настройки</h2>
                    
                    <div className="setting-item">
                        <div className="setting-info">
                            <h3><FaLanguage /> Язык интерфейса</h3>
                            <p>Выберите предпочитаемый язык приложения</p>
                        </div>
                        <div className="setting-control">
                            <select
                                value={settings.language}
                                onChange={(e) => handleSettingChange('additional', 'language', e.target.value)}
                                className="theme-select"
                            >
                                <option value="ru">Русский</option>
                                <option value="en">English</option>
                                <option value="es">Español</option>
                                <option value="de">Deutsch</option>
                            </select>
                        </div>
                    </div>

                    <div className="setting-item">
                        <div className="setting-info">
                            <h3><FaCalendar /> Формат даты</h3>
                            <p>Как отображать даты в приложении</p>
                        </div>
                        <div className="setting-control">
                            <select
                                value={settings.dateFormat}
                                onChange={(e) => handleSettingChange('additional', 'dateFormat', e.target.value)}
                                className="theme-select"
                            >
                                <option value="DD.MM.YYYY">ДД.ММ.ГГГГ</option>
                                <option value="MM/DD/YYYY">ММ/ДД/ГГГГ</option>
                                <option value="YYYY-MM-DD">ГГГГ-ММ-ДД</option>
                            </select>
                        </div>
                    </div>

                    <div className="setting-item">
                        <div className="setting-info">
                            <h3><FaClock /> Формат времени</h3>
                            <p>12-часовой или 24-часовой формат отображения времени</p>
                        </div>
                        <div className="setting-control">
                            <select
                                value={settings.timeFormat}
                                onChange={(e) => handleSettingChange('additional', 'timeFormat', e.target.value)}
                                className="theme-select"
                            >
                                <option value="24h">24-часовой</option>
                                <option value="12h">12-часовой (AM/PM)</option>
                            </select>
                        </div>
                    </div>

                    <div className="setting-item">
                        <div className="setting-info">
                            <h3><FaQuestionCircle /> Показывать обучение</h3>
                            <p>Показывать подсказки и обучение для новых функций</p>
                        </div>
                        <div className="setting-control">
                            <label className="switch">
                                <input
                                    type="checkbox"
                                    checked={settings.showTutorial}
                                    onChange={(e) => handleSettingChange('additional', 'showTutorial', e.target.checked)}
                                />
                                <span className="slider"></span>
                            </label>
                        </div>
                    </div>

                    <div className="setting-item">
                        <div className="setting-info">
                            <h3><FaQuestionCircle /> Подтверждение удаления</h3>
                            <p>Запрашивать подтверждение перед удалением технологий</p>
                        </div>
                        <div className="setting-control">
                            <label className="switch">
                                <input
                                    type="checkbox"
                                    checked={settings.confirmDeletion}
                                    onChange={(e) => handleSettingChange('additional', 'confirmDeletion', e.target.checked)}
                                />
                                <span className="slider"></span>
                            </label>
                        </div>
                    </div>

                    <div className="setting-item">
                        <div className="setting-info">
                            <h3><FaQuestionCircle /> Автосохранение</h3>
                            <p>Автоматически сохранять изменения в настройках</p>
                        </div>
                        <div className="setting-control">
                            <label className="switch">
                                <input
                                    type="checkbox"
                                    checked={settings.autoSave}
                                    onChange={(e) => handleSettingChange('additional', 'autoSave', e.target.checked)}
                                />
                                <span className="slider"></span>
                            </label>
                        </div>
                    </div>
                </div>
            </div>

            <div className="settings-footer">
                <div className="footer-actions">
                    <button onClick={resetToDefaults} className="reset-btn">
                        <FaUndo /> Сбросить настройки
                    </button>
                    <button onClick={saveSettings} className="save-btn" disabled={loading}>
                        {loading ? 'Сохранение...' : (
                            <>
                                <FaSave /> Сохранить настройки
                            </>
                        )}
                    </button>
                </div>
                
                <p className="version-info">
                    <strong>Версия приложения:</strong> 1.0.0 | <strong>Технологий в базе:</strong> {settings.technologiesCount} | <strong>Использовано памяти:</strong> {settings.storageUsed}
                </p>
            </div>

            {/* Модальное окно подтверждения */}
            {showConfirmModal && (
                <div className="modal-overlay">
                    <div className="confirm-modal">
                        <h3><FaCog /> Подтвердите действие</h3>
                        {actionType === 'reset' && (
                            <>
                                <p>Вы уверены, что хотите сбросить ВСЕ данные к заводским настройкам?</p>
                                <p className="warning-text">
                                    <strong>⚠️ Внимание!</strong> Это действие удалит:
                                    <br />• Все технологии
                                    <br />• Все настройки
                                    <br />• Все достижения
                                    <br />• Весь прогресс
                                </p>
                                <p>Это действие невозможно отменить!</p>
                            </>
                        )}
                        {actionType === 'clear' && (
                            <>
                                <p>Вы уверены, что хотите очистить кэш приложения?</p>
                                <p className="warning-text">
                                    <strong>⚠️ Внимание!</strong> Это может:
                                    <br />• Улучшить производительность
                                    <br />• Освободить память
                                    <br />• Потребовать перезагрузки некоторых данных
                                </p>
                                <p>Ваши технологии и настройки останутся нетронутыми.</p>
                            </>
                        )}
                        {actionType === 'export' && (
                            <>
                                <p>Экспортировать все данные приложения в файл JSON?</p>
                                <p>Будет сохранено:</p>
                                <ul style={{ textAlign: 'left', paddingLeft: '20px' }}>
                                    <li>Все технологии ({settings.technologiesCount} шт.)</li>
                                    <li>Все настройки</li>
                                    <li>Дата экспорта</li>
                                </ul>
                            </>
                        )}
                        {actionType === 'import' && (
                            <>
                                <p>Выберите файл для импорта данных</p>
                                <p className="warning-text">
                                    <strong>⚠️ Внимание!</strong> При импорте:
                                    <br />• Существующие технологии будут объединены
                                    <br />• Настройки будут перезаписаны
                                    <br />• Рекомендуется сделать резервную копию
                                </p>
                            </>
                        )}
                        
                        <div className="modal-buttons">
                            <button onClick={() => setShowConfirmModal(false)} className="modal-btn cancel">
                                Отмена
                            </button>
                            <button onClick={confirmAction} className="modal-btn confirm">
                                {actionType === 'reset' ? 'Сбросить всё' : 
                                 actionType === 'clear' ? 'Очистить кэш' : 
                                 actionType === 'export' ? 'Экспортировать' : 'Импортировать'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Settings;