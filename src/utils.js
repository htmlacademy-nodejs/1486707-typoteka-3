'use strict';

const MILLISECONDS_IN_SECONDS = 1000;
const SECONDS_IN_MINUTE = 60;
const MINUTES_IN_HOUR = 60;
const HOURS_IN_DAY = 24;
const DAYS_IN_MONTH = 30;
const MAX_MONTH_IN_PAST = 3;

const millisecondsInMonth = MILLISECONDS_IN_SECONDS * SECONDS_IN_MINUTE * MINUTES_IN_HOUR * HOURS_IN_DAY * DAYS_IN_MONTH;

const DateLimits = {
  maxDate: Date.now(),
  minDate: Date.now() - millisecondsInMonth * MAX_MONTH_IN_PAST
};

const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);

  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const arrayShuffle = (someArray) => {
  for (let i = someArray.length - 1; i > 0; i--) {
    const randomPosition = Math.floor(Math.random() * i);
    [someArray[i], someArray[randomPosition]] = [someArray[randomPosition], someArray[i]];
  }

  return someArray;
};

const getRandomDate = () => {
  const dateUTC = new Date(getRandomInt(DateLimits.minDate, DateLimits.maxDate));
  const date = `${dateUTC.getFullYear()}-${dateUTC.getMonth()}-${dateUTC.getDate()} ${dateUTC.getHours()}:${dateUTC.getMinutes()}:${dateUTC.getSeconds()}`;
  return date;
};

module.exports = {
  getRandomInt,
  arrayShuffle,
  getRandomDate
};
