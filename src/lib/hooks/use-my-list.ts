"use client";

import { useState, useEffect, useCallback } from "react";
import { Movie } from "@/types/movie";
import { myListService } from "@/lib/services/myListService";
import { useAuth } from "@/lib/auth/authContext";
import { useToast } from "@/components/ui/toast";

export function useMyList() {
  const { user, openAuthModal } = useAuth();
  const toast = useToast();
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
      toast.info("Yêu cầu đăng nhập", "Vui lòng đăng nhập để thêm phim vào danh sách yêu thích!");
      openAuthModal("login");
      return;
    }
    myListService.add(movie);
    toast.success("Đã thêm vào yêu thích", `"${movie.title}" đã được lưu vào danh sách.`);
  }, [user, openAuthModal, toast]);

  const removeMovie = useCallback((id: string) => {
    if (!user) {
      toast.info("Yêu cầu đăng nhập", "Vui lòng đăng nhập để quản lý danh sách yêu thích!");
      openAuthModal("login");
      return;
    }
    myListService.remove(id);
    toast.info("Đã xóa khỏi yêu thích", "Phim đã được gỡ khỏi danh sách yêu thích.");
  }, [user, openAuthModal, toast]);

  const toggleMovie = useCallback((movie: Movie) => {
    if (!user) {
      toast.info("Yêu cầu đăng nhập", "Vui lòng đăng nhập để thêm phim vào danh sách yêu thích!");
      openAuthModal("login");
      return false;
    }
    const added = myListService.toggle(movie);
    if (added) {
      toast.success("Đã thêm vào yêu thích", `"${movie.title}" đã được lưu vào danh sách.`);
    } else {
      toast.info("Đã xóa khỏi yêu thích", `"${movie.title}" đã được gỡ khỏi danh sách.`);
    }
    return added;
  }, [user, openAuthModal, toast]);

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
