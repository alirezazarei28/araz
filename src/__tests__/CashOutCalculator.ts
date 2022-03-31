import { cashOutFeeCalculator } from "../cashOutFeeCalculator";
import { Transaction } from "../Types";

test("should calculate cache out fee for a juridical user ", async () => {
  const transaction: Transaction = {
    date: "2016-01-06",
    user_id: 2,
    user_type: "juridical",
    type: "cash_out",
    operation: { amount: 300.0, currency: "EUR" },
  };

  expect(await cashOutFeeCalculator(transaction, [])).toEqual(0.9);

  expect(
    await cashOutFeeCalculator(
      { ...transaction, operation: { amount: 1, currency: "EUR" } },
      []
    )
  ).toEqual(0.5);
});

test("should calculate cache out fee for a natural user ", async () => {
  const transaction: Transaction = {
    date: "2016-01-06",
    user_id: 1,
    user_type: "natural",
    type: "cash_out",
    operation: { amount: 30000, currency: "EUR" },
  };
  const transactionFree: Transaction = {
    date: "2016-01-06",
    user_id: 1,
    user_type: "natural",
    type: "cash_out",
    operation: { amount: 30, currency: "EUR" },
  };

  expect(await cashOutFeeCalculator(transaction, [])).toEqual(87);
  expect(await cashOutFeeCalculator(transactionFree, [])).toEqual(0);
  expect(
    await cashOutFeeCalculator(transaction, [
      {
        date: "2016-01-05",
        user_id: 1,
        user_type: "natural",
        type: "cash_out",
        operation: { amount: 1000, currency: "EUR" },
      },
    ])
  ).toEqual(90);
});
