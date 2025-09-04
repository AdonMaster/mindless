export default {

    toInt(s: unknown, def: number) {
        if (!s) return def
        try {
            return parseInt(s as string)
        } catch {
            return def
        }
    }

}