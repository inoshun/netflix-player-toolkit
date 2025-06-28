import { getTimeRangeFromURL } from './getTimeRangeFromURL';
import {
  getCurrentVideoTimeInSeconds,
  getNetflixVideoPlayer,
  playVideo,
  seekVideoToSeconds,
} from './netflixVideoPlayer';

export const loopVideo = async () => {
  const timeRange = getTimeRangeFromURL();

  if (!timeRange) return;

  const { startSeconds, endSeconds } = timeRange;

  const videoPlayer = await getNetflixVideoPlayer();

  if (!videoPlayer) return;

  seekVideoToSeconds(videoPlayer, startSeconds);
  playVideo(videoPlayer);

  const locationHref = location.href;

  const waitForReplay = setInterval(() => {
    const currentSeconds = getCurrentVideoTimeInSeconds(videoPlayer);
    if (currentSeconds < startSeconds || currentSeconds > endSeconds) {
      seekVideoToSeconds(videoPlayer, startSeconds);
    }
    if (location.href !== locationHref) clearInterval(waitForReplay);
  }, 250);
};
