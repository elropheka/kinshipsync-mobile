import { AlertType } from '../components/common/alert';

export interface AlertConfig {
  type: AlertType;
  title: string;
  message: string;
  visible: boolean;
}

type AlertListener = (alert: AlertConfig) => void;

class AlertService {
  private listeners: AlertListener[] = [];
  private currentAlert: AlertConfig | null = null;

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

  showAlert(type: AlertType, title: string, message: string) {
    const alert: AlertConfig = {
      type,
      title,
      message,
      visible: true,
    };
    
    this.currentAlert = alert;
    this.listeners.forEach(listener => listener(alert));
  }

  hideAlert() {
    if (this.currentAlert) {
      this.currentAlert.visible = false;
      this.listeners.forEach(listener => listener(this.currentAlert!));
      this.currentAlert = null;
    }
  }

  getCurrentAlert(): AlertConfig | null {
    return this.currentAlert;
  }
}

export const alertService = new AlertService();
