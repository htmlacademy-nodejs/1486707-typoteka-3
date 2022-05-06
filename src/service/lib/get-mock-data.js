'use strict';

const fs = require(`fs`).promises;
const FILENAME = `mocks.json`;
let data = [];

const getMockData = async () => {
  if (data.length) {
    return data;
  }

  try {
    const fileContent = await fs.readFile(FILENAME);
    data = JSON.parse(fileContent);
    return data;
  } catch (err) {
    console.log(err);
    return (err);
  }
};

module.exports = {getMockData};
