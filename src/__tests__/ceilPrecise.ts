import { ceilPrecise } from "../utils/ceilPrecise";

test("should round input numbers to ceiling with 2 numbers precision", () => {
  const ceilPrecise2 = ceilPrecise(2);
  expect(ceilPrecise2(12)).toBe("12.00");
  expect(ceilPrecise2(12.4)).toBe("12.40");
  expect(ceilPrecise2(12.43)).toBe("12.43");
  expect(ceilPrecise2(12.431)).toBe("12.44");
  expect(ceilPrecise2(12.439)).toBe("12.44");
  expect(ceilPrecise2(12.439)).toBe("12.44");
  expect(ceilPrecise2(0)).toBe("0.00");
  expect(ceilPrecise2(-1.3232)).toBe("0.00");
});

test("should round input numbers to ceiling with 3 numbers precision", () => {
  const ceilPrecise3 = ceilPrecise(3);
  expect(ceilPrecise3(12)).toBe("12.000");
  expect(ceilPrecise3(12.4)).toBe("12.400");
  expect(ceilPrecise3(12.43)).toBe("12.430");
  expect(ceilPrecise3(12.431)).toBe("12.431");
  expect(ceilPrecise3(12.439)).toBe("12.439");
  expect(ceilPrecise3(12.4391)).toBe("12.440");
  expect(ceilPrecise3(0)).toBe("0.000");
  expect(ceilPrecise3(-1.3232)).toBe("0.000");
});

test("should throw error for non positive precision numbers", () => {
  expect(() => {
    ceilPrecise(0);
  }).toThrow(new Error("Precision should be a positive number"));
  expect(() => {
    ceilPrecise(-1);
  }).toThrow(new Error("Precision should be a positive number"));
});
