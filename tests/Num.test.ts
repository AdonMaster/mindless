import {expect} from "chai";
import {Num, NumBr} from "../src/helpers/Num";

describe('Num.ts', () => {

    it('should assert simply', () => {
        expect(1).to.eq(1)
    })

    it('should parse from string', () => {
        // int
        expect(Num.int('22', 0)).to.eq(22)
        expect(Num.int('22.2', 0)).to.eq(22)
        expect(Num.int('a2aa', 0)).to.eq(0)
        expect(Num.int('', 0)).to.eq(0)

        // float
        expect(Num.float('22', 0)).to.eq(22.0)
        expect(Num.float('22.2', 0)).to.eq(22.2)
        expect(Num.float('0.33', 0)).to.eq(0.33)
        expect(Num.float('a2aa', 0)).to.eq(0)
        expect(Num.float('', 0)).to.eq(0)
    })

    it('should normalize a string number', () => {
        //
        expect(Num.normalize('22')).to.eq('22')
        expect(Num.normalize('aa')).to.eq('0')
        expect(Num.normalize('22.2')).to.eq('22.2')

        // locale
        expect(NumBr.float('22', 0)).to.eq(22)
        expect(NumBr.float('22,2', 0)).to.eq(22.2)
        expect(NumBr.normalize('22,2')).to.eq('22,2')

        // thousands
        expect(Num.normalize('1022')).to.eq('1,022')
        expect(Num.normalize('1022.003')).to.eq('1,022.003')
        expect(Num.normalize('1,022.003')).to.eq('1,022.003')
        expect(Num.convertToEn('1,022.003', '-')).to.eq('1022.003')

    })

})