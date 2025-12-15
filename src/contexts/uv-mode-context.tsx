"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  ReactNode,
} from "react";

type Mode = "normal" | "uv";

interface UVModeContextType {
  mode: Mode;
  toggle: () => void;
  isUV: boolean;
}

const UVModeContext = createContext<UVModeContextType | undefined>(undefined);

export function UVModeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<Mode>("normal");

  const toggle = useCallback(() => {
    setMode((prev) => (prev === "normal" ? "uv" : "normal"));
  }, []);

  // Aplicar tema ao documento
  useEffect(() => {
    document.documentElement.setAttribute(
      "data-theme",
      mode === "uv" ? "uv" : ""
    );
  }, [mode]);

  return (
    <UVModeContext.Provider value={{ mode, toggle, isUV: mode === "uv" }}>
      {children}
    </UVModeContext.Provider>
  );
}

export function useUVMode() {
  const context = useContext(UVModeContext);
  if (!context) {
    throw new Error("useUVMode must be used within a UVModeProvider");
  }
  return context;
}
