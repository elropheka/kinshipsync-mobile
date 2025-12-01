import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import CustomAlert, { AlertType } from '@/components/common/alert';
import { alertService, AlertConfig } from '@/services/alertService';

interface AlertContextType {
  showAlert: (
    type: AlertType,
    title: string,
    message?: string,
    options?: Partial<Omit<AlertConfig, 'type' | 'title' | 'message' | 'visible'>>
  ) => void;
  showSuccess: (title: string, message?: string, options?: Partial<Omit<AlertConfig, 'type' | 'title' | 'message' | 'visible'>>) => void;
  showError: (title: string, message?: string, options?: Partial<Omit<AlertConfig, 'type' | 'title' | 'message' | 'visible'>>) => void;
  showWarning: (title: string, message?: string, options?: Partial<Omit<AlertConfig, 'type' | 'title' | 'message' | 'visible'>>) => void;
  showInfo: (title: string, message?: string, options?: Partial<Omit<AlertConfig, 'type' | 'title' | 'message' | 'visible'>>) => void;
  showConfirm: (
    type: AlertType,
    title: string,
    message?: string,
    onConfirm?: () => void,
    options?: Partial<Omit<AlertConfig, 'type' | 'title' | 'message' | 'visible' | 'onConfirm' | 'showCancelButton'>>
  ) => void;
  hideAlert: () => void;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const AlertProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [alertConfig, setAlertConfig] = useState<AlertConfig | null>(null);

  useEffect(() => {
    const unsubscribe = alertService.subscribe((alert) => {
      setAlertConfig(alert);
    });

    return unsubscribe;
  }, []);

  const handleClose = useCallback(() => {
    alertService.hideAlert();
  }, []);

  const handleConfirm = useCallback(() => {
    if (alertConfig?.onConfirm) {
      alertConfig.onConfirm();
    }
    alertService.hideAlert();
  }, [alertConfig]);

  const showAlert = useCallback((
    type: AlertType,
    title: string,
    message?: string,
    options?: Partial<Omit<AlertConfig, 'type' | 'title' | 'message' | 'visible'>>
  ) => {
    alertService.showAlert(type, title, message, options);
  }, []);

  const showSuccess = useCallback((title: string, message?: string, options?: Partial<Omit<AlertConfig, 'type' | 'title' | 'message' | 'visible'>>) => {
    alertService.showSuccess(title, message, options);
  }, []);

  const showError = useCallback((title: string, message?: string, options?: Partial<Omit<AlertConfig, 'type' | 'title' | 'message' | 'visible'>>) => {
    alertService.showError(title, message, options);
  }, []);

  const showWarning = useCallback((title: string, message?: string, options?: Partial<Omit<AlertConfig, 'type' | 'title' | 'message' | 'visible'>>) => {
    alertService.showWarning(title, message, options);
  }, []);

  const showInfo = useCallback((title: string, message?: string, options?: Partial<Omit<AlertConfig, 'type' | 'title' | 'message' | 'visible'>>) => {
    alertService.showInfo(title, message, options);
  }, []);

  const showConfirm = useCallback((
    type: AlertType,
    title: string,
    message?: string,
    onConfirm?: () => void,
    options?: Partial<Omit<AlertConfig, 'type' | 'title' | 'message' | 'visible' | 'onConfirm' | 'showCancelButton'>>
  ) => {
    alertService.showConfirm(type, title, message, onConfirm, options);
  }, []);

  const hideAlert = useCallback(() => {
    alertService.hideAlert();
  }, []);

  const value: AlertContextType = {
    showAlert,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showConfirm,
    hideAlert,
  };

  return (
    <AlertContext.Provider value={value}>
      {children}
      {alertConfig && (
        <CustomAlert
          visible={alertConfig.visible}
          type={alertConfig.type}
          title={alertConfig.title}
          message={alertConfig.message}
          onClose={handleClose}
          onConfirm={alertConfig.onConfirm ? handleConfirm : undefined}
          confirmText={alertConfig.confirmText}
          cancelText={alertConfig.cancelText}
          showCancelButton={alertConfig.showCancelButton}
          autoHide={alertConfig.autoHide}
          autoHideDuration={alertConfig.autoHideDuration}
          position={alertConfig.position}
          showIcon={alertConfig.showIcon}
          closable={alertConfig.closable}
        />
      )}
    </AlertContext.Provider>
  );
};

export const useAlert = (): AlertContextType => {
  const context = useContext(AlertContext);
  if (context === undefined) {
    throw new Error('useAlert must be used within an AlertProvider');
  }
  return context;
};

