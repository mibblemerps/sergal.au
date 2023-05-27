export class Shop {
    constructor() {
        /**
         * @type {ShopItem[]}
         */
        this.items = [];
    }

    byId(id) {
        for (let item of this.items) {
            if (item.id === id) return item;
        }
        console.warn(`No shop item with the ID "${id}"`);
        return null;
    }
}

export class ShopItem {
    constructor(game, id, name, icon) {
        this.game = game;
        this.id = id;
        this.name = name;
        this.icon = icon;
        this.description = null;
        this.price = 0;
        this.nextPurchasePriceMultiplier = 1;
        this.merpsPerSecond = 0;
        this.merpsMultiplier = 0;
        this.prerequisites = [];
        this.unlocksAtMerps = 0;
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
    setUnlocksAt(unlocksAt) { this.unlocksAtMerps = unlocksAt; return this; }
    addPrerequisite(prerequisite) { this.prerequisites.push(prerequisite); return this; }
    setCallback(callback) { this.callback = callback; return this; }
    setCanOnlyOwnOne() { this.nextPurchasePriceMultiplier = null; return this; }

    increment(noPriceIncrease = false) {
        if (!noPriceIncrease) this.price = Math.round(this.price * this.nextPurchasePriceMultiplier);
        this.owned++;
        if (this.callback) this.callback();

        this.game.buyLog.push({
            id: this.id,
            noPriceIncrease: noPriceIncrease
        });
    }

    get canOnlyOwnOne() {
        return !this.nextPurchasePriceMultiplier;
    }
}
