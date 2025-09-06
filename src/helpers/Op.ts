type Some<T> = T|null|undefined
export class Op<T> {

    //
    private readonly val: Some<T>

    //
    private constructor(val: Some<T>) {
        this.val = val
    }
    static with<V>(val: Some<V>): Op<V> {
        return new Op(val)
    }

    //

    and<V>(cb: (it: T)=>V|undefined|null): Op<V> {
        if (this.val === undefined || this.val === null) return Op.with(this.val as Some<V>)
        return Op.with(cb(this.val))
    }

    also(cb: (it: T)=>void) {
        if (this.val !== undefined && this.val !== null) cb(this.val)
        return this
    }

    get(): Some<T> {
        return this.val
    }

    forceGet(): T {
        return this.val!
    }

}
