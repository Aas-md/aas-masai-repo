// Base State
class State {
  insertCard(atm) {
    console.log("Action not allowed.");
  }
  enterPin(atm, pin) {
    console.log("Action not allowed.");
  }
  withdrawCash(atm, amount) {
    console.log("Action not allowed.");
  }
}

// ================= STATES =================

// Idle State
class IdleState extends State {
  insertCard(atm) {
    console.log("Card inserted. Please enter PIN.");
    atm.setState(new CardInsertedState());
  }
}

// Card Inserted State
class CardInsertedState extends State {
  enterPin(atm, pin) {
    if (pin === atm.correctPin) {
      console.log("PIN correct. You are authenticated.");
      atm.setState(new AuthenticatedState());
    } else {
      console.log("Incorrect PIN. Returning to Idle.");
      atm.setState(new IdleState());
    }
  }
}

// Authenticated State
class AuthenticatedState extends State {
  withdrawCash(atm, amount) {
    if (amount <= atm.balance) {
      console.log("Processing withdrawal...");
      atm.setState(new DispensingCashState(amount));
    } else {
      console.log("Insufficient balance.");
      atm.setState(new IdleState());
    }
  }
}

// Dispensing State
class DispensingCashState extends State {
  constructor(amount) {
    super();
    this.amount = amount;
  }

  dispense(atm) {
    atm.balance -= this.amount;
    console.log(`Dispensing ₹${this.amount}`);
    console.log(`Remaining Balance: ₹${atm.balance}`);
    console.log("Transaction complete. Returning to Idle.");
    atm.setState(new IdleState()); // FIXED
  }
}

// ================= CONTEXT =================

class ATM {
  constructor(balance, correctPin) {
    this.balance = balance;
    this.correctPin = correctPin;
    this.state = new IdleState();
  }

  setState(state) {
    this.state = state;
  }

  insertCard() {
    this.state.insertCard(this);
  }

  enterPin(pin) {
    this.state.enterPin(this, pin);
  }

  withdrawCash(amount) {
    this.state.withdrawCash(this, amount);

    // If dispensing state, trigger dispense
    if (this.state instanceof DispensingCashState) {
      this.state.dispense(this);
    }
  }
}

module.exports = ATM;
