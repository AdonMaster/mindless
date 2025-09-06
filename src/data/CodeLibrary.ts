//
import {type Code, newCode} from "@/data/Code.ts"
import {v4 as uuid} from "uuid"
import {Op} from "@/helpers/Op.ts"


//
const scope = newCode('', 'scope', 'scope', null, [], 'primary',
    ['var', 'scope', 'fn'], 'void', 'computed', []
)

//
export const root: Code = Op.with({...scope}).also(it => {
    it.id = uuid()
    it.name = 'root'
}).forceGet()

//
type Lib = {
    title: string, key: string,
    snippets: Code[]
}
export const codeLibrary: Lib[] = [
    {
        key: 'struct', title: 'Structure', snippets: [

            // scope
            newCode('', 'scope', 'scope', null, [], 'primary',
                ['var', 'scope', 'fn'], 'void', 'computed', []
            ),

            // var
            newCode(
                '', 'var', 'var', null, [], 'success',
                ['fn', 'input'],
                'void', 'computed', []
            ),
        ],
    },
    {
        key: 'input', title: 'Input', snippets: [

            // input text
            newCode(
                '', 'input:string', 'input:string', null, [], 'warning',
                [],
                'void', 'string', [
                    {name: 'value', type: 'string', value: ''}
                ]
            ),
            // number text
            newCode(
                '', 'input:number', 'input:number', null, [], 'warning',
                [],
                'void', 'number', [
                    {name: 'value', type: 'number', value: 0}
                ]
            ),
            // date text
            newCode(
                '', 'input:date', 'input:date', null, [], 'warning',
                [],
                'void', 'date', [
                    {name: 'value', type: 'date', value: new Date}
                ]
            ),
        ]
    },

    {
        key: 'fn', title: 'Functions', snippets: [
            // input text
            newCode(
                '', 'fn:upper', 'fn:upper', null, [], 'secondary',
                [],
                'string', 'string', [],
                'this.toUpperCase()'
            ),
        ]
    },

    {
        key: 'system', title: 'System', snippets: [
            // input text
            newCode(
                '', 'fn:sleep', 'fn:sleep', null, [], 'secondary',
                [],
                'void', 'pass_through', [
                    {name: 'interval', type: 'number', value: 1000}
                ],
                `
                    async sleep(interval: number): Promise<void> {
                        return new Promise(res => setTimeout(res, interval))
                    }
                    await sleep({{interval}})
                `
            ),
        ]
    }

]