import axios from "axios";

const cashInFeeUrl = "https://developers.paysera.com/tasks/api/cash-in";
const CASH_IN_FEE = 0.0003;
const CASH_IN_FEE_MAX = 5;

export const getCashInFee = async () => {
  try {
    const res: any = await axios.get(cashInFeeUrl);

    return {
      cashInFee: res.data.percents / 100,
      cashInFeeMax: res.data.max.amount,
    };
  } catch (e) {
    return {
      cashInFee: CASH_IN_FEE,
      cashInFeeMax: CASH_IN_FEE_MAX,
    };
  }
};
