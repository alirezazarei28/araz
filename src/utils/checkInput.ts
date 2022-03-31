import { USER_TYPE_JURIDICAL, USER_TYPE_NATURAL } from "../configs";
import { Transaction } from "../Types";
import { isValidDate } from "./isValidDate";

const checkInput = (transaction: Transaction) => {
  if (
    transaction.user_type !== USER_TYPE_NATURAL &&
    transaction.user_type !== USER_TYPE_JURIDICAL
  ) {
    throw new Error("Wrong User Type");
  }

  if (!isValidDate(transaction.date)) throw new Error(" invalid date format");
};

export { checkInput };
