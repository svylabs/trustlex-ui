import React from "react";
import moment from "moment";

export const TimeToNumber = (time: string) => {
  // return time === "1d"
  //   ? 24 * 60 * 60 * 60
  //   : time === "10hrs"
  //   ? 10 * 60 * 60 * 60
  //   : 5 * 60 * 60 * 60;
  let timeInSeconds;
  switch (time) {
    case "5h":
      timeInSeconds = 5 * 60 * 60;
      break;
    case "10h":
      timeInSeconds = 10 * 60 * 60;
      break;

    case "1d":
      timeInSeconds = 1 * 24 * 60 * 60;
      break;
    case "2d":
      timeInSeconds = 2 * 24 * 60 * 60;
      break;
    case "1w":
      timeInSeconds = 7 * 24 * 60 * 60;
      break;
    default:
      timeInSeconds = 1 * 24 * 60 * 60;
  }
  return timeInSeconds;
};

export const NumberToTime = (time: string) => {
  const timeNumber = parseInt(time);

  return timeNumber === 24 * 60 * 60 * 60
    ? "1 d"
    : timeNumber === 10 * 60 * 60 * 60
    ? "10 hrs"
    : "5 hrs";
};

export const TimestampfromNow = (time: string) => {
  let timestamp = moment().valueOf();
  const timeNumber = parseInt(time) * 1000;
  const timeString = moment(
    new Date(timeNumber),
    "ddd MMM DD YYYY HH:mm:ss GMT Z"
  ).fromNow();
  return "Expired " + timeString;
};
export const TimestampTotoNow = (time: string) => {
  let _3hours = 3 * 60 * 60;
  const timeNumber = (parseInt(time) - _3hours) * 1000;
  const timeString = moment(
    new Date(timeNumber),
    "ddd MMM DD YYYY HH:mm:ss GMT Z"
  ).fromNow();
  return "Initiated " + timeString;
};

export const TimeToDateFormat = (time: string | undefined) => {
  if (time) {
    const timeNumber = parseInt(time) * 1000;
    // const timeString = moment(new Date(timeNumber)).format("D MMM , h:mm:ss A");
    const timeString = moment(new Date(timeNumber)).format("D MMM , h:mm A");
    return timeString;
  } else {
    return "N/A";
  }
};

export const getTimeInSeconds = () => {
  let time = moment().valueOf();
  return Math.floor(time / 1000);
};

export const calculateTimeDiiference = (timeInSeconds: number) => {
  let currentTime = Date.now();
  let timeDifference = timeInSeconds - currentTime;
  return timeDifference;
};

export const findOrderExpireColor = (timeInSeconds: number) => {
  if (!timeInSeconds) {
    return "inherit";
  }

  let timeDifference = calculateTimeDiiference(timeInSeconds);
  if (timeDifference < 0) {
    return "red";
  }

  let hours = timeDifference / (1000 * 60 * 60);
  let mins = timeDifference / (1000 * 60);
  if (hours > 1) {
    return "green";
  } else if (Math.floor(hours) == 0 && mins > 50) {
    return "yellow";
  } else {
    return "red";
  }
};
