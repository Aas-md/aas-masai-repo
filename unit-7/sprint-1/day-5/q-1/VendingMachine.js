// State Interface
class State {
  insertCoin(machine) {}
  selectItem(machine) {}
  dispense(machine) {}
}

// Idle State
class IdleState extends State {
  insertCoin(machine) {
    console.log("Coin inserted.");
    machine.setState(machine.processingState);
  }

  selectItem() {
    console.log("Insert coin first.");
  }

  dispense() {
    console.log("Payment required.");
  }
}

// Processing State
class ProcessingState extends State {
  insertCoin() {
    console.log("Already processing.");
  }

  selectItem(machine) {
    console.log("Item selected.");
    machine.setState(machine.dispensingState);
  }

  dispense() {
    console.log("Select item first.");
  }
}

// Dispensing State
class DispensingState extends State {
  insertCoin() {
    console.log("Wait, dispensing item.");
  }

  selectItem() {
    console.log("Already dispensing.");
  }

  dispense(machine) {
    console.log("Dispensing item...");
    machine.setState(machine.idleState);
  }
}

// Context Class
class VendingMachine {
  constructor() {
    this.idleState = new IdleState();
    this.processingState = new ProcessingState();
    this.dispensingState = new DispensingState();

    this.state = this.idleState; // initial state
  }

  setState(state) {
    this.state = state;
  }

  insertCoin() {
    this.state.insertCoin(this);
  }

  selectItem() {
    this.state.selectItem(this);
  }

  dispense() {
    this.state.dispense(this);
  }
}

module.exports = { VendingMachine };
