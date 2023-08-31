export const transformMillisecondsToDays = (numberOfDays: number): number => {
  return Math.floor(Date.now() / 1000) + 60 * 60 * 24 * numberOfDays;
};
