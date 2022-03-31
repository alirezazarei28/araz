import { Transaction } from "./Types";
import { getCashInFee } from "./configs";

const cashInFeeCalculator = async (transaction: Transaction) => {
  const { cashInFee, cashInFeeMax } = await getCashInFee();
  return transaction.operation.amount * cashInFee < cashInFeeMax
    ? transaction.operation.amount * cashInFee
    : 5;
};

export { cashInFeeCalculator };
