export function play(src, volume = 1) {
    const audio = document.createElement('audio');
    audio.src = src;
    audio.volume = volume;
    audio.play().catch(() => { audio.remove(); })
    audio.addEventListener('ended', ()  => {
        audio.remove();
    });
}