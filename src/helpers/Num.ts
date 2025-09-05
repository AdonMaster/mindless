class NumClass {

    private readonly formatter: Intl.NumberFormat
    private readonly parserDigitSeparator: '.'|','

    constructor(locales: undefined|'en-US'|'pt-BR'=undefined) {
        //
        this.formatter = Intl.NumberFormat(locales, {
            style: 'decimal',
        })

        //
        this.parserDigitSeparator = this.formatter
            .format(0.1)
            .includes('.')
            ? '.' : ','
    }

    int(s: unknown, def: number): number {
        if (!s) return def
        const res = parseInt(s as string)
        if (isNaN(res)) return def
        return res
    }

    convertToEn(s: unknown, def: string): string {
        if (!s) return def
        if (typeof s != "string") return def
        if (this.parserDigitSeparator == '.') return s.replaceAll(',', '')
        return s.replaceAll('.', '').replaceAll(',', '.')
    }

    float(s: unknown, def: number): number {
        if (!s) return def
        const res = parseFloat(this.convertToEn(s, '0'))
        if (isNaN(res)) return def
        return res
    }

    toDecimal(n: number): string {
        return this.formatter.format(n)
    }

    normalize(s: unknown): string {
        const n = this.float(s, 0)
        return this.toDecimal(n)
    }
}

export const Num = new NumClass()
export const NumBr = new NumClass('pt-BR')