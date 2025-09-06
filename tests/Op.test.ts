import {expect} from "chai"
import {Op} from "../src/helpers/Op"

describe('Op.ts', () => {

    it('should assert something', () => {
        expect(1).to.eq(1)
    })

    it('should op properly', () => {

        expect(Op.with('adon').get()).to.eq('adon')

    })

    it('should mutate', () => {

        //
        expect(
            Op.with('adon')
                .and(it => it.toUpperCase())
                .get()
        ).to.eq('ADON')

        //
        expect(
            Op.with('adon')
                .and(it => it.length)
                .get()
        ).to.eq(4)

    })

    it('should optionally call next function', () => {

        let count = 0

        expect(
            Op.with('adon')
                .and(() => null as string|null)
                .get()
        ).to.be.null

        expect(
            Op.with('adon')
                .and(() => {
                    count++
                    return null as string|null
                })
                .and(it => {
                    count++
                    return it.length
                })
                .get()
        ).to.be.null
        expect(count).to.eq(1)

    })

})