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

export interface Transaction {
  date: Date;
  user_id: number;
  user_type: UserType;
  type: TransactionType;
  operation: {
    amount: number;
    currency: CurrencyType;
  };
}
