import axios from "axios";

export const USER_TYPE_NATURAL = "natural";
export const USER_TYPE_JURIDICAL = "juridical";

export const TRANSACTION_TYPE_CASH_IN = "cash_in";
export const TRANSACTION_TYPE_CASH_OUT = "cash_out";

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

const cashOutFeeJuridical =
  "https://developers.paysera.com/tasks/api/cash-out-juridical";

export const CASH_OUT_FEE_JURIDICAL = 0.003;
export const CASH_OUT_FEE_JURIDICAL_MIN = 0.5;

export const getCashOutFeeJuridical = async () => {
  try {
    const res: any = await axios.get(cashOutFeeJuridical);

    return {
      cashOutFeeJuridical: res.data.percents / 100,
      cashOutFeeJuridicalMin: res.data.min.amount,
    };
  } catch (e) {
    return {
      cashOutFeeJuridical: CASH_OUT_FEE_JURIDICAL,
      cashOutFeeJuridicalMin: CASH_OUT_FEE_JURIDICAL_MIN,
    };
  }
};

const cashOutFeeNaturalUrl =
  "https://developers.paysera.com/tasks/api/cash-out-natural";
export const CASH_OUT_FEE_NATURAL = 0.003;
export const CASH_OUT_FEE_NATURAL_WEEK_LIMIT = 1000;

export const getCashOutFeeNatural = async () => {
  try {
    const res: any = await axios.get(cashOutFeeNaturalUrl);

    return {
      cashOutFeeNatural: res.data.percents / 100,
      cashOutFeeNaturalWeekLimit: res.week_limit.amount,
    };
  } catch (e) {
    return {
      cashOutFeeNatural: CASH_OUT_FEE_NATURAL,
      cashOutFeeNaturalWeekLimit: CASH_OUT_FEE_NATURAL_WEEK_LIMIT,
    };
  }
};
