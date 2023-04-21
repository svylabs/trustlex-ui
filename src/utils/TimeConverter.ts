import React from "react";
import moment from "moment";

export const TimeToNumber = (time: string) => {
  return time === "1d"
    ? 24 * 60 * 60 * 60
    : time === "10hrs"
    ? 10 * 60 * 60 * 60
    : 5 * 60 * 60 * 60;
};

export const NumberToTime = (time: string) => {
  const timeNumber = parseInt(time);

  return timeNumber === 24 * 60 * 60 * 60
    ? "1d"
    : timeNumber === 10 * 60 * 60 * 60
    ? "10hrs"
    : "5hrs";
};

export const TimestampTofromNow = (time: string) => {
  const timeNumber = parseInt(time) * 1000;
  const timeString = moment(
    new Date(timeNumber),
    "ddd MMM DD YYYY HH:mm:ss GMT Z"
  ).fromNow();
  return "Initiated " + timeString;
};
