import {v4 as uuid} from 'uuid'
import {Switch} from "@/helpers/Switch.ts";
import {Num} from "@/helpers/Num.ts";

export type CodeType = 'string' | 'number' | 'boolean' | 'date' | 'void' | 'computed'
export type CodeParam<T=unknown> = {
    name: string,
    type: CodeType,
    value: T
}
export function normalizeParamValue(c?: CodeParam): string {
    const empty = '~empty~'
    if (!c) return empty
    return Switch.f(c.type, empty)
        .case('string', () => c.value as string)
        .case('number', () => Num.normalize(c.value))
        .case('date', () => (c.value as undefined|Date)?.toDateString() ?? '~')
        .get()

}

//
export interface Code {
    id: string
    key: string
    name: string
    desc?: string
    parent: Code | null
    children: Code[]
    accept: string[]
    theme: string
    val?: string
    extra?: unknown
    entry: CodeType
    params: CodeParam[]
    exit: CodeType
}

export function newCode(
    id: string, key: string, name: string, parent: Code | null, children: Code[], theme: string, accept: string[],
    entry: CodeType, exit: CodeType, params: CodeParam[], extra?: unknown, val?: string
): Code {
    return {
        id, key, name, parent, children, accept, theme, entry, exit, params, val, extra
    }
}

//
export const root: Code = newCode(
    uuid(), 'root', '', null, [], 'primary', ['*'], 'void', 'void', []
)

//
type Lib = {
    title: string, key: string,
    snippets: Code[]
}
export const codeLibrary: Lib[] = [
    {
        key: 'struct', title: 'Structure', snippets: [

            // scope
            newCode('', 'scope', 'scope', null, [], 'primary', ['*'], 'void', 'computed', []),

            // var

            newCode(
                '', 'var', 'var', null, [], 'success', ['fn', 'input'],
                'void', 'computed', []
            ),
        ],
    },
    {
        key: 'input', title: 'Input', snippets: [

            // input text
            newCode(
                '', 'input:text', 'input:text', null, [], 'warning', [],
                'void', 'string', [
                    {name: 'value', type: 'string', value: ''}
                ]
            ),
            // number text
            newCode(
                '', 'input:number', 'input:number', null, [], 'warning', [],
                'void', 'number', [
                    {name: 'value', type: 'number', value: 0}
                ]
            ),
            // date text
            newCode(
                '', 'input:date', 'input:date', null, [], 'warning', [],
                'void', 'date', [
                    {name: 'value', type: 'date', value: 0}
                ]
            ),
        ]
    }

]