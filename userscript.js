"use strict";
(() => {
  // src/getTimeRangeFromURL.ts
  var getTimeRangeFromURL = () => {
    const params = new URL(location.href).searchParams;
    const startSeconds = params.get("startSeconds");
    const endSeconds = params.get("endSeconds");
    if (!startSeconds || !endSeconds) {
      console.error("startSeconds or endSeconds not found");
      return;
    }
    const startSecondsNumber = Number(startSeconds);
    const endSecondsNumber = Number(endSeconds);
    if (isNaN(startSecondsNumber) || isNaN(endSecondsNumber) || endSecondsNumber <= startSecondsNumber) {
      console.error("Invalid time range");
      return;
    }
    return {
      startSeconds: startSecondsNumber,
      endSeconds: endSecondsNumber
    };
  };

  // src/netflixVideoPlayer.ts
  var getNetflixVideoPlayer = () => {
    return new Promise((resolve) => {
      const videoPlayerApi = unsafeWindow.netflix?.appContext?.state?.playerApp?.getAPI?.().videoPlayer;
      if (!videoPlayerApi) {
        console.error("Netflix video player API not found");
        return resolve(null);
      }
      const firstVideoPlayerSessionId = videoPlayerApi.getAllPlayerSessionIds?.()?.[0];
      if (!firstVideoPlayerSessionId) {
        console.error("Netflix video player session IDs not found");
        return resolve(null);
      }
      const videoPlayer = videoPlayerApi.getVideoPlayerBySessionId?.(firstVideoPlayerSessionId);
      if (!videoPlayer) {
        console.error("Netflix video player not found");
        return resolve(null);
      }
      return resolve(videoPlayer);
    });
  };
  var seekToSeconds = (videoPlayer, seconds) => {
    videoPlayer.seek?.(seconds * 1e3);
  };
  var getCurrentSeconds = (videoPlayer) => {
    return (videoPlayer.getCurrentTime?.() ?? 0) / 1e3;
  };

  // src/loopVideo.ts
  var loopVideo = async () => {
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

  // src/index.ts
  console.log("userscript loaded");
  window.addEventListener("load", () => {
    loopVideo();
  });
})();
