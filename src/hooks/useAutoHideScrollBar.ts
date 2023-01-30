import { useEffect } from "react";

const useAutoHideScrollbar = (ref: React.RefObject<any>) => {
  const handleScroll = () => {
    if (ref.current) {
      ref.current.classList.add("showScrollbar");
      setTimeout(() => {
        ref?.current?.classList?.remove("showScrollbar");
      }, 500);
    }
  };

  useEffect(() => {
    ref?.current?.classList?.add("autoSccroll");
    ref?.current?.addEventListener("scroll", handleScroll);
    return () => {
      ref?.current?.target?.removeEventListener("scroll", handleScroll);
    };
  }, [ref, ref?.current, ref?.current?.target]);
};

export default useAutoHideScrollbar;
