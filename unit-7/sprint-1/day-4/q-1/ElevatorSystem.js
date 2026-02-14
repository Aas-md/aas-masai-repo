class Elevator {
  constructor(id, totalFloors) {
    this.id = id;
    this.currentFloor = 1;
    this.direction = "IDLE"; // UP, DOWN, IDLE
    this.state = "CloseDoor"; // MovingState, OpenDoor, CloseDoor
    this.occupancy = 0;
    this.weight = 0;
    this.totalFloors = totalFloors;
    this.maxPeople = 8;
    this.maxWeight = 680;
  }

  canTakeRequest(people, weight) {
    return (
      this.occupancy + people <= this.maxPeople &&
      this.weight + weight <= this.maxWeight
    );
  }

  moveToFloor(targetFloor) {
    if (this.currentFloor === targetFloor) {
      this.openDoor();
      return;
    }

    this.direction = targetFloor > this.currentFloor ? "UP" : "DOWN";
    this.state = "MovingState";

    while (this.currentFloor !== targetFloor) {
      this.currentFloor += this.direction === "UP" ? 1 : -1;
      console.log(
        `Elevator ${this.id} → Floor ${this.currentFloor} (${this.direction})`
      );
    }

    this.openDoor();
  }

  openDoor() {
    this.state = "OpenDoor";
    console.log(`Elevator ${this.id} Doors Open at Floor ${this.currentFloor}`);
    this.closeDoor();
  }

  closeDoor() {
    this.state = "CloseDoor";
    this.direction = "IDLE";
    console.log(`Elevator ${this.id} Doors Closed`);
  }

  boardPassengers(people, weight) {
    this.occupancy += people;
    this.weight += weight;
  }

  displayStatus() {
    console.log(
      `Elevator ${this.id} | Floor: ${this.currentFloor} | Direction: ${this.direction} | People: ${this.occupancy}`
    );
  }
}

class ElevatorSystem {
  constructor(totalFloors, totalElevators) {
    this.elevators = [];
    for (let i = 1; i <= totalElevators; i++) {
      this.elevators.push(new Elevator(i, totalFloors));
    }
  }

  findBestElevator(requestFloor) {
    let best = null;
    let minDistance = Infinity;

    for (let elevator of this.elevators) {
      if (elevator.state === "CloseDoor") {
        const distance = Math.abs(elevator.currentFloor - requestFloor);
        if (distance < minDistance) {
          minDistance = distance;
          best = elevator;
        }
      }
    }

    return best;
  }

  requestElevator(requestFloor, destinationFloor, people, weight) {
    const elevator = this.findBestElevator(requestFloor);

    if (!elevator) {
      console.log("All elevators busy. Request logged.");
      return;
    }

    if (!elevator.canTakeRequest(people, weight)) {
      console.log("Elevator capacity exceeded. Please wait.");
      return;
    }

    console.log(`Elevator ${elevator.id} assigned.`);

    elevator.moveToFloor(requestFloor);
    elevator.boardPassengers(people, weight);
    elevator.moveToFloor(destinationFloor);

    elevator.displayStatus();
  }
}

module.exports = { ElevatorSystem };
