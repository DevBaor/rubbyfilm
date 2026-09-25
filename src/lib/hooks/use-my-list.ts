"use client";

import { useState, useEffect, useCallback } from "react";
import { Movie } from "@/types/movie";
import { myListService } from "@/lib/services/myListService";
import { useAuth } from "@/lib/auth/authContext";

export function useMyList() {
  const { user, openAuthModal } = useAuth();
  const [list, setList] = useState<Movie[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Initial fetch from service
    setList(myListService.getList());
    setIsLoaded(true);

    // Subscribe to cross-component updates
    const unsubscribe = myListService.subscribe((updated) => {
      setList(updated);
    });

    return unsubscribe;
  }, []);

  const addMovie = useCallback((movie: Movie) => {
    if (!user) {
      openAuthModal("login");
      return;
    }
    myListService.add(movie);
  }, [user, openAuthModal]);

  const removeMovie = useCallback((id: string) => {
    if (!user) {
      openAuthModal("login");
      return;
    }
    myListService.remove(id);
  }, [user, openAuthModal]);

  const toggleMovie = useCallback((movie: Movie) => {
    if (!user) {
      openAuthModal("login");
      return false;
    }
    return myListService.toggle(movie);
  }, [user, openAuthModal]);

  const isInList = useCallback((id: string): boolean => {
    return myListService.has(id);
  }, []);

  const clearList = useCallback(() => {
    myListService.clear();
  }, []);

  return {
    list,
    isLoaded,
    addMovie,
    removeMovie,
    toggleMovie,
    isInList,
    clearList,
  };
}
