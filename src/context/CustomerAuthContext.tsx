'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { CustomerUser } from '@/types';

interface CustomerAuthContextType {
  customer: CustomerUser | null;
  loginCustomer: (customerData: CustomerUser) => void;
  logoutCustomer: () => void;
}

const CustomerAuthContext = createContext<CustomerAuthContextType | undefined>(undefined);

export const CustomerAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [customer, setCustomer] = useState<CustomerUser | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('moonshine_customer');
      if (saved) {
        setCustomer(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Failed to parse saved customer session:', e);
    }
    setIsInitialized(true);
  }, []);

  const loginCustomer = (customerData: CustomerUser) => {
    setCustomer(customerData);
    localStorage.setItem('moonshine_customer', JSON.stringify(customerData));
  };

  const logoutCustomer = () => {
    setCustomer(null);
    localStorage.removeItem('moonshine_customer');
  };

  return (
    <CustomerAuthContext.Provider value={{ customer, loginCustomer, logoutCustomer }}>
      {children}
    </CustomerAuthContext.Provider>
  );
};

export const useCustomerAuth = () => {
  const context = useContext(CustomerAuthContext);
  if (!context) {
    throw new Error('useCustomerAuth must be used within a CustomerAuthProvider');
  }
  return context;
};
