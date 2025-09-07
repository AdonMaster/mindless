//
import {type Code, newCode} from "@/data/Code.ts"
import {Op} from "@/helpers/Op.ts"


//
const scope = newCode('', 'scope', 'scope', null, [], 'primary',
    ['var', 'scope', 'fn'], 'void', 'void', [], null, {
        isRunnable: true
    }
)

//
export const root: Code = Op.with({...scope}).also(it => {
    it.id = 'root'
    it.key = 'scope'
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
            scope,

            // var
            newCode(
                '', 'var', 'var', null, [], 'success',
                ['fn', 'input'],
                'void', 'void', [], null, {
                    isRunnable: true
                }
            ),
        ],
    },
    {
        key: 'input', title: 'Input', snippets: [

            // input text
            newCode(
                '', 'input:str', 'input:str', null, [], 'warning',
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
                `
                async function main(p) {
                    return p.value.toUpperCase()
                }
                `
            ),
        ]
    },

    {
        key: 'system', title: 'System', snippets: [
            // input text
            newCode(
                '', 'fn:sleep', 'sleep', null, [], 'secondary',
                [],
                'void', 'pass_through', [
                    {name: 'interval', type: 'number', value: 1000}
                ],
                `
                    async function main(p) {
                        return new Promise(res => setTimeout(res, p.params.interval))
                    }
                `
            ),
        ]
    }

]