import React, { createContext, useContext, useState } from 'react';

interface ServerConfig {
  serverName: string;
  serverId: string;
  meetingDays: number[];
  defaultTimes: string[];
}

interface ConfigContextType {
  config: ServerConfig;
  updateConfig: (newConfig: Partial<ServerConfig>) => void;
}

const defaultConfig: ServerConfig = {
  serverName: "Digital Marketing Hub",
  serverId: "marketing-123",
  meetingDays: [4, 5, 6, 7], // Thursday to Sunday (0 = Sunday)
  defaultTimes: ["20:00", "21:00", "22:00", "23:00"]
};

const ConfigContext = createContext<ConfigContextType | null>(null);

export function ConfigProvider({ children }: { children: React.ReactNode }) {
  const [config, setConfig] = useState<ServerConfig>(defaultConfig);

  const updateConfig = (newConfig: Partial<ServerConfig>) => {
    setConfig(prev => ({ ...prev, ...newConfig }));
  };

  return (
    <ConfigContext.Provider value={{ config, updateConfig }}>
      {children}
    </ConfigContext.Provider>
  );
}

export function useConfig() {
  const context = useContext(ConfigContext);
  if (!context) {
    throw new Error('useConfig must be used within a ConfigProvider');
  }
  return context;
}