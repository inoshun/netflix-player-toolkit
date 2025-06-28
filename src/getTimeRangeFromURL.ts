export const getTimeRangeFromURL = () => {
  const params = new URL(location.href).searchParams;
  const startSeconds = params.get('startSeconds');
  const endSeconds = params.get('endSeconds');

  if (!startSeconds || !endSeconds) {
    console.error('startSeconds or endSeconds not found');
    return;
  }

  const startSecondsNumber = Number(startSeconds);
  const endSecondsNumber = Number(endSeconds);

  if (
    isNaN(startSecondsNumber) ||
    isNaN(endSecondsNumber) ||
    endSecondsNumber <= startSecondsNumber
  ) {
    console.error('Invalid time range');
    return;
  }

  return {
    startSeconds: startSecondsNumber,
    endSeconds: endSecondsNumber,
  };
};
