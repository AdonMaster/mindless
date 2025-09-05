export class Switch<T, R> {

    private readonly data: T;
    public result: R

    //
    private constructor(data: T, def: R) {
        this.data = data
        this.result = def
    }

    static f<TT, RR>(data: TT, def: RR): Switch<TT, RR> {
        return new Switch(data, def)
    }
    //

    case(v: T, cb: (v: T) => R): Switch<T, R> {
        if (this.data == v) this.result = cb(this.data)
        return this
    }

    get(): R {
        return this.result
    }

}