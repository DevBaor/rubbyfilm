"use client";

import { useState, useEffect, useCallback } from "react";
import { User, UserPreferences } from "@/types/user";
import { userPreferenceService } from "@/lib/services/userPreferenceService";

export function useUserProfile() {
  const [user, setUser] = useState<User>(userPreferenceService.getUser());
  const [preferences, setPreferences] = useState<UserPreferences>(
    userPreferenceService.getPreferences()
  );
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setUser(userPreferenceService.getUser());
    setPreferences(userPreferenceService.getPreferences());
    setIsLoaded(true);

    const unsubscribe = userPreferenceService.subscribe((newPrefs, newUser) => {
      setPreferences(newPrefs);
      setUser(newUser);
    });

    return unsubscribe;
  }, []);

  const updateUser = useCallback((updates: Partial<User>) => {
    userPreferenceService.updateUser(updates);
  }, []);

  const updatePreferences = useCallback((updates: Partial<UserPreferences>) => {
    userPreferenceService.updatePreferences(updates);
  }, []);

  return {
    user,
    preferences,
    isLoaded,
    updateUser,
    updatePreferences,
  };
}
