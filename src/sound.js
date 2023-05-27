if (!window.currentSounds) window.currentSounds = 0;

const maxSounds = 25;

export function play(src, volume = 1) {
    if (currentSounds > maxSounds) {
        console.warn(`Reached maximum number of sounds (${maxSounds}).`);
        return;
    }
    currentSounds++;
    const audio = document.createElement('audio');
    audio.src = src;
    audio.volume = volume;
    audio.play().catch(() => {
        audio.remove();
        currentSounds--;
    })
    audio.addEventListener('ended', ()  => {
        audio.remove();
        currentSounds--;
    });
}