import {type ReactNode, useCallback, useState} from "react"
import {RunContext} from "@/contexts/RunContext.ts"
import type {Code} from "@/data/Code.ts"
import {DateTime} from "luxon"
import {Runnable} from "@/processing/Runnable.ts"


export interface RunContextAttr {
    consoleMessages: { id: string, body: string }[]
    setConsoleMessages: (message: { id: string, body: string }[])=>void

    run: (code: Code)=>void
    stop: ()=>void
    isRunning: Code|null
    isRunningInto: Code|null
    isAborting: boolean
}



export function RunContextProvider(p: {children: ReactNode})
{
    //
    const [consoleMessages, setConsoleMessages] = useState<{ id: string, body: string }[]>([])
    const [runnable, setRunnable] = useState<Runnable>(new Runnable())

    //
    const [isRunning, setIsRunning] = useState<Code|null>(null)
    const [isRunningInto, setIsRunningInto] = useState<Code|null>(null)
    const [isAborting, setIsAborting] = useState(false)

    //
    const run = useCallback(async (code: Code) =>
    {
        if (isAborting) return

        // setup start
        setIsRunning(code)
        setConsoleMessages([])
        onRunningMessage('', `Starting...`)

        //
        const newRunnable = new Runnable()
        setRunnable(newRunnable)
        try {
            await runnable.run(code, code, setIsRunningInto, (c, body) => {
                const truncatedId = c.id.split('-')[0]
                onRunningMessage(`${truncatedId}|${c.key}`, body)
            })
        } catch (e: unknown) {
            let reason = e+''
            if (e instanceof Error) reason = e.message
            onRunningMessage('error', reason)
        }

        //
        onRunningMessage('', 'Done!')
        setIsRunning(null)
        setIsRunningInto(null)
        setIsAborting(false)
    }, [runnable, isAborting]);

    //
    const stop = useCallback(() => {
        setIsAborting(true)
        onRunningMessage('', 'Aborting...')
        runnable.getCtx().abort()
    }, [runnable]);

    //
    function onRunningMessage(pre: string, content: string) {
        const now = DateTime.now().toFormat('dd/MM/y HH:mm:ss')
        const message = `${now} [${pre}] - ${content}`
        setConsoleMessages(prev => [...prev, {id: prev.length+'', body: message}])
    }

    //
    return <RunContext.Provider value={{
        consoleMessages, setConsoleMessages,
        run, stop, isRunning, isRunningInto, isAborting
    }}>
        {p.children}
    </RunContext.Provider>
}