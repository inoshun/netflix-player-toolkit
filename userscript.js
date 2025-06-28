// ==UserScript==
// @name         Netflix player toolkit
// @namespace    http://tampermonkey.net/
// @version      1.0.5
// @description  Netflix player toolkit
// @author       inoshun
// @match        https://www.netflix.com/watch/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=netflix.com
// @updateURL    https://inoshun.github.io/netflix-player-toolkit/userscript.js
// @downloadURL  https://inoshun.github.io/netflix-player-toolkit/userscript.js
// @grant        unsafeWindow
// ==/UserScript==
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
  var getVideoPlayer = () => {
    const videoPlayerApi = unsafeWindow.netflix?.appContext?.state?.playerApp?.getAPI()?.videoPlayer;
    if (!videoPlayerApi) return;
    const firstVideoPlayerSessionId = videoPlayerApi.getAllPlayerSessionIds()[0];
    if (!firstVideoPlayerSessionId) return;
    return videoPlayerApi.getVideoPlayerBySessionId(firstVideoPlayerSessionId);
  };
  var getNetflixVideoPlayer = () => {
    return new Promise((resolve) => {
      const waitForReady = setInterval(() => {
        const videoPlayer = getVideoPlayer();
        if (videoPlayer) {
          clearInterval(waitForReady);
          clearTimeout(timeout);
          resolve(videoPlayer);
        }
      }, 500);
      const timeout = setTimeout(() => {
        console.error("Netflix video player not found after 10 seconds");
        clearInterval(waitForReady);
        resolve(null);
      }, 1e4);
    });
  };
  var seekToSeconds = (videoPlayer, seconds) => {
    videoPlayer.seek(seconds * 1e3);
  };
  var getCurrentSeconds = (videoPlayer) => {
    return (videoPlayer.getCurrentTime() ?? 0) / 1e3;
  };

  // src/loopVideo.ts
  var loopVideo = async () => {
    const timeRange = getTimeRangeFromURL();
    if (!timeRange) return;
    const { startSeconds, endSeconds } = timeRange;
    const videoPlayer = await getNetflixVideoPlayer();
    if (!videoPlayer) return;
    seekToSeconds(videoPlayer, startSeconds);
    videoPlayer.play();
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
  console.log("Netflix Player Toolkit");
  window.addEventListener("load", () => {
    loopVideo();
  });
})();
