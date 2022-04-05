'use strict';

const dayjs = require(`dayjs`);
const customParseFormat = require(`dayjs/plugin/customParseFormat`);
dayjs.extend(customParseFormat);

const DATE_FORMAT = `YYYY-MM-DD HH:mm:ss`;
const MAX_DATE_DIFFERENCE = 3;

const DateLimits = {
  maxDate: dayjs(),
  minDate: dayjs().subtract(MAX_DATE_DIFFERENCE, `month`)
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
  const date = new Date(getRandomInt(DateLimits.minDate.valueOf(), DateLimits.maxDate.valueOf()));
  return dayjs(date).format(DATE_FORMAT);
};

module.exports = {
  getRandomInt,
  arrayShuffle,
  getRandomDate
};
