// Device Interface
class Device {
  specifications() {
    console.log("Device specifications");
  }
}

// ---------------- Apple Devices ----------------

class AppleLaptop extends Device {
  specifications() {
    console.log("Apple Laptop: M2 Chip, 16GB RAM, 512GB SSD");
  }
}

class ApplePhone extends Device {
  specifications() {
    console.log("Apple Phone: A16 Bionic, 8GB RAM, 256GB Storage");
  }
}

// ---------------- Samsung Devices ----------------

class SamsungLaptop extends Device {
  specifications() {
    console.log("Samsung Laptop: i7 Processor, 16GB RAM, 1TB SSD");
  }
}

class SamsungPhone extends Device {
  specifications() {
    console.log("Samsung Phone: Snapdragon 8 Gen, 12GB RAM, 256GB Storage");
  }
}

// ---------------- Abstract Factory ----------------

class DeviceFactory {
  createDevice(type) {}
}

// ---------------- Apple Factory ----------------

class AppleFactory extends DeviceFactory {
  createDevice(type) {
    if (type === "laptop") {
      return new AppleLaptop();
    } else if (type === "phone") {
      return new ApplePhone();
    }
  }
}

// ---------------- Samsung Factory ----------------

class SamsungFactory extends DeviceFactory {
  createDevice(type) {
    if (type === "laptop") {
      return new SamsungLaptop();
    } else if (type === "phone") {
      return new SamsungPhone();
    }
  }
}

module.exports = {
  AppleFactory,
  SamsungFactory
};