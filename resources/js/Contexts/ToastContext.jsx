import React, { createContext, useContext, useState, useCallback } from 'react';
import Toast from '@/Components/Toast';

const ToastContext = createContext();

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback((message, type = 'success', duration = 5000, position = 'top-right') => {
        const id = Date.now() + Math.random();
        const toast = { id, message, type, duration, position };
        
        setToasts(prev => [...prev, toast]);
        
        return id;
    }, []);

    const removeToast = useCallback((id) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    }, []);

    const showSuccess = useCallback((message, duration, position) => {
        return addToast(message, 'success', duration, position);
    }, [addToast]);

    const showError = useCallback((message, duration, position) => {
        return addToast(message, 'error', duration, position);
    }, [addToast]);

    const showWarning = useCallback((message, duration, position) => {
        return addToast(message, 'warning', duration, position);
    }, [addToast]);

    const showInfo = useCallback((message, duration, position) => {
        return addToast(message, 'info', duration, position);
    }, [addToast]);

    const clearAll = useCallback(() => {
        setToasts([]);
    }, []);

    const value = {
        addToast,
        removeToast,
        showSuccess,
        showError,
        showWarning,
        showInfo,
        clearAll,
        toasts
    };

    return (
        <ToastContext.Provider value={value}>
            {children}
            {/* Render all toasts */}
            {toasts.map(toast => (
                <Toast
                    key={toast.id}
                    message={toast.message}
                    type={toast.type}
                    duration={toast.duration}
                    position={toast.position}
                    onClose={() => removeToast(toast.id)}
                />
            ))}
        </ToastContext.Provider>
    );
};

export default ToastProvider;
