import { getCashInFee } from "./APIs/getCashInFee";
import { Transaction } from "./Types";

const cashInFeeCalculator = async (transaction: Transaction) => {
  const { cashInFee, cashInFeeMax } = await getCashInFee();
  return transaction.operation.amount * cashInFee < cashInFeeMax
    ? transaction.operation.amount * cashInFee
    : 5;
};

export { cashInFeeCalculator };
