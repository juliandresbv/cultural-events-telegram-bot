export const createArrayFromRange = (n, m) => {
  return Array.from(Array(m - n + 1).keys(), (num) => num + n);
};
