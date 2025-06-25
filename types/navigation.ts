// Navigation type definitions for the app
export type RootStackParamList = {
  '(auth)': undefined;
  '(main)': undefined;
  '(events)': undefined;
  '(vendors)': undefined;
  'index': undefined;
};

export type AuthStackParamList = {
  'splashScreen': undefined;
  'landingScreen': undefined;
  'signIn': undefined;
  'createAccount': undefined;
};

export type MainTabParamList = {
  'home': undefined;
  'notifications': undefined;
  'profile': undefined;
  'settings': undefined;
};

export type EventsStackParamList = {
  'all/index': undefined;
  'details/[id]': { id: string };
  'budget/index': undefined;
  'guests': undefined;
  'chatArea': undefined;
  'createNewTeam': undefined;
  'tasks': undefined;
  'seating': undefined;
};

export type VendorsStackParamList = {
  'all/index': undefined;
  'category/[name]': { name: string };
  'selection/index': undefined;
  'details/[id]': { id: string };
};

// Helper type to extract route names
export type RouteNames = {
  auth: keyof AuthStackParamList;
  main: keyof MainTabParamList;
  events: keyof EventsStackParamList;
  vendors: keyof VendorsStackParamList;
};
