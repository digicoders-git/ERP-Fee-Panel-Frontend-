import React, { createContext, useContext, useState, useEffect } from 'react';

const SettingsContext = createContext();

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState({
    schoolName: 'ABC Public School',
    academicYear: '2024-2025',
    currency: 'INR',
    currencySymbol: '₹',
    address: '123 Education Street, Delhi',
    phone: '+91-9876543210',
    email: 'info@abcschool.edu',
    website: 'www.abcschool.edu',
    theme: 'light',
    language: 'en',
    dateFormat: 'DD/MM/YYYY',
    timeFormat: '12',
    notifications: {
      email: true,
      sms: false,
      push: true
    },
    feeSettings: {
      lateFeePercentage: 5,
      gracePeriodDays: 7,
      autoReminders: true,
      reminderDays: [7, 3, 1]
    }
  });

  useEffect(() => {
    const savedSettings = localStorage.getItem('appSettings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  const updateSettings = (newSettings) => {
    const updatedSettings = { ...settings, ...newSettings };
    setSettings(updatedSettings);
    localStorage.setItem('appSettings', JSON.stringify(updatedSettings));
  };

  const resetSettings = () => {
    const defaultSettings = {
      schoolName: 'ABC Public School',
      academicYear: '2024-2025',
      currency: 'INR',
      currencySymbol: '₹',
      address: '123 Education Street, Delhi',
      phone: '+91-9876543210',
      email: 'info@abcschool.edu',
      website: 'www.abcschool.edu',
      theme: 'light',
      language: 'en',
      dateFormat: 'DD/MM/YYYY',
      timeFormat: '12',
      notifications: {
        email: true,
        sms: false,
        push: true
      },
      feeSettings: {
        lateFeePercentage: 5,
        gracePeriodDays: 7,
        autoReminders: true,
        reminderDays: [7, 3, 1]
      }
    };
    setSettings(defaultSettings);
    localStorage.setItem('appSettings', JSON.stringify(defaultSettings));
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, resetSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};