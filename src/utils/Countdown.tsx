import React, { useState, useEffect } from "react";

const Countdown = () => {
  const [time, setTime] = useState(0); // 60 seconds * 5 minutes = 300 seconds

  useEffect(() => {
    const timerId = setInterval(() => {
      setTime((prevTime) => {
        if (prevTime === 300) {
          clearInterval(timerId);
          return 0;
        }
        return prevTime + 1;
      });
    }, 1000);

    return () => clearInterval(timerId);
  }, []);

  const minutes = Math.floor(time / 60);
  const seconds = time % 60;

  return (
    <>
      {minutes.toString().padStart(2, "0")}:
      {seconds.toString().padStart(2, "0")}
    </>
  );
};

export default Countdown;
