const { AppleFactory, SamsungFactory } = require("./DeviceFactory");

// Create Apple Laptop
const appleFactory = new AppleFactory();
const appleLaptop = appleFactory.createDevice("laptop");

// Create Samsung Phone
const samsungFactory = new SamsungFactory();
const samsungPhone = samsungFactory.createDevice("phone");

// Print specifications
appleLaptop.specifications();
samsungPhone.specifications();