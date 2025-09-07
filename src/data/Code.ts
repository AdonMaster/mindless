import {Switch} from "@/helpers/Switch.ts";
import {Num} from "@/helpers/Num.ts";
import {DateTime} from 'luxon'
import {Op} from "@/helpers/Op.ts"

export type CodeType = 'string' | 'number' | 'boolean' | 'date' | 'void' | 'pass_through' | 'computed'
export type CodeParam<T=unknown> = {
    name: string,
    type: CodeType,
    value: T
}
export function normalizeParamValue(c?: CodeParam): string
{
    const empty = '~empty~'
    if (!c) return empty
    return Switch.f(c.type, empty)
        .case('string', () => c.value as string)
        .case('number', () => Num.normalize(c.value))
        .case(
            'date', () => Op.with(c.value as undefined|Date)
                .and(it => DateTime.fromJSDate(it).toFormat('dd/MM/y'))
                .get() ?? empty
        )
        .get()
}

//
export type CodeConfig = {
    isRunnable: boolean
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
    entry: CodeType
    params: CodeParam[]
    exit: CodeType
    extra?: unknown
    config?: CodeConfig
}

export function newCode(
    id: string, key: string, name: string, parent: Code | null, children: Code[], theme: string, accept: string[],
    entry: CodeType, exit: CodeType, params: CodeParam[], extra?: unknown, config?: CodeConfig
): Code {
    return {
        id, key, name, parent, children, accept, theme, entry, exit, params, extra, config
    }
}

//


