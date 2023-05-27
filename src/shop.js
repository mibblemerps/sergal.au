export class Shop {
    constructor() {
        /**
         * @type {ShopItem[]}
         */
        this.items = [];
    }
}

export class ShopItem {
    constructor(name, icon, description, price, nextPurchasePriceMultiplier, merpsPerSecond, merpsMultiplier, callback) {
        this.name = name;
        this.icon = icon;
        this.description = description;
        this.price = price;
        this.nextPurchasePriceMultiplier = nextPurchasePriceMultiplier;
        this.merpsPerSecond = merpsPerSecond ?? 0;
        this.merpsMultiplier = merpsMultiplier ?? 0;
        this.callback = callback;
        this.owned = 0;
    }

    add(noPriceIncrease = false) {
        if (!noPriceIncrease) this.price = Math.round(this.price * this.nextPurchasePriceMultiplier);
        this.owned++;
        if (this.callback) this.callback();
    }

    get canOnlyOwnOne() {
        return !this.nextPurchasePriceMultiplier;
    }
}
