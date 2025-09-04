export class Res<T> {

    private readonly v: T|null
    private readonly err: string
    private readonly success: boolean

    //
    private constructor(v: T|null, err: string, success: boolean) {
        this.v = v
        this.err = err
        this.success = success
    }

    // factories
    static fromValue<V>(v: V): Res<V> {
        return new Res(v, '', true)
    }
    static fromErr<V>(reason: string): Res<V> {
        return new Res<V>(null, reason, false)
    }
    static fromClosure<V>(cb: ()=>V): Res<V> {
        try {
            return this.fromValue(cb())
        } catch (e: unknown) {
            if (e instanceof Error) return this.fromErr<V>(e.message)
            return this.fromErr<V>(e+'')
        }
    }

    //
    whenValue(cb: (value: T)=>void): Res<T> {
        if (this.success) cb(this.v!)
        return this
    }
    whenErr(cb: (value: string)=>void): Res<T> {
        if (!this.success) cb(this.err)
        return this
    }
}
