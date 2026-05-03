
# Приложение для отслеживания прогресса изучения технологий. Отмечайте изученные темы, ведите заметки и следите за своим ростом! 🚀

## 🌟 Демо

[Открыть приложение](https://pyyho.github.io/Practic-Front-Back19-26)

## ✨ Возможности

- 📊 **Отслеживание прогресса** - визуальное отображение изученного материала
- 🏷️ **Категоризация технологий** - Frontend / Backend / Tools
- 📝 **Личные заметки** - добавляйте заметки к каждой технологии
- 🎯 **Статусы изучения** - Не начато / В процессе / Изучено
- 📈 **Статистика** - детальная аналитика прогресса
- 🔐 **Защищенные маршруты** - персонализированный доступ
- 💾 **Автосохранение** - данные хранятся в localStorage
- 📱 **Адаптивный дизайн** - работает на всех устройствах

## 🛠️ Технологии

- **React 18** - UI библиотека
- **Vite** - быстрый сборщик
- **React Router DOM** - маршрутизация
- **React Icons** - иконки
- **CSS Modules** - стилизация
- **LocalStorage API** - хранение данных
- **GitHub Pages** - хостинг

## 🚀 Быстрый старт

### Установка

```bash
# Клонируйте репозиторий
git clone https://github.com/Pyyho/Practic-Front-Back19-26.git

# Перейдите в директорию проекта
cd Practic-Front-Back19-26

# Установите зависимости
npm install

# Запуск в режиме разработки
npm run dev
```
Приложение будет доступно по адресу: http://localhost:5173

## 📁 Структура проекта
``` text 
Practic-Front-Back19-26/
├── src/
│   ├── components/        # Переиспользуемые компоненты
│   │   ├── Navigation.jsx
│   │   ├── ProgressBar.jsx
│   │   ├── TechnologyCard.jsx
│   │   └── ...
│   ├── pages/            # Страницы приложения
│   │   ├── Home.jsx
│   │   ├── TechnologyList.jsx
│   │   ├── TechnologyDetail.jsx
│   │   ├── AddTechnology.jsx
│   │   ├── Statistics.jsx
│   │   ├── Settings.jsx
│   │   └── Login.jsx
│   ├── hooks/            # Кастомные хуки
│   │   ├── useLocalStorage.js
│   │   ├── useTechnologies.js
│   │   └── useTechnologiesApi.js
│   ├── context/          # React Context
│   │   └── SettingsContext.jsx
│   ├── App.jsx           # Главный компонент
│   ├── App.css           # Глобальные стили
│   └── main.jsx          # Точка входа
├── public/               # Статические файлы
├── index.html            # HTML шаблон
├── package.json          # Зависимости
├── vite.config.js        # Конфигурация Vite
└── README.md            # Документация
```
