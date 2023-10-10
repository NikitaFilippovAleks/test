let mainVideo = document.querySelector(".main-video");
let advVideo = document.querySelector(".advertising");
let skipButton = document.querySelector(".skip-button");
let playButton = document.querySelector(".play-button");

function onSkipClick () {
  advVideo.style.display = 'none';
  skipButton.style.display = 'none';
  mainVideo.controls = true;
  mainVideo.play();
}

function onPlayClick () {
  advVideo.style.display = 'block';
  playButton.style.display = 'none';
  skipButton.style.display = 'block';
  advVideo.play();
  let timer = setInterval(() => {
    // if(advVideo.readyState === 4) {
    //   advVideo.play();
    // }
    if (time === 0) {
      skipButton.firstChild.data = 'Skip';
      skipButton.disabled = false;

      return clearInterval(timer);
    }
    time = time - 1;

    skipButton.firstChild.data = `Skip ${time}`;
  }, 1000)
}

let time = 5;

skipButton.firstChild.data = 'Skip 5';

skipButton.addEventListener("click", onSkipClick);
playButton.addEventListener("click", onPlayClick);