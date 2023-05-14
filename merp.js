const colors = {
    0: '#fff',
    20: '#878787',
    50: '#00ef8c',
    100: '#006bef',
    200: '#b400ef',
    300: '#000',
    500: 'linear-gradient(0deg, black, #1a00ef)',
    750: 'linear-gradient(0deg, #9300ef, #8f0000)',
    1000: ' linear-gradient(90deg, rgba(255,0,0,1) 0%, rgba(255,154,0,1) 10%, rgba(208,222,33,1) 20%, rgba(79,220,74,1) 30%, rgba(63,218,216,1) 40%, rgba(47,201,226,1) 50%, rgba(28,127,238,1) 60%, rgba(95,21,242,1) 70%, rgba(186,12,248,1) 80%, rgba(251,7,217,1) 90%, rgba(255,0,0,1) 100%);',
};

window.addEventListener('load', function () {
    console.log('merp');

    const sergal = document.getElementById('sergal');

    let merpCount = 0;

    function startMerp(e) {
        e.preventDefault();

        if (document.body.classList.contains('revolution')) return;

        const audio = document.createElement('audio');
        audio.classList.add('merp-audio');
        audio.src = 'merp.mp3';

        merpCount++;
        audio.play();
        sergal.src = 'sergal-2.png';

        audio.addEventListener('ended', ()  => {
            audio.remove();
        });

        for (let key in colors) {
            if (merpCount >= key) {
                document.body.style.background = colors[key];
            }
        }
    }

    function endMerp(e) {
        e.preventDefault();

        sergal.src = 'sergal-1.png';
    }

    // Desktop
    sergal.addEventListener('mousedown', startMerp);
    sergal.addEventListener('mouseup', endMerp);
    sergal.addEventListener('mouseleave', endMerp);

    // Mobile
    sergal.addEventListener('touchstart', startMerp);
    sergal.addEventListener('touchend', endMerp);
    sergal.addEventListener('touchcancel', endMerp);
});