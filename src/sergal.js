import {ShopItem} from './shop';
import * as Sound from './sound';
import {spawnImageMote, spawnMote} from './motes';

const merpVariance = 250;

const merpQuips = [
    'uwu',
    'owo',
    '>:3',
    '>///<',
    'gib cheese',
    'wedj',
    'pointy',
    'beep',
];

export default class SergalItem extends ShopItem {
    constructor(name, icon, defaultImage, openImage, volume = 1) {
        super(name, icon);
        this.defaultImage = defaultImage;
        this.openImage = openImage;
        this.volume = volume;

        this.callback = this._callback;
    }

    async _callback() {
        const sergal = document.createElement('div');
        sergal.classList.add('sergal');
        sergal.dataset.shopId = '0';
        sergal.dataset.lastMerp = new Date().getTime().toString();
        const img = document.createElement('img');
        img.src = this.defaultImage;
        img.alt = 'Sergal';
        img.draggable = false;
        sergal.appendChild(img);
        Game.sergalContainer.appendChild(sergal);
        Game.sergals.push(sergal);

        sergal.merpDown = (e, amount) => {
            e?.preventDefault();
            amount = amount ?? this.merpsPerSecond;
            img.src = this.openImage;

            Sound.play('merp.mp3', this.volume);
            const rect = sergal.getBoundingClientRect();
            let x = rect.x + (Math.random() * 150);
            const mote = document.createElement('div');
            mote.classList.add('merp-mote');
            mote.innerText = 'merp +' + this.merpsPerSecond;
            if (Math.random() < 0.01) {
                mote.innerText = merpQuips[Math.floor(Math.random() * merpQuips.length)];
            }
            spawnMote(x, rect.y, mote, 500);
            Game.merp(amount);
        }
        sergal.merpUp = () => {
            img.src = this.defaultImage;
        }
        sergal.addEventListener('mousedown', sergal.merpDown);
        sergal.addEventListener('mouseup', sergal.merpUp);
        sergal.addEventListener('mouseleave', sergal.merpUp);

        sergal.addEventListener('touchstart', sergal.merpDown);
        sergal.addEventListener('touchend', sergal.merpUp);
        sergal.addEventListener('touchcancel', sergal.merpUp);

        sergal.addEventListener('contextmenu', e => {e.preventDefault()});

        // Merp loop
        let lastMerp = new Date();
        await new Promise(r => setTimeout(r, Math.random() * 1000));
        while (true) {
            await new Promise(r => setTimeout(r, 1000 + (Math.random() * merpVariance - (merpVariance / 2))));
            let delta = (new Date() - lastMerp) / 1000;
            lastMerp = new Date();
            let merpAmount = this.merpsPerSecond * Game.merpsMultiplier * delta;
            if (merpAmount === 0) continue;
            sergal.merpDown(null, merpAmount);
            await new Promise(r => setTimeout(r, 100));
            sergal.merpUp();
        }
    }
}