import fs from "fs";

import { calculateCommissionFees } from "./calculateCommissionFees";

const inputFile = process.argv.splice(2);

try {
  fs.readFile(inputFile[0], "utf-8", (error, data) => {
    if (error) throw error;
    calculateCommissionFees(JSON.parse(data));
  });
} catch (e) {
  console.error(
    "please provide a json file as argument for the app, like `node app.js input.json`"
  );
}
