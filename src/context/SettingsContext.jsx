import { createContext, useContext, useState, useEffect } from 'react';

const SettingsContext = createContext();

export function SettingsProvider({ children }) {
    const [settings, setSettings] = useState(() => {
        // Загружаем настройки из localStorage при инициализации
        const savedSettings = localStorage.getItem('appSettings');
        return savedSettings 
            ? JSON.parse(savedSettings)
            : {
                // Настройки по умолчанию
                theme: 'light',
                accentColor: '#667eea',
                fontSize: 'medium',
                animations: true,
                language: 'ru',
                // ... другие настройки
            };
    });

    // Применяем настройки к документу
    useEffect(() => {
        // Применяем тему
        if (settings.theme === 'dark') {
            document.documentElement.classList.add('dark-theme');
            document.documentElement.setAttribute('data-theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark-theme');
            document.documentElement.removeAttribute('data-theme');
        }

        // Применяем акцентный цвет
        document.documentElement.style.setProperty('--primary-color', settings.accentColor);

        // Применяем размер шрифта
        document.documentElement.style.setProperty('--font-size-base', getFontSize(settings.fontSize));

        // Применяем анимации
        if (!settings.animations) {
            document.documentElement.classList.add('no-animations');
        } else {
            document.documentElement.classList.remove('no-animations');
        }

        // Сохраняем настройки в localStorage
        localStorage.setItem('appSettings', JSON.stringify(settings));
    }, [settings]);

    const getFontSize = (size) => {
        switch(size) {
            case 'small': return '12px';
            case 'medium': return '14px';
            case 'large': return '16px';
            default: return '14px';
        }
    };

    return (
        <SettingsContext.Provider value={{ settings, setSettings }}>
            {children}
        </SettingsContext.Provider>
    );
}

export function useSettings() {
    const context = useContext(SettingsContext);
    if (!context) {
        throw new Error('useSettings must be used within a SettingsProvider');
    }
    return context;
}