import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, AlertCircle, X } from 'lucide-react';

const Toast = ({ 
    message, 
    type = 'success', 
    duration = 5000, 
    onClose,
    position = 'top-right'
}) => {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
            setTimeout(onClose, 300); // Wait for exit animation
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onClose]);

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(onClose, 300);
    };

    const getToastConfig = () => {
        switch (type) {
            case 'success':
                return {
                    icon: CheckCircle,
                    bgColor: 'bg-green-50 border-green-200',
                    iconColor: 'text-green-600',
                    textColor: 'text-green-800',
                    progressColor: 'bg-green-500'
                };
            case 'error':
                return {
                    icon: XCircle,
                    bgColor: 'bg-red-50 border-red-200',
                    iconColor: 'text-red-600',
                    textColor: 'text-red-800',
                    progressColor: 'bg-red-500'
                };
            case 'warning':
                return {
                    icon: AlertCircle,
                    bgColor: 'bg-yellow-50 border-yellow-200',
                    iconColor: 'text-yellow-600',
                    textColor: 'text-yellow-800',
                    progressColor: 'bg-yellow-500'
                };
            default:
                return {
                    icon: CheckCircle,
                    bgColor: 'bg-blue-50 border-blue-200',
                    iconColor: 'text-blue-600',
                    textColor: 'text-blue-800',
                    progressColor: 'bg-blue-500'
                };
        }
    };

    const config = getToastConfig();
    const Icon = config.icon;

    const positionClasses = {
        'top-right': 'top-4 right-4',
        'top-left': 'top-4 left-4',
        'bottom-right': 'bottom-4 right-4',
        'bottom-left': 'bottom-4 left-4',
        'top-center': 'top-4 left-1/2 transform -translate-x-1/2',
        'bottom-center': 'bottom-4 left-1/2 transform -translate-x-1/2'
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, y: -50, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -50, scale: 0.9 }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                    className={`fixed ${positionClasses[position]} z-50 max-w-md w-full mx-4`}
                >
                    <div className={`${config.bgColor} border rounded-lg shadow-lg p-4 relative overflow-hidden`}>
                        <div className="flex items-start space-x-3">
                            <Icon className={`${config.iconColor} w-5 h-5 mt-0.5 flex-shrink-0`} />
                            <div className="flex-1 min-w-0">
                                <p className={`${config.textColor} text-sm font-medium leading-5`}>
                                    {message}
                                </p>
                            </div>
                            <button
                                onClick={handleClose}
                                className={`${config.iconColor} hover:opacity-70 transition-opacity`}
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                        
                        {/* Progress bar */}
                        <motion.div
                            initial={{ width: '100%' }}
                            animate={{ width: '0%' }}
                            transition={{ duration: duration / 1000, ease: 'linear' }}
                            className={`absolute bottom-0 left-0 h-1 ${config.progressColor} opacity-30`}
                        />
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default Toast;
