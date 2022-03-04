import { cashInFeeCalculator } from "../cashInFeeCalculator";
import { Transaction } from "../Types";

const transaction: Transaction = {
  date: "2016-01-05",
  user_id: 1,
  user_type: "natural",
  type: "cash_in",
  operation: { amount: 200.0, currency: "EUR" },
};

test("should calculate cache in fee for a transaction ", () => {
  expect(cashInFeeCalculator(transaction)).toEqual(0.06);

  expect(
    cashInFeeCalculator({
      ...transaction,
      operation: { amount: 1000000, currency: "EUR" },
    })
  ).toEqual(5);
});
