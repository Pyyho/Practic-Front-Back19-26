import { useState } from 'react';
import './QuickActions.css';
import Modal from './Modal';

function QuickActions({ 
    technologies, 
    onMarkAllCompleted, 
    onResetAll, 
    onExport, 
    onResetData 
}) {
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [actionType, setActionType] = useState('');

    const handleAction = (action) => {
        switch(action) {
            case 'complete':
                onMarkAllCompleted();
                break;
            case 'reset':
                onResetAll();
                break;
            case 'export':
                onExport();
                break;
            case 'resetData':
                setActionType('resetData');
                setShowConfirmModal(true);
                break;
            default:
                break;
        }
    };

    const confirmResetData = () => {
        onResetData();
        setShowConfirmModal(false);
    };

    // Проверка доступности действий
    const allCompleted = technologies.every(tech => tech.status === 'completed');
    const allNotStarted = technologies.every(tech => tech.status === 'not-started');

    return (
        <div className="quick-actions">
            <h3>⚡ Быстрые действия</h3>
            <div className="action-buttons">
                <button 
                    className="action-btn complete-all"
                    onClick={() => handleAction('complete')}
                    disabled={allCompleted}
                    title={allCompleted ? "Все технологии уже изучены" : "Отметить все технологии как изученные"}
                >
                    ✅ Отметить все как выполненные
                </button>
                
                <button 
                    className="action-btn reset-all"
                    onClick={() => handleAction('reset')}
                    disabled={allNotStarted}
                    title={allNotStarted ? "Все технологии уже не начаты" : "Сбросить статусы всех технологий"}
                >
                    🔄 Сбросить все статусы
                </button>
                
                <button 
                    className="action-btn export-data"
                    onClick={() => handleAction('export')}
                >
                    📥 Экспорт данных
                </button>
                
                <button 
                    className="action-btn reset-data"
                    onClick={() => handleAction('resetData')}
                >
                    🗑️ Сбросить все данные
                </button>
            </div>

            {/* Модальное окно подтверждения сброса данных */}
            <Modal
                isOpen={showConfirmModal}
                onClose={() => setShowConfirmModal(false)}
                title="⚠️ Подтверждение действия"
            >
                <div className="confirm-modal-content">
                    <p>Вы уверены, что хотите сбросить ВСЕ данные?</p>
                    <p className="warning-text">Это действие удалит все ваши заметки, прогресс и настройки. Отменить его будет невозможно!</p>
                    <div className="modal-buttons">
                        <button 
                            className="modal-btn cancel-btn"
                            onClick={() => setShowConfirmModal(false)}
                        >
                            Отмена
                        </button>
                        <button 
                            className="modal-btn confirm-btn"
                            onClick={confirmResetData}
                        >
                            Да, сбросить все
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}

export default QuickActions;