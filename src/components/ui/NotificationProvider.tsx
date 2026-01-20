'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import Notification, {  NotificationProps } from './notification';

interface NotificationItem extends NotificationProps {
  id: string;
}

interface NotificationContextType {
  showNotification: (notification: Omit<NotificationItem, 'id'>) => void;
  hideNotification: (id: string) => void;
  clearAllNotifications: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  const showNotification = useCallback((notification: Omit<NotificationItem, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newNotification: NotificationItem = {
      ...notification,
      id,
    };
    
    setNotifications(prev => [...prev, newNotification]);
  }, []);

  const hideNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);

  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  return (
    <NotificationContext.Provider value={{ showNotification, hideNotification, clearAllNotifications }}>
      {children}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {notifications.map(notification => (
          <Notification
            key={notification.id}
            {...notification}
            onClose={() => hideNotification(notification.id)}
          />
        ))}
      </div>
    </NotificationContext.Provider>
  );
};
