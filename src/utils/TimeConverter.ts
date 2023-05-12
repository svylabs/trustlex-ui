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

export const TimeToDateFormat = (time: string) => {
  const timeNumber = parseInt(time) * 1000;
  const timeString = moment(new Date(timeNumber)).format("D MMM ,h:mm:ss A");
  return timeString;
};
