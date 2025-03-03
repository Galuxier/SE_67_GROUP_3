import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0); // รีเซ็ต scroll ทุกครั้งที่ pathname เปลี่ยน
  }, [pathname]);

  return null;
};

export default ScrollToTop;
