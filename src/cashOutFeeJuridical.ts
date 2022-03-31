import { getCashOutFeeJuridical } from "./APIs/getCashOutFeeJuridical";
import { Transaction } from "./Types";

const CashOutFeeJuridical = async (transaction: Transaction) => {
  const { cashOutFeeJuridical, cashOutFeeJuridicalMin } =
    await getCashOutFeeJuridical();

  return transaction.operation.amount * cashOutFeeJuridical >
    cashOutFeeJuridicalMin
    ? transaction.operation.amount * cashOutFeeJuridical
    : cashOutFeeJuridicalMin;
};

export { CashOutFeeJuridical };
