export const getRandomScore = (min = 27, max = 349) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};
