export const getNetflixVideoPlayer = () => {
  return new Promise<NetflixVideoPlayer | null>((resolve) => {
    const videoPlayerApi =
      unsafeWindow.netflix?.appContext?.state?.playerApp?.getAPI?.().videoPlayer;

    if (!videoPlayerApi) {
      console.error('Netflix video player API not found');
      return resolve(null);
    }

    const firstVideoPlayerSessionId = videoPlayerApi.getAllPlayerSessionIds?.()?.[0];

    if (!firstVideoPlayerSessionId) {
      console.error('Netflix video player session IDs not found');
      return resolve(null);
    }

    const videoPlayer = videoPlayerApi.getVideoPlayerBySessionId?.(firstVideoPlayerSessionId);

    if (!videoPlayer) {
      console.error('Netflix video player not found');
      return resolve(null);
    }

    return resolve(videoPlayer);
  });
};

export const seekToSeconds = (videoPlayer: NetflixVideoPlayer, seconds: number) => {
  videoPlayer.seek?.(seconds * 1000);
};

export const getCurrentSeconds = (videoPlayer: NetflixVideoPlayer) => {
  return (videoPlayer.getCurrentTime?.() ?? 0) / 1000;
};
