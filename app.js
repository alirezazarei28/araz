import fs from "fs";

const inputFile = process.argv.splice(2);
const submittedTransactions = [];

const ceilPrecise = (precision) => {
  const power = 10 ** precision;
  return (number) => (Math.ceil(number * power) / power).toFixed(2);
};

const ceilPrecise2 = ceilPrecise(2);

const getPreviousMonday = (date = null) => {
  const prevMonday = (date && new Date(date.valueOf())) || new Date();
  prevMonday.setDate(prevMonday.getDate() - ((prevMonday.getDay() + 6) % 7));
  return prevMonday.toISOString().split("T")[0];
};

const getAmountUsedFromPreviousMonday = (transactionTarget) => {
  const prevMonday = getPreviousMonday(transactionTarget.date);
  return submittedTransactions
    .filter(
      (t) =>
        t.date > prevMonday &&
        t.date <= transactionTarget.date &&
        t.user_type === "natural" &&
        t.type === "cash_out" &&
        t.user_id === transactionTarget.user_id
    )
    .reduce((acc, cur) => acc + cur.operation.amount, 0);
};

const amountIsExceeded = (transaction) => {
  const amountUsed = getAmountUsedFromPreviousMonday(transaction);
  if (amountUsed > 1000) {
    return {
      exceededAmount: transaction.operation.amount,
      exceeded: true,
    };
  }
  const exceededAmount = transaction.operation.amount - (1000 - amountUsed);
  return { exceededAmount, exceeded: exceededAmount > 0 };
};

const CashInFee = (transaction) =>
  transaction.operation.amount * 0.0003 < 5
    ? transaction.operation.amount * 0.0003
    : 5;

const CashOutFeeJuridical = (transaction) =>
  transaction.operation.amount * 0.003 > 0.5
    ? transaction.operation.amount * 0.003
    : 0.5;

const CashOutFeeNatural = (transaction) => {
  const { exceededAmount, exceeded } = amountIsExceeded(transaction);
  if (!exceeded) return 0;
  return exceededAmount * 0.003;
};

const CashOutFee = (transaction) => {
  if (transaction.user_type === "juridical") {
    return CashOutFeeJuridical(transaction);
  }
  if (transaction.user_type === "natural") {
    return CashOutFeeNatural(transaction);
  }
  throw new Error("user type is not valid");
};

const calculateCommissionFee = (transaction) => {
  if (transaction.type === "cash_in") {
    return CashInFee(transaction);
  }
  if (transaction.type === "cash_out") {
    return CashOutFee(transaction);
  }

  throw new Error("transaction type is invalid");
};

const calculateCommissionFees = (data) => {
  data.forEach((transaction) => {
    console.log(ceilPrecise2(calculateCommissionFee(transaction)));
    submittedTransactions.push(transaction);
  });
};

try {
  fs.readFile(inputFile[0], "utf-8", (error, data) => {
    if (error) throw error;
    calculateCommissionFees(JSON.parse(data));
  });
} catch (e) {
  console.error(
    "please provide a json file as argument for the app, like `node app.js input.json`"
  );
}
