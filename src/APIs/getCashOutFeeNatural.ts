import axios from "axios";

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
