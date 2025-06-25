// types.ts
export interface UpcomingEvent {
    id: string;
    day: number;
    month: string;
    title: string;
    time: string;
    location: string;
  }
  
  export interface RecentActivity {
    id: string;
    description: string;
    timeAgo: string;
    type: 'confirmation' | 'payment' | 'task'; // Example types based on icons
  }