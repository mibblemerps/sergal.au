export function play(src) {
    const audio = document.createElement('audio');
    audio.src = src;
    audio.play().catch(() => { audio.remove(); })
    audio.addEventListener('ended', ()  => {
        audio.remove();
    });
}