import { Transaction } from "./Types";
import * as configs from "./configs";
import { amountIsExceeded } from "./utils/amountIsExceeded";

const CashOutFeeJuridical = (transaction: Transaction) =>
  transaction.operation.amount * configs.CASH_OUT_FEE_JURIDICAL >
  configs.CASH_OUT_FEE_JURIDICAL_MIN
    ? transaction.operation.amount * configs.CASH_OUT_FEE_JURIDICAL
    : configs.CASH_OUT_FEE_JURIDICAL_MIN;

const CashOutFeeNatural = (
  transaction: Transaction,
  submittedTransactions: Transaction[]
) => {
  const { exceededAmount, exceeded } = amountIsExceeded(
    transaction,
    submittedTransactions
  );
  if (!exceeded) return 0;
  return exceededAmount * configs.CASH_OUT_FEE_NATURAL;
};

const cashOutFeeCalculator = (
  transaction: Transaction,
  submittedTransactions: Transaction[]
) => {
  if (transaction.user_type === configs.USER_TYPE_JURIDICAL) {
    return CashOutFeeJuridical(transaction);
  }
  if (transaction.user_type === configs.USER_TYPE_NATURAL) {
    return CashOutFeeNatural(transaction, submittedTransactions);
  }
  throw new Error("user type is not valid");
};

export { cashOutFeeCalculator };
