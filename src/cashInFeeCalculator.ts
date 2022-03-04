import { Transaction } from "./Types";
import * as configs from "./configs";
import axios from "axios";

// TODO: create a hook for this
const getCacheInFee = async () => {
  const res = await axios.get(
    // TODO: move this to env variables
    "https://developers.paysera.com/tasks/api/cash-in"
  );
  return res.data;
};

const cashInFeeCalculator = (transaction: Transaction) =>
  transaction.operation.amount * configs.CASH_IN_FEE < configs.CASH_IN_FEE_MAX
    ? transaction.operation.amount * configs.CASH_IN_FEE
    : 5;

export { cashInFeeCalculator };
