import React from "react";

const useLocalstorage = () => {
  const set = (name: string, value: any) => {
    if (typeof value === "string") {
      localStorage.setItem(name, value);
    } else {
      localStorage.setItem(name, JSON.stringify(value));
    }

    return true;
  };

  const get = (name: string, parse: boolean) => {
    const data = localStorage.getItem(name);

    if (!data) return false;

    if (parse) {
      return JSON.parse(data);
    } else {
      return data;
    }
  };
  const remove = (name: string) => {
    localStorage.removeItem(name);
    return true;
  };

  return { set, get, remove };
};

export default useLocalstorage;
