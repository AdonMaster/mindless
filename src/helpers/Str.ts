export default {

    random(n: number=16) {
        return this._random(n, 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-!@#$%&*()+=?')
    },

    randomAlpha(n: number=16) {
        return this._random(n, 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_')
    },

    _random(n: number, charSet: string) {
        let r = '';
        for (let i = 0; i < n; i++) {
            const randomPoz = Math.floor(Math.random() * charSet.length);
            r += charSet.substring(randomPoz,randomPoz+1);
        }
        return r;
    },

}