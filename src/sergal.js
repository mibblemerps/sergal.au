import {ShopItem} from './shop';
import * as Sound from './sound';
import {spawnImageMote, spawnMote} from './motes';
import numberFormat from './number-format';

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
    constructor(game, id, name, icon, defaultImage, openImage, sound, volume = 1) {
        super(game, id, name, icon);
        this.defaultImage = defaultImage;
        this.openImage = openImage;
        this.sound = sound;
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

        sergal.merpDown = (e, delta) => {
            e?.preventDefault();
            delta = delta ?? 1;
            const isManualMerp = !!e;

            if (e && e.button !== 0) return;

            // Calculate merp amount
            let amount = this.merpsPerSecond * (isManualMerp ? Game.merpClickMultiplier : Game.merpMultiplier);
            if (amount === 0) return;

            // Open mouth
            img.src = this.openImage;
            Sound.play(this.sound, this.volume);
            const rect = sergal.getBoundingClientRect();

            // Display merp mote
            let x = rect.x + (Math.random() * 150);
            const mote = document.createElement('div');
            mote.classList.add('merp-mote');
            mote.innerText = 'merp +' + numberFormat(amount, 1);
            if (Math.random() < 0.01) {
                mote.innerText = merpQuips[Math.floor(Math.random() * merpQuips.length)];
            }
            spawnMote(x, rect.y, mote, 500);

            // Increment merps
            Game.merp(amount * delta);
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
            sergal.merpDown(null, delta);
            await new Promise(r => setTimeout(r, 100));
            sergal.merpUp();
        }
    }
}