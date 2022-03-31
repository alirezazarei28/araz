import { ceilPrecise } from "./utils/ceilPrecise";
import { isValidDate } from "./utils/isValidDate";
import { Transaction } from "./Types";
import { cashInFeeCalculator } from "./cashInFeeCalculator";
import { cashOutFeeCalculator } from "./cashOutFeeCalculator";
import {
  TRANSACTION_TYPE_CASH_IN,
  TRANSACTION_TYPE_CASH_OUT,
  USER_TYPE_JURIDICAL,
  USER_TYPE_NATURAL,
} from "./configs";

const submittedTransactions: Transaction[] = [];
const ceilPrecise2 = ceilPrecise(2);

const checkInput = (transaction: Transaction) => {
  if (
    transaction.user_type !== USER_TYPE_NATURAL &&
    transaction.user_type !== USER_TYPE_JURIDICAL
  ) {
    throw new Error("Wrong User Type");
  }

  if (!isValidDate(transaction.date)) throw new Error(" invalid date format");
};

const calculateCommissionFees = async (data: Transaction[]) => {
  const result: any[] = [];

  for (let i = 0; i < data.length; i++) {
    checkInput(data[i]);
    if (data[i].type === TRANSACTION_TYPE_CASH_IN) {
      result[i] = await cashInFeeCalculator(data[i]);
      submittedTransactions.push(data[i]);
    } else if (data[i].type === TRANSACTION_TYPE_CASH_OUT) {
      result[i] = await cashOutFeeCalculator(data[i], submittedTransactions);
      submittedTransactions.push(data[i]);
    } else throw new Error("transaction type is invalid");
  }
  result.map((res) => console.log(ceilPrecise2(res)));
};

export { calculateCommissionFees };
