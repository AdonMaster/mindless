import { v4 as uuid } from 'uuid'

//
export interface Code {
    id: string
    key: string
    name: string
    desc?: string
    parent: Code|null
    children: Code[]
    theme: string
}
export function newCode(id: string, key: string, name: string, parent: Code|null, children: Code[], theme: string): Code {
    return {
        id, key, name, parent, children, theme,
    }
}

export function newCodeFrom(code: Code): Code {
    return newCode(uuid(), code.key, code.name, null, [], code.theme)
}

//
export const root: Code = newCode(uuid(), 'root', '', null, [], 'primary')

//
type Lib = {
    title: string, key: string,
    snippets: Code[]
}
export const codeLibrary: Lib[] = [
    {
        key: 'struct', title: 'Structure', snippets: [
            newCode('', 'scope', 'scope', null, [], 'primary'),
            newCode('', 'var', 'var', null, [], 'success'),
        ]
    }

]