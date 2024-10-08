export enum StrFormat {
  TITLE_CASE,
}

export function formatString(str: string, format: StrFormat) {
  const formatters = {
    [StrFormat.TITLE_CASE]: (str: string) =>
      str
        .split(' ')
        .map(
          (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(),
        )
        .join(' '),
  };

  return !formatters[format] ? str : formatters[format](str);
}

export function extractYoutubeVideoId(url: string) {
  const regex =
    /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/|v\/|.+\?v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
}
