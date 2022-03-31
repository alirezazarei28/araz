import { getCashOutFeeNatural } from "./APIs/getCashOutFeeNatural";
import { Transaction } from "./Types";
import { amountIsExceeded } from "./utils/amountIsExceeded";

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

export { CashOutFeeNatural };
