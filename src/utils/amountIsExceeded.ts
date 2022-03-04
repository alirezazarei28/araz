import { Transaction } from "../Types";
import * as configs from "../configs";

const amountIsExceeded = (
  transaction: Transaction,
  submittedTransactions: Transaction[]
) => {
  // this should come from a rest api
  const amountUsed = getAmountUsedFromPreviousMonday(
    transaction,
    submittedTransactions
  );
  if (amountUsed > configs.USER_NATURAL_FREE_LIMIT) {
    return {
      exceededAmount: transaction.operation.amount,
      exceeded: true,
    };
  }
  const exceededAmount =
    transaction.operation.amount -
    (configs.USER_NATURAL_FREE_LIMIT - amountUsed);
  return { exceededAmount, exceeded: exceededAmount > 0 };
};

const getPreviousMonday = (date: string) => {
  const prevMonday = (date && new Date(date.valueOf())) || new Date();
  prevMonday.setDate(prevMonday.getDate() - ((prevMonday.getDay() + 6) % 7));
  return prevMonday.toISOString().split("T")[0];
};

const getAmountUsedFromPreviousMonday = (
  transactionTarget: Transaction,
  submittedTransactions: Transaction[]
) => {
  const prevMonday = getPreviousMonday(transactionTarget.date);
  return submittedTransactions
    .filter(
      (t) =>
        new Date(t.date) > new Date(prevMonday) &&
        new Date(t.date) <= new Date(transactionTarget.date) &&
        t.user_type === configs.USER_TYPE_NATURAL &&
        t.type === configs.TRANSACTION_TYPE_CASH_OUT &&
        t.user_id === transactionTarget.user_id
    )
    .reduce((acc, cur) => acc + cur.operation.amount, 0);
};

export { amountIsExceeded };
