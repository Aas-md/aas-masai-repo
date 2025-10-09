function createInventoryItem(name, category, price) {
    return {
        name, category, price,
        describeItem() {
            console.log(`Item: ${name}, Category: ${category}, Price: ${price}`);
        }
    };
}

function addItemDiscount(item, discountPercent) {
    item.discountedPrice = item.price * (1 - discountPercent / 100);
    item.applyDiscount = function () {
        console.log(`Discounted Price for ${item.name}: ${this.discountedPrice}`);
    };
    return item;
}

const item = createInventoryItem("Laptop", "Electronics", 1500);
item.describeItem();
// Output: Item: Laptop, Category: Electronics, Price: 1500

const discountedItem = addItemDiscount(item, 10);
discountedItem.applyDiscount();
// Output: Discounted Price for Laptop: 1350

