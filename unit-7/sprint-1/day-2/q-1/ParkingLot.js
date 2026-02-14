class Vehicle {
  constructor(number, type) {
    this.number = number;
    this.type = type; // "Car", "EV", "Bike", "Truck"
  }
}

class Ticket {
  constructor(vehicle, rate) {
    this.vehicle = vehicle;
    this.rate = rate;
    this.entryTime = Date.now();
  }

  closeTicket() {
    const exitTime = Date.now();
    const hours = Math.ceil((exitTime - this.entryTime) / (1000 * 60 * 60));
    return hours * this.rate;
  }
}

class ParkingLot {
  constructor(floors, slotsPerFloor) {
    this.floors = [];
    this.tickets = new Map();

    for (let i = 0; i < floors; i++) {
      const slots = [];

      // Reserve first slot for EV
      slots.push({ type: "EV", occupied: false });

      for (let j = 1; j < slotsPerFloor; j++) {
        slots.push({ type: "NORMAL", occupied: false });
      }

      this.floors.push(slots);
    }

    this.rates = {
      Car: 20,
      Bike: 10,
      Truck: 30,
      EV: 25
    };
  }

  park(vehicle) {
    for (let floor of this.floors) {
      for (let slot of floor) {
        if (!slot.occupied) {
          if (vehicle.type === "EV" && slot.type === "EV") {
            slot.occupied = true;
            const ticket = new Ticket(vehicle, this.rates[vehicle.type]);
            this.tickets.set(vehicle.number, ticket);
            return "EV parked in reserved slot";
          }

          if (vehicle.type !== "EV" && slot.type === "NORMAL") {
            slot.occupied = true;
            const ticket = new Ticket(vehicle, this.rates[vehicle.type]);
            this.tickets.set(vehicle.number, ticket);
            return "Vehicle parked in normal slot";
          }

          if (vehicle.type === "EV" && slot.type === "NORMAL") {
            slot.occupied = true;
            const ticket = new Ticket(vehicle, this.rates[vehicle.type]);
            this.tickets.set(vehicle.number, ticket);
            return "EV parked in normal slot";
          }
        }
      }
    }
    return "Parking Full";
  }

  unpark(vehicleNumber) {
    const ticket = this.tickets.get(vehicleNumber);
    if (!ticket) return "Vehicle not found";

    const amount = ticket.closeTicket();
    this.tickets.delete(vehicleNumber);

    for (let floor of this.floors) {
      for (let slot of floor) {
        if (slot.occupied) {
          slot.occupied = false;
          break;
        }
      }
    }

    return `Total Charge: ${amount}`;
  }
}

module.exports = { ParkingLot, Vehicle };
