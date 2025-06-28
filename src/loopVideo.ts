import { getTimeRangeFromURL } from './getTimeRangeFromURL';
import { getCurrentSeconds, getNetflixVideoPlayer, seekToSeconds } from './netflixVideoPlayer';

export const loopVideo = async () => {
  const timeRange = getTimeRangeFromURL();

  if (!timeRange) return;

  const { startSeconds, endSeconds } = timeRange;

  const videoPlayer = await getNetflixVideoPlayer();

  if (!videoPlayer) return;

  seekToSeconds(videoPlayer, startSeconds);
  videoPlayer.play?.();

  const locationHref = location.href;

  const waitForReplay = setInterval(() => {
    const currentSeconds = getCurrentSeconds(videoPlayer);
    if (currentSeconds < startSeconds || currentSeconds > endSeconds) {
      seekToSeconds(videoPlayer, startSeconds);
    }
    if (location.href !== locationHref) clearInterval(waitForReplay);
  }, 250);
};
