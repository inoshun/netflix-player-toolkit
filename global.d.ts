declare global {
  interface NetflixVideoPlayer {
    play?: () => void;
    pause?: () => void;
    seek?: (time: number) => void;
    getCurrentTime?: () => number;
  }

  interface Window {
    netflix?: {
      appContext?: {
        state?: {
          playerApp?: {
            getAPI?: () => {
              videoPlayer?: {
                getAllPlayerSessionIds?: () => string[];
                getVideoPlayerBySessionId?: (id: string) => NetflixVideoPlayer;
              };
            };
          };
        };
      };
    };
  }
}

export {};
