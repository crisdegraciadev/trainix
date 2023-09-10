export const capitalize = (value: string) => {
  const plainValue = value.toLowerCase();
  return plainValue[0].toUpperCase() + plainValue.slice(1);
};
