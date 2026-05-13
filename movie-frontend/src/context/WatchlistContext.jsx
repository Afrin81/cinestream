import React, { createContext, useState, useContext, useEffect } from "react";

const WatchlistContext = createContext();

export function WatchlistProvider({ children }) {

  const [watchlist, setWatchlist] = useState(() => {
    const saved = localStorage.getItem("watchlist");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("watchlist", JSON.stringify(watchlist));
  }, [watchlist]);

  // ✅ Use _id for MongoDB
  const addToWatchlist = (movie) => {
    const exists = watchlist.find((m) => m._id === movie._id);
    if (!exists) {
      setWatchlist([...watchlist, movie]);
    }
  };

  const removeFromWatchlist = (movieId) => {
    setWatchlist(watchlist.filter((m) => m._id !== movieId));
  };

  const isInWatchlist = (movieId) => {
    return watchlist.some((m) => m._id === movieId);
  };

  const value = {
    watchlist,
    addToWatchlist,
    removeFromWatchlist,
    isInWatchlist,
  };

  return (
    <WatchlistContext.Provider value={value}>
      {children}
    </WatchlistContext.Provider>
  );
}

export function useWatchlist() {
  return useContext(WatchlistContext);
}