import axios from "axios";

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
