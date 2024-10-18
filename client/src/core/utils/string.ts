export enum StrFormat {
  TITLE_CASE,
}

export function formatString(str: string, format: StrFormat) {
  const formatters = {
    [StrFormat.TITLE_CASE]: (str: string) =>
      str
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(" "),
  };

  return !formatters[format] ? str : formatters[format](str);
}
