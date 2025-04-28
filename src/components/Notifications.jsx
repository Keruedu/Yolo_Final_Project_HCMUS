import React, { createContext, useContext } from 'react';
import { notification } from 'antd';
import { 
  CheckCircleOutlined, 
  InfoCircleOutlined, 
  WarningOutlined, 
  CloseCircleOutlined,
  LoadingOutlined
} from '@ant-design/icons';

// Create notification context
const NotificationContext = createContext(null);

// Custom styles for centered notifications
const notificationStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center'
};

// Notification Provider component
export const NotificationProvider = ({ children }) => {
  const [api, contextHolder] = notification.useNotification();

  // Icons for different notification types
  const ICONS = {
    success: <CheckCircleOutlined style={{ color: '#52c41a' }} />,
    info: <InfoCircleOutlined style={{ color: '#1890ff' }} />,
    warning: <WarningOutlined style={{ color: '#faad14' }} />,
    error: <CloseCircleOutlined style={{ color: '#ff4d4f' }} />,
    loading: <LoadingOutlined style={{ color: '#1890ff' }} spin />
  };

  // Create notification methods
  const notifyFunctions = {
    success: (message, description = '', config = {}) => {
      api.success({
        message,
        description,
        placement: 'top', // Place at top for center alignment
        icon: ICONS.success,
        style: notificationStyle,
        className: 'centered-notification notification-success',
        ...config
      });
    },

    error: (message, description = '', config = {}) => {
      api.error({
        message,
        description,
        placement: 'top',
        icon: ICONS.error,
        style: notificationStyle,
        className: 'centered-notification notification-error',
        ...config
      });
    },

    warning: (message, description = '', config = {}) => {
      api.warning({
        message,
        description,
        placement: 'top',
        icon: ICONS.warning,
        style: notificationStyle,
        className: 'centered-notification notification-warning',
        ...config
      });
    },

    info: (message, description = '', config = {}) => {
      api.info({
        message,
        description,
        placement: 'top',
        icon: ICONS.info,
        style: notificationStyle,
        className: 'centered-notification notification-info',
        ...config
      });
    },

    loading: (message, description = '', config = {}) => {
      return api.info({
        message,
        description,
        icon: ICONS.loading,
        placement: 'top',
        style: notificationStyle,
        className: 'centered-notification notification-loading',
        duration: 0, // Stay open until closed
        ...config
      });
    },

    apiError: (error) => {
      if (error.response) {
        const status = error.response.status;
        let title = 'Server Error';
        let description = `Server returned error: ${status}`;
        
        // Status-specific messages
        if (status === 404) {
          title = 'Resource Not Found';
          description = 'The requested resource could not be found.';
        } else if (status === 401) {
          title = 'Authentication Required';
          description = 'Please log in to continue.';
        } else if (status === 403) {
          title = 'Access Denied';
          description = 'You don\'t have permission to access this resource.';
        } else if (status === 500) {
          title = 'Server Error';
          description = 'The server encountered an error. Please try again later.';
        }
        
        // Add details if available
        if (error.response.data?.message) {
          description += `\nDetails: ${error.response.data.message}`;
        }
        
        notifyFunctions.error(title, description);
      } else if (error.request) {
        notifyFunctions.error(
          'Network Error',
          'Unable to connect to the server. Please check your internet connection.'
        );
      } else {
        notifyFunctions.error(
          'Request Error',
          error.message || 'An error occurred while processing your request.'
        );
      }
    },
    
    closeAll: () => {
      api.destroy();
    }
  };

  return (
    <NotificationContext.Provider value={notifyFunctions}>
      {contextHolder}
      {children}
    </NotificationContext.Provider>
  );
};

// Hook to use notifications
export const useNotify = () => {
  const notify = useContext(NotificationContext);
  if (!notify) {
    throw new Error('useNotify must be used within a NotificationProvider');
  }
  return notify;
};

// Add CSS to your global styles
const style = document.createElement('style');
style.innerHTML = `
  .centered-notification {
    left: 50% !important;
    transform: translateX(-50%);
    margin-top: 20px;
  }
`;
document.head.appendChild(style);

// Backward compatibility for direct imports
const notify = {
  success: (...args) => console.warn('Please use NotificationProvider and useNotify hook instead of direct imports'),
  error: (...args) => console.warn('Please use NotificationProvider and useNotify hook instead of direct imports'),
  info: (...args) => console.warn('Please use NotificationProvider and useNotify hook instead of direct imports'),
  warning: (...args) => console.warn('Please use NotificationProvider and useNotify hook instead of direct imports'),
  loading: (...args) => console.warn('Please use NotificationProvider and useNotify hook instead of direct imports'),
  apiError: (...args) => console.warn('Please use NotificationProvider and useNotify hook instead of direct imports'),
  closeAll: (...args) => console.warn('Please use NotificationProvider and useNotify hook instead of direct imports'),
};

export default notify;