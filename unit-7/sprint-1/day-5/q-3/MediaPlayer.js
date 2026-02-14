// State Interface (base class)
class State {
  play(player) {}
  pause(player) {}
  stop(player) {}
}

// Play State
class PlayState extends State {
  play(player) {
    console.log("Already Playing...");
  }

  pause(player) {
    console.log("Pausing media...");
    player.setState(new PauseState());
  }

  stop(player) {
    console.log("Stopping media...");
    player.setState(new StopState());
  }
}

// Pause State
class PauseState extends State {
  play(player) {
    console.log("Resuming media...");
    player.setState(new PlayState());
  }

  pause(player) {
    console.log("Already Paused...");
  }

  stop(player) {
    console.log("Stopping media from pause...");
    player.setState(new StopState());
  }
}

// Stop State
class StopState extends State {
  play(player) {
    console.log("Starting media from beginning...");
    player.setState(new PlayState());
  }

  pause(player) {
    console.log("Can't pause. Media is stopped.");
  }

  stop(player) {
    console.log("Already Stopped...");
  }
}

// Context
class MediaPlayer {
  constructor() {
    this.state = new StopState();
  }

  setState(state) {
    this.state = state;
  }

  play() {
    this.state.play(this);
  }

  pause() {
    this.state.pause(this);
  }

  stop() {
    this.state.stop(this);
  }
}

module.exports = MediaPlayer;
