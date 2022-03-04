import { calculateCommissionFees } from "../calculateCommissionFees";
import * as cashInApi from "../cashInFeeCalculator";
import * as cashOutApi from "../cashOutFeeCalculator";
import { Transaction } from "../Types";

const mockData: Transaction[] = [
  {
    date: "2016-01-05",
    user_id: 1,
    user_type: "natural",
    type: "cash_in",
    operation: { amount: 200.0, currency: "EUR" },
  },
  {
    date: "2016-01-06",
    user_id: 2,
    user_type: "juridical",
    type: "cash_out",
    operation: { amount: 300.0, currency: "EUR" },
  },
];

const mockCashIn = jest.spyOn(cashInApi, "cashInFeeCalculator");
const mockCashOut = jest.spyOn(cashOutApi, "cashOutFeeCalculator");

afterAll(() => {
  mockCashIn.mockReset();
  mockCashOut.mockReset();
});

test("should calculate commission fees for cash-in transaction types ", () => {
  calculateCommissionFees(mockData);

  expect(mockCashIn).toBeCalledWith(mockData[0]);
  expect(mockCashOut).toBeCalledWith(mockData[1], [mockData[0], mockData[1]]);
  expect(mockCashIn).toBeCalledTimes(1);
  expect(mockCashOut).toBeCalledTimes(1);
});
