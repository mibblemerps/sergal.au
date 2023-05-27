import * as Sound from './sound';
import {Shop, ShopItem} from './shop';
import SergalItem from './sergal';
import Cheese from './cheese';
const faCart = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" fill="#fff"><!--! Font Awesome Pro 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M0 24C0 10.7 10.7 0 24 0H69.5c22 0 41.5 12.8 50.6 32h411c26.3 0 45.5 25 38.6 50.4l-41 152.3c-8.5 31.4-37 53.3-69.5 53.3H170.7l5.4 28.5c2.2 11.3 12.1 19.5 23.6 19.5H488c13.3 0 24 10.7 24 24s-10.7 24-24 24H199.7c-34.6 0-64.3-24.6-70.7-58.5L77.4 54.5c-.7-3.8-4-6.5-7.9-6.5H24C10.7 48 0 37.3 0 24zM128 464a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zm336-48a48 48 0 1 1 0 96 48 48 0 1 1 0-96z"/></svg>';

window.Game = {
    /**
     * @type {HTMLElement}
     */
    el: null,

    merps: 0,
    nextSergalCost: 100,

    _merpsLastUpdate: null,
    _lastUpdateAt: new Date(),
    _lastCanAfford: null,

    /**
     * @type {HTMLElement}
     */
    sergalContainer: null,

    /**
     * @type {HTMLElement}
     */
    shopContainer: null,

    merpCountElements: null,
    mpsElements: null,

    /**
     * @type {HTMLElement[]}
     */
    sergals: [],

    shop: new Shop(),

    setup() {
        this.el = document.getElementsByTagName('main')[0];
        this.sergalContainer = Game.el.getElementsByClassName('sergals')[0];
        this.shopContainer = Game.el.getElementsByClassName('shop')[0];
        this.merpCountElements = Game.el.querySelectorAll('[data-merp-count]');
        this.mpsElements = Game.el.querySelectorAll('[data-mps]');

        const sergalItem = new SergalItem('Sergal', 'merp-icon.png', 'A sergal :3', 150, 2, 1, 0);

        // Add shop items
        this.shop.items.push(sergalItem);
        this.shop.items.push(new Cheese('Cheddar Cheese', 'cheddar.png', 'Tasty cheddar! It\'s in the name!', 100, 1));
        this.shop.items.push(new Cheese('Mozzarella Cheese', 'mozzarella.png', 'Supposedly healthier for your serg. Makes good cheese pulls.', 1000, 1));
        this.shop.items.push(new Cheese('Swiss Cheese', 'swiss.png', 'Sergs like holes, including those found in swiss cheese!', 10000, 1));
        this.shop.items.push(new Cheese('Brie Cheese', 'brie.png', 'Often enjoyed with crackers.', 10000, 1));
        this.shop.items.push(new Cheese('Parmesan Cheese', 'parmesan.png', 'You wouldn\'t eat this on it\'s own but your sergs will!', 10000, 1));
        this.shop.items.push(new Cheese('Pule Cheese', 'pule.png', 'The world\'s most expensive cheese for your most precious sergos!', 100000, 100));

        // Purchase starter sergal
        sergalItem.add(true);

        // Start update loop
        this.update();
        setInterval(() => {this.update()}, 1000);
    },

    merp(amount = 1) {
        this.merps += amount;

        this.update();
    },

    get merpsPerSecond() {
        let mps = 0;
        for (let item of this.shop.items) {
            mps += item.owned * item.merpsPerSecond * this.merpsMultiplier;
        }
        return mps;
    },

    get merpsMultiplier() {
        let multiplier = 0;
        for (let item of this.shop.items) {
            multiplier += (item.merpsMultiplier ?? 0) * item.owned;
        }
        return multiplier;
    },

    update() {
        const merpsChanged = this._merpsLastUpdate !== this.merps;

        for (let merpCountElement of this.merpCountElements) {
            merpCountElement.innerText = Math.round(this.merps);
        }

        for (let mpsElement of this.mpsElements) {
            mpsElement.innerText = Math.round(this.merpsPerSecond);
        }

        if (merpsChanged) this.updateShopContainer();

        this._merpsLastUpdate = this.merps;
    },

    updateShopContainer(force = false) {
        if (!force) {
            // Check if anything has changed
            let canAfford = [];
            for (let item of this.shop.items) {
                if (this.merps >= item.price) {
                    canAfford.push(item);
                }
            }
            if (this._lastCanAfford && canAfford.length === this._lastCanAfford.length && canAfford.every((e, i) => {
                return e === this._lastCanAfford[i]
            })) return;
            this._lastCanAfford = canAfford;
        }

        const table = this.shopContainer.querySelector('.items');
        table.replaceChildren();

        for (const item of this.shop.items) {
            if (item.canOnlyOwnOne && item.owned > 0) continue; // already owned

            const entryElm = document.createElement('div');
            entryElm.classList.add('item');

            const countElm = document.createElement('div');
            countElm.classList.add('item-count');
            if (!item.canOnlyOwnOne) countElm.innerText = item.owned;

            entryElm.appendChild(countElm);

            const nameElm = document.createElement('div');
            nameElm.classList.add('item-name');
            nameElm.innerText = item.name;
            entryElm.appendChild(nameElm);

            const buyElm = document.createElement('div');
            buyElm.classList.add('item-buy')
            buyElm.innerHTML = ` <span class="price">${faCart} ${item.price} merps</span>`;
            if (item.price > this.merps) {
                // Cannot afford
                buyElm.classList.add('item-cannot-afford');
            } else {
                // Can afford
                buyElm.classList.add('item-can-afford');
                buyElm.addEventListener('click', () => {
                    if (this.merps < item.price) return; // just incase we don't have enough anymore
                    this.merps -= item.price;
                    item.add();

                    this.updateShopContainer(true);
                });
            }
            entryElm.appendChild(buyElm);

            table.appendChild(entryElm);
        }
    },
};

window.addEventListener('load', () => {
    Game.setup();
});
