import type {Code} from "@/data/Code.ts"

export class RunnableContext {
    private status: 'ok'|'abort' = 'ok'

    abort() {
        this.status = 'abort'
    }

    reset() {
        this.status = 'ok'
    }

    getStatus() {
        return this.status
    }
}

type Tree = {
    parent: Tree|null
    name: string
    scope: Record<string, unknown>
}

//
const AsyncFunction = Object.getPrototypeOf(async function(){}).constructor;


//
export class Runnable {

    private readonly ctx = new RunnableContext()
    private tree: Tree|null = null

    //
    async run(
        code: Code, og: Code,
        progress: (code: Code|null)=>void,
        onMessage: (code: Code, body: string)=>void,
        reserved?: Record<string, unknown>
    )
    {
        if (this.ctx.getStatus() == 'abort') return

        //
        progress(code)
        onMessage(code, 'starting')

        //
        const keyPrefix = code.key.split(':')[0]

        //
        let localScope: Record<string, unknown> = reserved ?? {}
        if (['scope'].includes(keyPrefix)) {
            this.tree = {
                name: code.name,
                parent: this.tree,
                scope: {}
            }
        }

        //
        else if (keyPrefix == 'var') {
            localScope = {}
        }

        //
        else if (keyPrefix == 'input') {
            const paramValue = code.params.find(fi => fi.name == 'value')
            if (!paramValue) throw new Error('param value not present')
            localScope['value'] = paramValue.value
        }

        //
        else if (keyPrefix == 'fn') {
            const stringCode = `return (${code.extra})(arg1)`
            const fnMain = new AsyncFunction('arg1', stringCode)
            const payload = {
                value: localScope['value'],
                params: code.params.reduce((acc, p) => {
                    acc[p.name] = p.value
                    return acc
                }, {} as Record<string, unknown>)
            }

            //
            onMessage(code, `${code.key}@${code.name} with payload: ${JSON.stringify(payload)}`)
            const res = await fnMain(payload) // <-- call it
            if (!['pass_through', 'void'].includes(code.exit)) {
                localScope['value'] = res
            }
        }

        //
        for (const c of code.children) {
            await this.run(c, og, progress, onMessage, localScope)
            if (this.ctx.getStatus() == 'abort') return
        }
        progress(null)

        // bubble up context
        if (code.key == 'var') {
            const parent = this.tree
            if (!parent) throw new Error('var needs parent scope')
            parent.scope[code.name] = localScope['value']
            onMessage(code, `(${localScope['value']})`)
        }

        //
        console.log(this.tree)
    }

    getCtx(): RunnableContext {
        return this.ctx
    }

}

