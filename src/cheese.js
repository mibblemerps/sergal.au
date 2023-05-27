import {ShopItem} from './shop';

export default class Cheese extends ShopItem {
    constructor(game, id, name, icon, price, merpsMultiplier) {
        super(game, id, name, icon);
        this.price = price;
        this.merpsMultiplier = merpsMultiplier;
    }

    get canOnlyOwnOne() {
        return true;
    }
}