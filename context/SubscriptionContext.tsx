import React, { createContext, useState, useContext, ReactNode } from 'react';

export type Plan = 'free' | 'basic' | 'pro';

interface SubscriptionContextType {
  currentPlan: Plan;
  setCurrentPlan: (plan: Plan) => void;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export const SubscriptionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentPlan, setCurrentPlan] = useState<Plan>('free');

  return (
    <SubscriptionContext.Provider value={{ currentPlan, setCurrentPlan }}>
      {children}
    </SubscriptionContext.Provider>
  );
};

export const useSubscription = (): SubscriptionContextType => {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
};
