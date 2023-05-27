import {ShopItem} from './shop';

export default class Cheese extends ShopItem {
    constructor(name, icon, price, merpsMultiplier) {
        super(name, icon);
        this.price = price;
        this.merpsMultiplier = merpsMultiplier;
    }

    get canOnlyOwnOne() {
        return true;
    }
}