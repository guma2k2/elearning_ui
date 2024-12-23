import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import { RootState } from '../../redux/store';

const ToastNotifier: React.FC = () => {
    const { message, type } = useSelector((state: RootState) => state.toast);

    useEffect(() => {
        if (message) {
            switch (type) {
                case 'success':
                    toast.success(message);
                    break;
                case 'error':
                    toast.error(message);
                    break;
                case 'warn':
                    toast.warn(message);
                    break;
                default:
                    toast.info(message);
            }
        }
    }, [message, type]);

    return <ToastContainer />;
};

export default ToastNotifier;
