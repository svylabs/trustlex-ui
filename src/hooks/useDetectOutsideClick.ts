import { useEffect } from "react";

interface IUseDetectOutsideClick {
  ref: React.RefObject<any>;
  callback: Function;
}
const useDetectOutsideClick = ({ ref, callback }: IUseDetectOutsideClick) => {
  const handleClickOutside = (event: MouseEvent) => {
    if (ref.current && !ref.current.contains(event.target as Node)) {
      callback(event);
    }
    event.stopPropagation();
  };
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref]);
};

export default useDetectOutsideClick;
