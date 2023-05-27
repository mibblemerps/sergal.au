import {ShopItem} from './shop';

export default class Cheese extends ShopItem {
    constructor(name, icon, description, price, merpsMultiplier) {
        super(name, icon, description, price, null, null, merpsMultiplier, null);
    }

    get canOnlyOwnOne() {
        return true;
    }
}