import { Transaction } from "./Types";
import * as configs from "./configs";
import { CashOutFeeJuridical } from "./cashOutFeeJuridical";
import { CashOutFeeNatural } from "./cashOutFeeNatural";

const cashOutFeeCalculator = async (
  transaction: Transaction,
  submittedTransactions: Transaction[]
) => {
  if (transaction.user_type === configs.USER_TYPE_JURIDICAL) {
    return await CashOutFeeJuridical(transaction);
  }
  if (transaction.user_type === configs.USER_TYPE_NATURAL) {
    return await CashOutFeeNatural(transaction, submittedTransactions);
  }
  throw new Error("user type is not valid");
};

export { cashOutFeeCalculator };
