import { AlertType, AlertProps } from '../components/common/alert';

export interface AlertConfig extends Omit<AlertProps, 'visible' | 'onClose'> {
  visible: boolean;
  id?: string;
}

type AlertListener = (alert: AlertConfig | null) => void;

class AlertService {
  private listeners: AlertListener[] = [];
  private currentAlert: AlertConfig | null = null;
  private alertIdCounter = 0;

  subscribe(listener: AlertListener) {
    this.listeners.push(listener);
    if (this.currentAlert) {
      listener(this.currentAlert);
    }
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener(this.currentAlert));
  }

  showAlert(
    type: AlertType,
    title: string,
    message?: string,
    options?: Partial<Omit<AlertConfig, 'type' | 'title' | 'message' | 'visible'>>
  ) {
    const alert: AlertConfig = {
      type,
      title,
      message,
      visible: true,
      id: `alert-${++this.alertIdCounter}`,
      ...options,
    };
    
    this.currentAlert = alert;
    this.notifyListeners();
  }

  // Convenience methods
  showSuccess(title: string, message?: string, options?: Partial<Omit<AlertConfig, 'type' | 'title' | 'message' | 'visible'>>) {
    this.showAlert('success', title, message, options);
  }

  showError(title: string, message?: string, options?: Partial<Omit<AlertConfig, 'type' | 'title' | 'message' | 'visible'>>) {
    this.showAlert('error', title, message, options);
  }

  showWarning(title: string, message?: string, options?: Partial<Omit<AlertConfig, 'type' | 'title' | 'message' | 'visible'>>) {
    this.showAlert('warning', title, message, options);
  }

  showInfo(title: string, message?: string, options?: Partial<Omit<AlertConfig, 'type' | 'title' | 'message' | 'visible'>>) {
    this.showAlert('info', title, message, options);
  }

  // Show alert with confirmation (similar to Alert.alert with buttons)
  showConfirm(
    type: AlertType,
    title: string,
    message?: string,
    onConfirm?: () => void,
    options?: Partial<Omit<AlertConfig, 'type' | 'title' | 'message' | 'visible' | 'onConfirm' | 'showCancelButton'>>
  ) {
    this.showAlert(type, title, message, {
      ...options,
      showCancelButton: true,
      onConfirm,
      confirmText: options?.confirmText || 'OK',
      cancelText: options?.cancelText || 'Cancel',
    });
  }

  hideAlert() {
    if (this.currentAlert) {
      this.currentAlert.visible = false;
      this.notifyListeners();
      // Clear after a short delay to allow animation to complete
      setTimeout(() => {
        this.currentAlert = null;
        this.notifyListeners();
      }, 300);
    }
  }

  getCurrentAlert(): AlertConfig | null {
    return this.currentAlert;
  }
}

export const alertService = new AlertService();
