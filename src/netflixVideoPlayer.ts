const getVideoPlayer = () => {
  const videoPlayerApi = unsafeWindow.netflix?.appContext?.state?.playerApp?.getAPI()?.videoPlayer;

  if (!videoPlayerApi) return;

  const firstVideoPlayerSessionId = videoPlayerApi.getAllPlayerSessionIds()[0];

  if (!firstVideoPlayerSessionId) return;

  return videoPlayerApi.getVideoPlayerBySessionId(firstVideoPlayerSessionId);
};

export const getNetflixVideoPlayer = () => {
  return new Promise<NetflixVideoPlayer | null>((resolve) => {
    const waitForReady = setInterval(() => {
      const videoPlayer = getVideoPlayer();

      if (videoPlayer) {
        clearInterval(waitForReady);
        clearTimeout(timeout);
        resolve(videoPlayer);
      }
    }, 500);

    const timeout = setTimeout(() => {
      console.error('Netflix video player not found after 10 seconds');
      clearInterval(waitForReady);
      resolve(null);
    }, 10000);
  });
};

export const playVideo = (videoPlayer: NetflixVideoPlayer) => {
  videoPlayer.play();
};

export const seekVideoToSeconds = (videoPlayer: NetflixVideoPlayer, seconds: number) => {
  videoPlayer.seek(seconds * 1000);
};

export const getCurrentVideoTimeInSeconds = (videoPlayer: NetflixVideoPlayer) => {
  return (videoPlayer.getCurrentTime() ?? 0) / 1000;
};
