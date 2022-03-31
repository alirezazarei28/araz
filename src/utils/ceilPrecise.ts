export const ceilPrecise = (precision: number = 2) => {
  if (precision < 1) {
    throw new Error("Precision should be a positive number");
  }
  const power = 10 ** precision;
  return (num: number) => {
    if (num < 0) return Number(0).toFixed(precision);
    return (Math.ceil(num * power) / power).toFixed(precision);
  };
};

export const ceilPrecise2 = ceilPrecise(2);
