import { useState, useCallback, useEffect } from "react";

const useDetectScrollUpDown = () => {
  const [y, setY] = useState(window.scrollY);
  const [scrollDirection, setScrollDirection] = useState("");

  const handleNavigation = useCallback(
    (e: any) => {
      const window = e.currentTarget;
      if (y > window.scrollY) {
        setScrollDirection("up");
      } else if (y < window.scrollY) {
        setScrollDirection("down");
      }
      setY(window.scrollY);
    },
    [y]
  );

  useEffect(() => {
    setY(window.scrollY);
    window.addEventListener("scroll", handleNavigation);

    return () => {
      window.removeEventListener("scroll", handleNavigation);
    };
  }, [handleNavigation]);
  return { scrollDirection };
};

export default useDetectScrollUpDown;
