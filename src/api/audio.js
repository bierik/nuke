window.AudioContext = window.AudioContext || window.webkitAudioContext;
const context = new AudioContext();

export function load(url) {
  const request = new XMLHttpRequest();
  request.open('GET', url, true);
  request.responseType = 'arraybuffer';

  return new Promise((resolve) => {
    request.onload = () => {
      context.decodeAudioData(request.response, (buffer) => {
        resolve(buffer);
      });
    };

    request.send();
  });
}

export function play(buffer) {
  const source = context.createBufferSource();
  source.buffer = buffer;
  source.connect(context.destination);
  source.start(0);
}
