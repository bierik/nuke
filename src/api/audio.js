window.AudioContext = window.AudioContext || window.webkitAudioContext;

export async function load(url, context) {
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

export class Player {
  constructor() {
    this.startedAt = 0;
    this.pausedAt = 0;
    this.sourceNode = null;
    this.buffer = null;
    this.context = new AudioContext();
  }

  play(buffer) {
    if (!this.buffer) {
      this.buffer = buffer;
    }
    this.sourceNode = this.context.createBufferSource();
    this.sourceNode.connect(this.context.destination);
    this.sourceNode.buffer = this.buffer;
    this.sourceNode.start(0, this.pausedAt);
    this.startedAt = this.context.currentTime - this.pausedAt;
    this.pausedAt = 0;
  }

  stop() {
    if (this.sourceNode) {
      this.sourceNode.disconnect();
      this.sourceNode.stop(0);
      this.sourceNode = null;
    }
    this.pausedAt = 0;
    this.startedAt = 0;
  }

  pause() {
    const elapsed = this.context.currentTime - this.startedAt;
    this.stop();
    this.pausedAt = elapsed;
  }
}
