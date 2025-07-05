import React, { createContext, useContext, useState, useEffect } from 'react';

interface ThemeSettings {
  theme: 'light' | 'dark' | 'auto';
  colorScheme: 'blue' | 'green' | 'purple' | 'orange';
  fontSize: 'small' | 'medium' | 'large';
  sidebarCollapsed: boolean;
  animations: boolean;
  compactMode: boolean;
}

interface ThemeContextType {
  settings: ThemeSettings;
  updateSetting: <K extends keyof ThemeSettings>(key: K, value: ThemeSettings[K]) => void;
  resetSettings: () => void;
  isDark: boolean;
}

const defaultSettings: ThemeSettings = {
  theme: 'light',
  colorScheme: 'blue',
  fontSize: 'medium',
  sidebarCollapsed: false,
  animations: true,
  compactMode: false
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<ThemeSettings>(() => {
    const saved = localStorage.getItem('theme-settings');
    return saved ? { ...defaultSettings, ...JSON.parse(saved) } : defaultSettings;
  });

  const [isDark, setIsDark] = useState(false);

  // Detectar tema do sistema
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const updateTheme = () => {
      if (settings.theme === 'auto') {
        setIsDark(mediaQuery.matches);
      } else {
        setIsDark(settings.theme === 'dark');
      }
    };

    updateTheme();
    mediaQuery.addEventListener('change', updateTheme);

    return () => mediaQuery.removeEventListener('change', updateTheme);
  }, [settings.theme]);

  // Aplicar classes CSS baseadas nas configurações
  useEffect(() => {
    const root = document.documentElement;
    
    // Tema
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    // Tamanho da fonte
    root.classList.remove('text-sm', 'text-base', 'text-lg');
    switch (settings.fontSize) {
      case 'small':
        root.classList.add('text-sm');
        break;
      case 'large':
        root.classList.add('text-lg');
        break;
      default:
        root.classList.add('text-base');
    }

    // Esquema de cores
    root.setAttribute('data-color-scheme', settings.colorScheme);

    // Animações
    if (!settings.animations) {
      root.style.setProperty('--animation-duration', '0s');
    } else {
      root.style.removeProperty('--animation-duration');
    }

    // Modo compacto
    if (settings.compactMode) {
      root.classList.add('compact-mode');
    } else {
      root.classList.remove('compact-mode');
    }
  }, [settings, isDark]);

  // Salvar configurações no localStorage
  useEffect(() => {
    localStorage.setItem('theme-settings', JSON.stringify(settings));
  }, [settings]);

  const updateSetting = <K extends keyof ThemeSettings>(key: K, value: ThemeSettings[K]) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
    localStorage.removeItem('theme-settings');
  };

  return (
    <ThemeContext.Provider value={{
      settings,
      updateSetting,
      resetSettings,
      isDark
    }}>
      {children}
    </ThemeContext.Provider>
  );
};