import React, { createContext, useContext, useState, useCallback, useRef } from 'react';

// ===== Types =====

export type ToastType = 'info' | 'success' | 'warning' | 'error';
export type BadgeType = 'info' | 'success' | 'warning' | 'error';

export interface ToastItem {
  id: string;
  message: string;
  type: ToastType;
  duration: number;
  actions?: Array<{ label: string; onClick: () => void }>;
}

export interface BadgeItem {
  id: string;
  message: string;
  type: BadgeType;
  duration: number;
}

export interface CurtainConfig {
  isOpen: boolean;
  title?: string;
  storyConfig?: any;
  children?: React.ReactNode;
}

export interface PopupConfig {
  isOpen: boolean;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  storyConfig?: any;
  children?: React.ReactNode;
}

interface OverlayContextValue {
  // Curtain
  curtain: CurtainConfig;
  openCurtain: (config: Omit<CurtainConfig, 'isOpen'>) => void;
  closeCurtain: () => void;

  // Popup
  popup: PopupConfig;
  openPopup: (config: Omit<PopupConfig, 'isOpen'>) => void;
  closePopup: () => void;

  // Toast
  toasts: ToastItem[];
  showToast: {
    info: (message: string, options?: Partial<Omit<ToastItem, 'id' | 'message' | 'type'>>) => string;
    success: (message: string, options?: Partial<Omit<ToastItem, 'id' | 'message' | 'type'>>) => string;
    warning: (message: string, options?: Partial<Omit<ToastItem, 'id' | 'message' | 'type'>>) => string;
    error: (message: string, options?: Partial<Omit<ToastItem, 'id' | 'message' | 'type'>>) => string;
  };
  removeToast: (id: string) => void;

  // Badge
  badges: BadgeItem[];
  showBadge: {
    info: (message: string, options?: Partial<Omit<BadgeItem, 'id' | 'message' | 'type'>>) => string;
    success: (message: string, options?: Partial<Omit<BadgeItem, 'id' | 'message' | 'type'>>) => string;
    warning: (message: string, options?: Partial<Omit<BadgeItem, 'id' | 'message' | 'type'>>) => string;
    error: (message: string, options?: Partial<Omit<BadgeItem, 'id' | 'message' | 'type'>>) => string;
  };
  removeBadge: (id: string) => void;
}

const OverlayContext = createContext<OverlayContextValue | null>(null);

export function useOverlay() {
  const ctx = useContext(OverlayContext);
  if (!ctx) throw new Error('useOverlay must be used within OverlayProvider');
  return ctx;
}

// ===== Provider =====

export function OverlayProvider({ children }: { children: React.ReactNode }) {
  const [curtain, setCurtain] = useState<CurtainConfig>({ isOpen: false });
  const [popup, setPopup] = useState<PopupConfig>({ isOpen: false });
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [badges, setBadges] = useState<BadgeItem[]>([]);
  const toastCounter = useRef(0);
  const badgeCounter = useRef(0);

  // Curtain
  const openCurtain = useCallback((config: Omit<CurtainConfig, 'isOpen'>) => {
    setCurtain({ ...config, isOpen: true });
  }, []);

  const closeCurtain = useCallback(() => {
    setCurtain({ isOpen: false });
  }, []);

  // Popup
  const openPopup = useCallback((config: Omit<PopupConfig, 'isOpen'>) => {
    setPopup({ ...config, isOpen: true });
  }, []);

  const closePopup = useCallback(() => {
    setPopup({ isOpen: false });
  }, []);

  // Toast
  const addToast = useCallback((item: Omit<ToastItem, 'id'>) => {
    const id = `toast-${++toastCounter.current}`;
    setToasts(prev => [...prev, { ...item, id }]);
    return id;
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const showToast = {
    info: (message: string, options?: Partial<Omit<ToastItem, 'id' | 'message' | 'type'>>) =>
      addToast({ message, type: 'info', duration: 5000, ...options }),
    success: (message: string, options?: Partial<Omit<ToastItem, 'id' | 'message' | 'type'>>) =>
      addToast({ message, type: 'success', duration: 5000, ...options }),
    warning: (message: string, options?: Partial<Omit<ToastItem, 'id' | 'message' | 'type'>>) =>
      addToast({ message, type: 'warning', duration: 5000, ...options }),
    error: (message: string, options?: Partial<Omit<ToastItem, 'id' | 'message' | 'type'>>) =>
      addToast({ message, type: 'error', duration: 8000, ...options }),
  };

  // Badge
  const addBadge = useCallback((item: Omit<BadgeItem, 'id'>) => {
    const id = `badge-${++badgeCounter.current}`;
    setBadges(prev => [...prev, { ...item, id }]);
    return id;
  }, []);

  const removeBadge = useCallback((id: string) => {
    setBadges(prev => prev.filter(b => b.id !== id));
  }, []);

  const showBadge = {
    info: (message: string, options?: Partial<Omit<BadgeItem, 'id' | 'message' | 'type'>>) =>
      addBadge({ message, type: 'info', duration: 3, ...options }),
    success: (message: string, options?: Partial<Omit<BadgeItem, 'id' | 'message' | 'type'>>) =>
      addBadge({ message, type: 'success', duration: 3, ...options }),
    warning: (message: string, options?: Partial<Omit<BadgeItem, 'id' | 'message' | 'type'>>) =>
      addBadge({ message, type: 'warning', duration: 4, ...options }),
    error: (message: string, options?: Partial<Omit<BadgeItem, 'id' | 'message' | 'type'>>) =>
      addBadge({ message, type: 'error', duration: 5, ...options }),
  };

  return (
    <OverlayContext.Provider
      value={{
        curtain,
        openCurtain,
        closeCurtain,
        popup,
        openPopup,
        closePopup,
        toasts,
        showToast,
        removeToast,
        badges,
        showBadge,
        removeBadge,
      }}
    >
      {children}
    </OverlayContext.Provider>
  );
}
