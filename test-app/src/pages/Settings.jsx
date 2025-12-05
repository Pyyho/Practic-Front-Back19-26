import './Settings.css';

function Settings() {
    return (
        <div className="settings-page">
            <div className="page-header">
                <h1>⚙️ Настройки приложения</h1>
                <p>Настройте трекер технологий под свои предпочтения</p>
            </div>

            <div className="no-settings">
                <div className="no-settings-icon">⚙️</div>
                <h2>Настройки будут доступны позже</h2>
                <p>В будущих обновлениях здесь появятся настройки приложения</p>
            </div>
        </div>
    );
}

export default Settings;