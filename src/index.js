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

    shop: new Shop(),
    buyLog: [],

    setup() {
        this.el = document.getElementsByTagName('main')[0];
        this.sergalContainer = Game.el.getElementsByClassName('sergals')[0];
        this.shopContainer = Game.el.getElementsByClassName('shop')[0];
        this.merpCountElements = Game.el.querySelectorAll('[data-merp-count]');
        this.mpsElements = Game.el.querySelectorAll('[data-mps]');

        this.shop.items.push(new Cheese(this, 'cheddar-cheese', 'Cheddar Cheese', 'cheddar.png', 100, 1)
            .setDescription('Tasty cheddar! It\'s in the name!')
            .setPrice(100)
            .setMerpsMultiplier(1));
        this.shop.items.push(new Cheese(this, 'slice-cheese', 'Slice Cheese', 'slice.png', 750, 1)
            .setDescription('Processed sliced cheese. It\'s only redeeming quality is that it\'s good in toasties.')
            .addPrerequisite('cheddar-cheese')
            .setPrice(750)
            .setMerpsMultiplier(1));
        this.shop.items.push(new Cheese(this, 'mozzarella-cheese', 'Mozzarella Cheese', 'mozzarella.png')
            .setDescription('Supposedly healthier for your serg. Makes good cheese pulls.')
            .addPrerequisite('slice-cheese')
            .setPrice(1500)
            .setMerpsMultiplier(2));
        this.shop.items.push(new Cheese(this, 'swiss-cheese', 'Swiss Cheese', 'swiss.png')
            .setDescription('Sergs like holes, including those found in swiss cheese!')
            .addPrerequisite('mozzarella-cheese')
            .setPrice(10000)
            .setMerpsMultiplier(4));
        this.shop.items.push(new Cheese(this, 'brie-cheese', 'Brie Cheese', 'brie.png')
            .setDescription('Often enjoyed with crackers, but you don\'t have any.')
            .addPrerequisite('swiss-cheese')
            .setPrice(100000)
            .setMerpsMultiplier(8));
        this.shop.items.push(new Cheese(this, 'parmesan-cheese', 'Parmesan Cheese', 'parmesan.png')
            .setDescription('Underrated.')
            .addPrerequisite('brie-cheese')
            .setPrice(1000000)
            .setMerpsMultiplier(16));
        this.shop.items.push(new Cheese(this, 'pule-cheese', 'Pule Cheese', 'pule.png')
            .setDescription('The world\'s most expensive cheese for your most precious sergos!')
            .addPrerequisite('parmesan-cheese')
            .setPrice(10000000)
            .setMerpsMultiplier(32));

        this.shop.items.push(new SergalItem(this, 'sergal', 'Sergal', 'merp-icon.png', 'img/sergal-1.png', 'img/sergal-2.png', 'merp.mp3', 0.5)
            .setPrice(150)
            .setNextPurchasePriceMultiplier(2)
            .setMerpsPerSecond(1)
            .setDescription('A sergal :3')
            .addPrerequisite('cheddar-cheese')); // we require the first cheese upgrade so the player understands why they would want more sergals
        this.shop.items.push(new SergalItem(this, 'pink-sergal', 'Pink Sergal', 'pinksergal-1.png', 'img/pinksergal-1.png', 'img/pinksergal-2.png', 'merp.mp3', 0.6)
            .setPrice(1000)
            .setNextPurchasePriceMultiplier(2)
            .setMerpsPerSecond(4)
            .setDescription('Happy pink sergals.')
            .addPrerequisite('cheddar-cheese'));
        this.shop.items.push(new SergalItem(this, 'dark-sergal', 'Dark Sergal', 'darksergal-1.png', 'img/darksergal-1.png', 'img/darksergal-2.png', 'merp.mp3', 0.7)
            .setPrice(10000)
            .setNextPurchasePriceMultiplier(2)
            .setMerpsPerSecond(8)
            .setDescription('These gray sergals might look scary but they\'re actually just as fluffy.')
            .addPrerequisite('pink-sergal'));
        this.shop.items.push(new SergalItem(this, 'protogen', 'Protogen', 'proto-1.png', 'img/proto-1.png', 'img/proto-2.png', 'beep.mp3', 0.5)
            .setPrice(100000)
            .setNextPurchasePriceMultiplier(2)
            .setMerpsPerSecond(16)
            .setDescription('digital serg')
            .addPrerequisite('dark-sergal'));
        this.shop.items.push(new SergalItem(this, 'synth', 'Synth', 'synth-1.png', 'img/synth-1.png', 'img/synth-2.png', 'beep.mp3', 0.75)
            .setPrice(1000000)
            .setNextPurchasePriceMultiplier(2)
            .setMerpsPerSecond(32)
            .setDescription('An technologically advanced protogen')
            .addPrerequisite('protogen'));

        this.shop.items.push(new ShopItem(this, 'manual-merping-1', 'Enhanced Manual Merps', 'enhanced-manual-merps.png')
            .setDescription('Your cursor is pointier, this makes clicking sergals 50% more efficient.')
            .setPrice(1500)
            .setCanOnlyOwnOne()
            .setUnlocksAt(1000));
        this.shop.items.push(new ShopItem(this, 'manual-merping-2', 'Further Enhanced Manual Merps', 'further-enhanced-manual-merps.png')
            .setDescription('Your cursor is *even* pointier. It now has the ability to extract another 50% more merps per click.')
            .setPrice(15000)
            .setCanOnlyOwnOne()
            .addPrerequisite('manual-merping-1')
            .setUnlocksAt(10000));

        if (!this.load()) {
            // Purchase starter sergal
            this.shop.byId('sergal').increment(true);
        }

        // Start cheese drop loop
        this.startCheeseDropEffect();

        // Track mouse position
        document.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
        });

        // Start update loop
        this.update();
        setInterval(() => {this.update()}, 1000);
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
        if (this.shop.byId('manual-merping-1').owned > 0) multiplier += 0.5;
        if (this.shop.byId('manual-merping-2').owned > 0) multiplier += 0.5;

        // Combine with base multiplier
        return multiplier * Math.max(this.merpMultiplier, 1);
    },

    save() {
        let saveData = {
            merps: this.merps,
            highestMerps: this.highestMerps,
            buyLog: this.buyLog
        };
        window.localStorage.saveData = JSON.stringify(saveData);
    },

    load() {
        if (!window.localStorage.saveData) return false;

        const saveData = JSON.parse(window.localStorage.saveData);
        this.merps = saveData.merps;
        this.highestMerps = saveData.highestMerps;

        for (let entry of saveData.buyLog) {
            this.shop.byId(entry.id).increment(entry.noPriceIncrease);
        }

        return true;
    },

    update() {
        const merpsChanged = this._merpsLastUpdate !== this.merps;
        if (!merpsChanged) return;

        for (let merpCountElement of this.merpCountElements) {
            merpCountElement.innerText = numberFormat(this.merps, 2);
        }

        for (let mpsElement of this.mpsElements) {
            mpsElement.innerText = numberFormat(this.merpsPerSecond);
        }

        this.updateShopContainer();

        if (this.merps >= 15 && this.shopContainer.classList.contains('hidden')) {
            this.shopContainer.classList.remove('hidden');
        }

        this.save();

        this._merpsLastUpdate = this.merps;
    },

    updateShopContainer(force = false) {
        const isVisibleInShop = (item) => {
            // Already owned
            if (item.canOnlyOwnOne && item.owned > 0) return false;

            // Check we own the prerequisites
            if (!item.prerequisites.every(req => this.shop.items.find(item => item.id === req && item.owned > 0))) return false;

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
            let interval = (1 / (this.merpsPerSecond / 10)) * 1000;
            interval = Math.min(Math.max(interval, 200), 4000);

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
