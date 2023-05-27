export class Shop {
    constructor() {
        /**
         * @type {ShopItem[]}
         */
        this.items = [];
    }
}

export class ShopItem {
    constructor(name, icon) {
        this.name = name;
        this.icon = icon;
        this.description = null;
        this.price = 0;
        this.nextPurchasePriceMultiplier = 1;
        this.merpsPerSecond = 0;
        this.merpsMultiplier = 0;
        this.prerequisites = [];
        this.callback = null;
        this.owned = 0;
    }

    setName(name) { this.name = name; return this; }
    setIcon(icon) { this.icon = icon; return this; }
    setDescription(description) { this.description = description; return this; }
    setPrice(price) { this.price = price; return this; }
    setNextPurchasePriceMultiplier(multiplier) { this.nextPurchasePriceMultiplier = multiplier; return this; }
    setMerpsPerSecond(merpsPerSecond) { this.merpsPerSecond = merpsPerSecond; return this; }
    setMerpsMultiplier(merpsMultiplier) { this.merpsMultiplier = merpsMultiplier; return this; }
    setPrerequisites(prerequisites) { this.prerequisites = prerequisites; return this; }
    addPrerequisite(prerequisite) { this.prerequisites.push(prerequisite); return this; }
    setCallback(callback) { this.callback = callback; return this; }

    increment(noPriceIncrease = false) {
        if (!noPriceIncrease) this.price = Math.round(this.price * this.nextPurchasePriceMultiplier);
        this.owned++;
        if (this.callback) this.callback();
    }

    get canOnlyOwnOne() {
        return !this.nextPurchasePriceMultiplier;
    }
}
