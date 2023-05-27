import {ShopItem} from './shop';
import * as Sound from './sound';

const merpVariance = 250;

export default class SergalItem extends ShopItem {
    constructor(name, icon, description, price, increaseMultiplier, merpsPerSecond, merpsMultiplier) {
        super(name, icon, description, price, increaseMultiplier, merpsPerSecond, merpsMultiplier, null);

        this.callback = this._callback;
    }

    async _callback() {
        const sergal = document.createElement('div');
        sergal.classList.add('sergal');
        sergal.dataset.shopId = '0';
        sergal.dataset.lastMerp = new Date().getTime().toString();
        const img = document.createElement('img');
        img.src = 'sergal-1.png';
        img.alt = 'Sergal';
        img.draggable = false;
        sergal.appendChild(img);
        Game.sergalContainer.appendChild(sergal);
        Game.sergals.push(sergal);

        sergal.merpDown = (e, amount) => {
            e?.preventDefault();
            img.src = 'sergal-2.png';

            Sound.play('merp.mp3');
            Game.merp(amount ?? this.merpsPerSecond);
        }
        sergal.merpUp = () => {
            img.src = 'sergal-1.png';
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