'use client';

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { useEffect } from "react";

export type HeaderConfig = {
  /** Tailwind/utility classes applied to the header wrapper */
  wrapperClassName: string;
};

export const defaultHeaderConfig: HeaderConfig = {
  wrapperClassName: "bg-transparent text-white",
};

type HeaderConfigContextValue = {
  config: HeaderConfig;
  setConfig: (updates: Partial<HeaderConfig>) => void;
  resetConfig: () => void;
};

const HeaderConfigContext = createContext<HeaderConfigContextValue | null>(
  null,
);

export function HeaderConfigProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [config, setConfigState] = useState<HeaderConfig>(defaultHeaderConfig);

  const setConfig = useCallback((updates: Partial<HeaderConfig>) => {
    setConfigState((prev) => ({
      ...prev,
      ...Object.fromEntries(
        Object.entries(updates).filter(
          ([, value]) => value !== undefined && value !== null,
        ),
      ),
    }));
  }, []);

  const resetConfig = useCallback(() => {
    setConfigState(defaultHeaderConfig);
  }, []);

  const value = useMemo(
    () => ({
      config,
      setConfig,
      resetConfig,
    }),
    [config, setConfig, resetConfig],
  );

  return (
    <HeaderConfigContext.Provider value={value}>
      {children}
    </HeaderConfigContext.Provider>
  );
}

export function useHeaderConfig() {
  const context = useContext(HeaderConfigContext);
  if (!context) {
    throw new Error(
      "useHeaderConfig must be used inside a HeaderConfigProvider",
    );
  }
  return context;
}

type HeaderConfiguratorProps = Partial<HeaderConfig>;

export function HeaderConfigurator({
  wrapperClassName,
}: HeaderConfiguratorProps) {
  const { setConfig, resetConfig } = useHeaderConfig();

  useEffect(() => {
    setConfig({
      wrapperClassName,
    });
    return () => {
      resetConfig();
    };
  }, [resetConfig, setConfig, wrapperClassName]);

  return null;
}
