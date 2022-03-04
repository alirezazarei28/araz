import fs from "fs";

import { ceilPrecise } from "./utils/ceilPrecise";
import { Transaction } from "./Types";
import * as configs from "./configs";

const inputFile = process.argv.splice(2);
const submittedTransactions: Transaction[] = [];

const ceilPrecise2 = ceilPrecise(2);

const getPreviousMonday = (date: Date) => {
  const prevMonday = (date && new Date(date.valueOf())) || new Date();
  prevMonday.setDate(prevMonday.getDate() - ((prevMonday.getDay() + 6) % 7));
  return prevMonday.toISOString().split("T")[0];
};

const getAmountUsedFromPreviousMonday = (transactionTarget: Transaction) => {
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

const amountIsExceeded = (transaction: Transaction) => {
  const amountUsed = getAmountUsedFromPreviousMonday(transaction);
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

const CashInFee = (transaction: Transaction) =>
  transaction.operation.amount * configs.CASH_IN_FEE < configs.CASH_IN_FEE_MAX
    ? transaction.operation.amount * configs.CASH_IN_FEE
    : 5;

const CashOutFeeJuridical = (transaction: Transaction) =>
  transaction.operation.amount * configs.CASH_OUT_FEE_JURIDICAL >
  configs.CASH_OUT_FEE_JURIDICAL_MIN
    ? transaction.operation.amount * configs.CASH_OUT_FEE_JURIDICAL
    : configs.CASH_OUT_FEE_JURIDICAL_MIN;

const CashOutFeeNatural = (transaction: Transaction) => {
  const { exceededAmount, exceeded } = amountIsExceeded(transaction);
  if (!exceeded) return 0;
  return exceededAmount * configs.CASH_OUT_FEE_NATURAL;
};

const CashOutFee = (transaction: Transaction) => {
  if (transaction.user_type === configs.USER_TYPE_JURIDICAL) {
    return CashOutFeeJuridical(transaction);
  }
  if (transaction.user_type === configs.USER_TYPE_NATURAL) {
    return CashOutFeeNatural(transaction);
  }
  throw new Error("user type is not valid");
};

const calculateCommissionFee = (transaction: Transaction) => {
  if (transaction.type === configs.TRANSACTION_TYPE_CASH_IN) {
    return CashInFee(transaction);
  }
  if (transaction.type === configs.TRANSACTION_TYPE_CASH_OUT) {
    return CashOutFee(transaction);
  }

  throw new Error("transaction type is invalid");
};

const calculateCommissionFees = (data: Transaction[]) => {
  data.forEach((transaction) => {
    console.log(ceilPrecise2(calculateCommissionFee(transaction)));
    submittedTransactions.push(transaction);
  });
};

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
