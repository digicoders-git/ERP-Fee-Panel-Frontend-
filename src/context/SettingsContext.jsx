import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';

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
    const fetchSettings = async () => {
      try {
        const res = await api.get('/api/fee-panel/extras/settings');
        if (res.data && res.data.data) {
          setSettings(prev => ({ ...prev, ...res.data.data }));
        }
      } catch (err) {
        console.error("Failed to load settings from server");
      }
    };
    fetchSettings();
  }, []);

  const updateSettings = async (newSettings) => {
    const updatedSettings = { ...settings, ...newSettings };
    setSettings(updatedSettings);
    try {
       await api.put('/api/fee-panel/extras/settings', updatedSettings);
    } catch (err) {
       console.error("Failed to save settings to server");
    }
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
    api.put('/api/fee-panel/extras/settings', defaultSettings).catch(console.error);
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, resetSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};