import { Transaction } from "./Types";
import * as configs from "./configs";

const cashInFeeCalculator = (transaction: Transaction) =>
  transaction.operation.amount * configs.CASH_IN_FEE < configs.CASH_IN_FEE_MAX
    ? transaction.operation.amount * configs.CASH_IN_FEE
    : 5;

export { cashInFeeCalculator };
