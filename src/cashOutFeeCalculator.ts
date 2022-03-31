import { Transaction } from "./Types";
import { amountIsExceeded } from "./utils/amountIsExceeded";
import * as configs from "./configs";
import { getCashOutFeeJuridical, getCashOutFeeNatural } from "./configs";

const CashOutFeeJuridical = async (transaction: Transaction) => {
  const { cashOutFeeJuridical, cashOutFeeJuridicalMin } =
    await getCashOutFeeJuridical();

  return transaction.operation.amount * cashOutFeeJuridical >
    cashOutFeeJuridicalMin
    ? transaction.operation.amount * cashOutFeeJuridical
    : cashOutFeeJuridicalMin;
};

const CashOutFeeNatural = async (
  transaction: Transaction,
  submittedTransactions: Transaction[]
) => {
  const { cashOutFeeNatural, cashOutFeeNaturalWeekLimit } =
    await getCashOutFeeNatural();

  const { exceededAmount, exceeded } = amountIsExceeded(
    transaction,
    submittedTransactions,
    cashOutFeeNaturalWeekLimit
  );

  if (!exceeded) return 0;
  return exceededAmount * Number(cashOutFeeNatural);
};

const cashOutFeeCalculator = async (
  transaction: Transaction,
  submittedTransactions: Transaction[]
) => {
  if (transaction.user_type === configs.USER_TYPE_JURIDICAL) {
    const res = await CashOutFeeJuridical(transaction);
    return res;
  }
  if (transaction.user_type === configs.USER_TYPE_NATURAL) {
    const res = await CashOutFeeNatural(transaction, submittedTransactions);
    return res;
  }
  throw new Error("user type is not valid");
};

export { cashOutFeeCalculator };
