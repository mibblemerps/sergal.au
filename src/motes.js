

export function spawnImageMote(x, y, cssClass, src, lifespan, parent = null) {
    let img = document.createElement('img');
    img.classList.add(cssClass);
    img.src = src;
    spawnMote(x, y, img, lifespan, parent);
}

export function spawnMote(x, y, element, lifespan, parent) {
    parent = parent ?? document.body;
    element.classList.add('mote');
    element.style.position = 'absolute';
    element.style.left = x + 'px';
    element.style.top = y + 'px';
    element.style.animationDuration = (lifespan / 1000) + 's';

    if (parent.childElementCount === 0)
        parent.appendChild(element);
    else
        parent.insertBefore(element, parent.firstChild);

    setTimeout(() => {
        element.remove();
    }, lifespan - 50);
}