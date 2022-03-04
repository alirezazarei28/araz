import fs from "fs";

enum UserType {
  USER_TYPE_NATURAL = "natural",
  USER_TYPE_JURIDICAL = "juridical",
}

enum TransactionType {
  TRANSACTION_TYPE_CASH_IN = "cash_in",
  TRANSACTION_TYPE_CASH_OUT = "cash_out",
}

enum CurrencyType {
  EURO = "euro",
}

interface Transaction {
  date: Date;
  user_id: number;
  user_type: UserType;
  type: TransactionType;
  operation: {
    amount: number;
    currency: CurrencyType;
  };
}

const CASH_IN_FEE = 0.0003;
const CASH_IN_FEE_MAX = 5;

const CASH_OUT_FEE_JURIDICAL = 0.003;
const CASH_OUT_FEE_JURIDICAL_MIN = 0.5;
const CASH_OUT_FEE_NATURAL = 0.003;

const USER_TYPE_NATURAL = "natural";
const USER_TYPE_JURIDICAL = "juridical";

const TRANSACTION_TYPE_CASH_IN = "cash_in";
const TRANSACTION_TYPE_CASH_OUT = "cash_out";

const USER_NATURAL_FREE_LIMIT = 1000;

const inputFile = process.argv.splice(2);
const submittedTransactions: Transaction[] = [];

const ceilPrecise = (precision: number = 2) => {
  const power = 10 ** precision;
  return (num: number) => (Math.ceil(num * power) / power).toFixed(2);
};

const ceilPrecise2 = ceilPrecise(2);

const getPreviousMonday = (date: Date) => {
  const prevMonday = (date && new Date(date.valueOf())) || new Date();
  prevMonday.setDate(prevMonday.getDate() - ((prevMonday.getDay() + 6) % 7));
  return prevMonday.toISOString().split("T")[0];
};

const getAmountUsedFromPreviousMonday = (transactionTarget: Transaction) => {
  const prevMonday = getPreviousMonday(transactionTarget.date);
  return submittedTransactions
    .filter(
      (t) =>
        new Date(t.date) > new Date(prevMonday) &&
        new Date(t.date) <= new Date(transactionTarget.date) &&
        t.user_type === USER_TYPE_NATURAL &&
        t.type === TRANSACTION_TYPE_CASH_OUT &&
        t.user_id === transactionTarget.user_id
    )
    .reduce((acc, cur) => acc + cur.operation.amount, 0);
};

const amountIsExceeded = (transaction: Transaction) => {
  const amountUsed = getAmountUsedFromPreviousMonday(transaction);
  if (amountUsed > USER_NATURAL_FREE_LIMIT) {
    return {
      exceededAmount: transaction.operation.amount,
      exceeded: true,
    };
  }
  const exceededAmount =
    transaction.operation.amount - (USER_NATURAL_FREE_LIMIT - amountUsed);
  return { exceededAmount, exceeded: exceededAmount > 0 };
};

const CashInFee = (transaction: Transaction) =>
  transaction.operation.amount * CASH_IN_FEE < CASH_IN_FEE_MAX
    ? transaction.operation.amount * CASH_IN_FEE
    : 5;

const CashOutFeeJuridical = (transaction: Transaction) =>
  transaction.operation.amount * CASH_OUT_FEE_JURIDICAL >
  CASH_OUT_FEE_JURIDICAL_MIN
    ? transaction.operation.amount * CASH_OUT_FEE_JURIDICAL
    : CASH_OUT_FEE_JURIDICAL_MIN;

const CashOutFeeNatural = (transaction: Transaction) => {
  const { exceededAmount, exceeded } = amountIsExceeded(transaction);
  if (!exceeded) return 0;
  return exceededAmount * CASH_OUT_FEE_NATURAL;
};

const CashOutFee = (transaction: Transaction) => {
  if (transaction.user_type === USER_TYPE_JURIDICAL) {
    return CashOutFeeJuridical(transaction);
  }
  if (transaction.user_type === USER_TYPE_NATURAL) {
    return CashOutFeeNatural(transaction);
  }
  throw new Error("user type is not valid");
};

const calculateCommissionFee = (transaction: Transaction) => {
  if (transaction.type === TRANSACTION_TYPE_CASH_IN) {
    return CashInFee(transaction);
  }
  if (transaction.type === TRANSACTION_TYPE_CASH_OUT) {
    return CashOutFee(transaction);
  }

  throw new Error("transaction type is invalid");
};

const calculateCommissionFees = (data: Transaction[]) => {
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