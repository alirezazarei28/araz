import { ceilPrecise } from "./utils/ceilPrecise";
import { Transaction } from "./Types";
import { cashInFeeCalculator } from "./cashInFeeCalculator";
import { cashOutFeeCalculator } from "./cashOutFeeCalculator";
import { TRANSACTION_TYPE_CASH_IN, TRANSACTION_TYPE_CASH_OUT } from "./configs";

const submittedTransactions: Transaction[] = [];
const ceilPrecise2 = ceilPrecise(2);

const calculateCommissionFees = (data: Transaction[]) => {
  data.forEach((transaction) => {
    if (transaction.type === TRANSACTION_TYPE_CASH_IN) {
      console.log(ceilPrecise2(cashInFeeCalculator(transaction)));
    } else if (transaction.type === TRANSACTION_TYPE_CASH_OUT) {
      console.log(
        ceilPrecise2(cashOutFeeCalculator(transaction, submittedTransactions))
      );
    } else throw new Error("transaction type is invalid");

    submittedTransactions.push(transaction); // this should be a rest api
  });
};

export { calculateCommissionFees };
