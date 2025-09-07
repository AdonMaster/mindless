import clsx from "clsx"
import {useRunContext} from "@/contexts/RunContext.ts"
import {useEffect, useRef} from "react"

export function CodeConsole() {

    const {consoleMessages} = useRunContext()
    const refWrapper = useRef<HTMLDivElement>(null)

    //
    useEffect(() => {
        const el = refWrapper.current
        if (! el) return
        el.scrollTo({ top: el.scrollHeight, behavior: "smooth"})
    }, [consoleMessages]);

    //
    return <div
        ref={refWrapper}
        className={clsx(
        'bg-neutral-900 p-3 h-full text-xs font-mono text-secondary overflow-y-scroll'
        )}
    >
        {consoleMessages.map(message => {
            const isError = message.body.indexOf('[error]') >= 0
            return <div key={message.id} className={clsx(
                'pb-1', isError && 'text-error'
            )}>
                {message.body}
            </div>
        })}
    </div>
}