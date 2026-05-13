import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// 🔝 This scrolls to top every time page changes
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export default ScrollToTop;