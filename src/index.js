import * as Sound from './sound';
import {Shop, ShopItem} from './shop';
import SergalItem from './sergal';
import Cheese from './cheese';
import numberFormat from './number-format';
import {spawnImageMote, spawnMote} from './motes';
const faCart = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" fill="#fff"><!--! Font Awesome Pro 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M0 24C0 10.7 10.7 0 24 0H69.5c22 0 41.5 12.8 50.6 32h411c26.3 0 45.5 25 38.6 50.4l-41 152.3c-8.5 31.4-37 53.3-69.5 53.3H170.7l5.4 28.5c2.2 11.3 12.1 19.5 23.6 19.5H488c13.3 0 24 10.7 24 24s-10.7 24-24 24H199.7c-34.6 0-64.3-24.6-70.7-58.5L77.4 54.5c-.7-3.8-4-6.5-7.9-6.5H24C10.7 48 0 37.3 0 24zM128 464a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zm336-48a48 48 0 1 1 0 96 48 48 0 1 1 0-96z"/></svg>';

window.Game = {
    /**
     * @type {HTMLElement}
     */
    el: null,

    merps: 0,
    highestMerps: 0,


    _merpsLastUpdate: null,
    _lastUpdateAt: new Date(),
    _lastCanAfford: null,
    _lastVisibleInShop: null,

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

    mouseX: 0,
    mouseY: 0,

    /**
     * @type {HTMLElement[]}
     */
    sergals: [],

    /**
     * @type {ShopItem}
     */
    manualMerping: null,

    shop: new Shop(),

    setup() {
        this.el = document.getElementsByTagName('main')[0];
        this.sergalContainer = Game.el.getElementsByClassName('sergals')[0];
        this.shopContainer = Game.el.getElementsByClassName('shop')[0];
        this.merpCountElements = Game.el.querySelectorAll('[data-merp-count]');
        this.mpsElements = Game.el.querySelectorAll('[data-mps]');

        let cheddarCheese = new Cheese('Cheddar Cheese', 'cheddar.png', 100, 1)
            .setDescription('Tasty cheddar! It\'s in the name!')
            .setPrice(100)
            .setMerpsMultiplier(1);
        let sliceCheese = new Cheese('Slice Cheese', 'slice.png', 750, 1)
            .setDescription('Processed sliced cheese. It\'s only redeeming quality is that it\'s good in toasties.')
            .addPrerequisite(cheddarCheese)
            .setPrice(750)
            .setMerpsMultiplier(1);
        let mozzarellaCheese = new Cheese('Mozzarella Cheese', 'mozzarella.png')
            .setDescription('Supposedly healthier for your serg. Makes good cheese pulls.')
            .addPrerequisite(sliceCheese)
            .setPrice(1500)
            .setMerpsMultiplier(2);
        let swissCheese = new Cheese('Swiss Cheese', 'swiss.png')
            .setDescription('Sergs like holes, including those found in swiss cheese!')
            .addPrerequisite(mozzarellaCheese)
            .setPrice(10000)
            .setMerpsMultiplier(4);
        let brieCheese = new Cheese('Brie Cheese', 'brie.png')
            .setDescription('Often enjoyed with crackers.')
            .addPrerequisite(swissCheese)
            .setPrice(100000)
            .setMerpsMultiplier(8);
        let parmesanCheese = new Cheese('Parmesan Cheese', 'parmesan.png')
            .setDescription('You wouldn\'t eat this on it\'s own but your sergs will!')
            .addPrerequisite(brieCheese)
            .setPrice(1000000)
            .setMerpsMultiplier(16);
        let puleCheese = new Cheese('Pule Cheese', 'pule.png')
            .setDescription('The world\'s most expensive cheese for your most precious sergos!')
            .addPrerequisite(parmesanCheese)
            .setPrice(10000000)
            .setMerpsMultiplier(32);

        const sergalItem = new SergalItem('Sergal', 'merp-icon.png', 'img/sergal-1.png', 'img/sergal-2.png', 0.5)
            .setPrice(150)
            .setNextPurchasePriceMultiplier(2)
            .setMerpsPerSecond(1)
            .setDescription('A sergal :3')
            .addPrerequisite(cheddarCheese); // we require the first cheese upgrade so the player understands why they would want more sergals
        const pinkSergalItem = new SergalItem('Pink Sergal', 'pinksergal-1.png', 'img/pinksergal-1.png', 'img/pinksergal-2.png', 0.6)
            .setPrice(1000)
            .setNextPurchasePriceMultiplier(2)
            .setMerpsPerSecond(4)
            .setDescription('Happy pink sergals.')
            .addPrerequisite(cheddarCheese);
        const darkSergalItem = new SergalItem('Dark Sergal', 'darksergal-1.png', 'img/darksergal-1.png', 'img/darksergal-2.png', 0.7)
            .setPrice(10000)
            .setNextPurchasePriceMultiplier(2)
            .setMerpsPerSecond(8)
            .setDescription('These gray sergals might look scary but they\'re actually just as fluffy.')
            .addPrerequisite(pinkSergalItem);
        const protogenItem = new SergalItem('Protogen', 'proto-1.png', 'img/proto-1.png', 'img/proto-2.png', 0.8)
            .setPrice(100000)
            .setNextPurchasePriceMultiplier(2)
            .setMerpsPerSecond(16)
            .setDescription('digital serg')
            .addPrerequisite(darkSergalItem);
        const synthItem = new SergalItem('Synth', 'synth-1.png', 'img/synth-1.png', 'img/synth-2.png', 0.9)
            .setPrice(1000000)
            .setNextPurchasePriceMultiplier(2)
            .setMerpsPerSecond(32)
            .setDescription('An technologically advanced protogen')
            .addPrerequisite(protogenItem);

        this.manualMerping = new ShopItem('Enhanced Manual Merps', 'enhanced-manual-merps.png')
            .setDescription('Your cursor is pointier, this makes clicking sergals 50% more efficient.')
            .setPrice(1500)
            .setCanOnlyOwnOne()
            .setUnlocksAt(1000)
        this.manualMerping2 = new ShopItem('Further Enhanced Manual Merps', 'further-enhanced-manual-merps.png')
            .setDescription('Your cursor is *even* pointier. It now has the ability to extract another 50% more merps per click.')
            .setPrice(15000)
            .setCanOnlyOwnOne()
            .addPrerequisite(this.manualMerping)
            .setUnlocksAt(10000);


        this.shop.items.push(sergalItem);
        this.shop.items.push(this.manualMerping);
        this.shop.items.push(this.manualMerping2);
        this.shop.items.push(pinkSergalItem);
        this.shop.items.push(darkSergalItem);
        this.shop.items.push(protogenItem);
        this.shop.items.push(synthItem);
        this.shop.items.push(cheddarCheese);
        this.shop.items.push(sliceCheese);
        this.shop.items.push(mozzarellaCheese);
        this.shop.items.push(swissCheese);
        this.shop.items.push(brieCheese);
        this.shop.items.push(parmesanCheese);
        this.shop.items.push(puleCheese);

        // Purchase starter sergal
        sergalItem.increment(true);

        // Start update loop
        this.update();
        setInterval(() => {this.update()}, 1000);

        // Start cheese drop loop
        this.startCheeseDropEffect();

        // Track mouse position
        document.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
        });
    },

    merp(amount = 1) {
        this.merps += amount;
        this.highestMerps = Math.max(this.merps, this.highestMerps);

        this.update();
    },

    get merpsPerSecond() {
        let mps = 0;
        for (let item of this.shop.items) {
            mps += item.owned * item.merpsPerSecond * this.merpMultiplier;
        }
        return mps;
    },

    get merpMultiplier() {
        let multiplier = 0;
        for (let item of this.shop.items) {
            multiplier += (item.merpsMultiplier ?? 0) * item.owned;
        }
        return multiplier;
    },

    get merpClickMultiplier() {
        let multiplier = 1;
        if (this.manualMerping.owned > 0) multiplier += 0.5;
        if (this.manualMerping2.owned > 0) multiplier += 0.5;

        // Combine with base multiplier
        return multiplier * Math.max(this.merpMultiplier, 1);
    },

    update() {
        const merpsChanged = this._merpsLastUpdate !== this.merps;

        for (let merpCountElement of this.merpCountElements) {
            merpCountElement.innerText = numberFormat(this.merps, 2);
        }

        for (let mpsElement of this.mpsElements) {
            mpsElement.innerText = numberFormat(this.merpsPerSecond);
        }

        if (merpsChanged) this.updateShopContainer();

        if (merpsChanged && this.merps >= 15 && this.shopContainer.classList.contains('hidden')) {
            this.shopContainer.classList.remove('hidden');
        }

        this._merpsLastUpdate = this.merps;
    },

    updateShopContainer(force = false) {
        const isVisibleInShop = (item) => {
            // Already owned
            if (item.canOnlyOwnOne && item.owned > 0) return false;

            // Check we own the prerequisites
            if (!item.prerequisites.every(req => this.shop.items.find(item => item === req && item.owned > 0))) return false;

            // Check we've reached the unlock threshold
            if (this.highestMerps < item.unlocksAtMerps) return false;

            return true;
        }

        if (!force) {
            // Check if anything has changed
            let isVisible = [];
            let canAfford = [];
            for (let item of this.shop.items) {
                if (this.merps >= item.price) canAfford.push(item);
                if (isVisibleInShop(item)) isVisible.push(item);
            }
            if (this._lastCanAfford && canAfford.length === this._lastCanAfford.length && canAfford.every((e, i) => { return e === this._lastCanAfford[i]  })) return;
            if (this._lastVisibleInShop && isVisible.length === this._lastVisibleInShop && isVisible.every((e, i) => { return e === this._lastVisibleInShop[i]; })) return;
            this._lastCanAfford = canAfford;
            this._lastVisibleInShop = isVisible;
        }

        const table = this.shopContainer.querySelector('.items');
        for (let elm of table.querySelectorAll('.item')) {
            elm.remove();
        }
        const template = table.querySelector('template');

        for (const item of this.shop.items) {
            if (!isVisibleInShop(item)) continue;

            const entryElm = template.content.cloneNode(true);

            for (const element of entryElm.querySelectorAll('[data-item-name]')) {
                element.innerText = item.name;
            }
            if (item.description) {
                for (const element of entryElm.querySelectorAll('[data-item-description]')) {
                    element.innerText = item.description;
                }
            }
            for (const element  of entryElm.querySelectorAll('[data-item-price]')) {
                element.innerText = numberFormat(item.price);
            }
            for (const element of entryElm.querySelectorAll('[data-item-count]')) {
                if (!item.canOnlyOwnOne) element.innerText = numberFormat(item.owned);
            }

            if (item.icon) entryElm.querySelector('img.item-icon').src = 'img/' + item.icon;

            let buyButton = entryElm.querySelector('.item-buy');
            if (item.price > this.merps) {
                // Cannot afford
                buyButton.classList.add('item-cannot-afford');
            } else {
                // Can afford
                buyButton.classList.add('item-can-afford');
                buyButton.addEventListener('click', () => {
                    if (this.merps < item.price) return; // just incase we don't have enough anymore
                    this.merps -= item.price;
                    item.increment();

                    this.updateShopContainer(true);
                });
            }

            table.appendChild(entryElm);
        }
    },

    async startCheeseDropEffect() {
        while (true) {
            if (this.merpsPerSecond === 0) {
                // No mps
                await new Promise(r => setTimeout(r, 1000));
                continue;
            }
            let interval = (1 / (this.merpsPerSecond / 2)) * 1000;
            interval = Math.max(interval, 200);

            await new Promise(r => setTimeout(r, interval));
            if (interval) this.dropCheeseEffect();
        }
    },

    dropCheeseEffect() {
        let cheeses = [];
        for (let item of this.shop.items) {
            if ((item instanceof Cheese) && item.owned > 0) {
                cheeses.push(item);
            }
        }

        if (cheeses.length > 0) {
            let cheese = cheeses[Math.floor(Math.random() * cheeses.length)];
            let mote = spawnImageMote(Math.random() * this.sergalContainer.clientWidth, 0, 'cheese-drop-mote', 'img/' + cheese.icon, 3000, this.sergalContainer);
            mote.addEventListener('mousedown', () => {
                const amount = cheese.merpsMultiplier * 10;
                this.merp(amount)
                const merpMoteElement = document.createElement('div');
                merpMoteElement.classList.add('merp-mote');
                merpMoteElement.innerText = 'merp +' + amount;
                spawnMote(this.mouseX, this.mouseY, merpMoteElement, 500);
                mote.remove();
            });
        }
    },
};

window.addEventListener('load', () => {
    Game.setup();
});
