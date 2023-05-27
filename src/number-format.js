function roundTo(number, places) {
    if (places === 0) return Math.round(number);
    return parseFloat(number.toString()).toFixed(places).replace(/\.?0+$/, '');
}

export default function (number, decimals = 1, noFractions = true) {
    if (number < 1000) return roundTo(number, noFractions ? 0 : decimals) + '';
    if (number < 1000000) return roundTo(number / 1000, decimals) + 'k';
    if (number < 1000000000) return roundTo(number / 1000000, decimals) + 'M';
    return roundTo(number / 1000000000, decimals) + 'B';
}