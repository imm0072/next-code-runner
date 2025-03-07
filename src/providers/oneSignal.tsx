"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import OneSignal from "react-onesignal";

interface OneSignalContextType {
  isInitialized: boolean;
}

const OneSignalContext = createContext<OneSignalContextType | null>(null);

interface OneSignalProviderProps {
  children: ReactNode;
}

export interface IOneSignalOneSignal {
	Slidedown: IOneSignalSlidedown;
	Notifications: IOneSignalNotifications;
	Session: IOneSignalSession;
	User: IOneSignalUser;
	Debug: IOneSignalDebug;
	login(externalId: string, jwtToken?: string): Promise<void>;
	logout(): Promise<void>;
	init(options: IInitObject): Promise<void>;
	setConsentGiven(consent: boolean): Promise<void>;
	setConsentRequired(requiresConsent: boolean): Promise<void>;
}
export function OneSignalProvider({ children }: OneSignalProviderProps) {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      OneSignal.init({
        appId: "YOUR_APP_ID",
        notifyButton: { enable: true },
        // allowLocalhostAsSecureOrigin: true // Uncomment for local testing
      }).then(() => setIsInitialized(true));
    }
  }, []);

  return (
    <OneSignalContext.Provider value={{ isInitialized }}>
      {children}
    </OneSignalContext.Provider>
  );
}

export function useOneSignal() {
  return useContext(OneSignalContext);
}