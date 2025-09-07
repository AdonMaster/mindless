import {createContext, useContext} from "react"
import type {RunContextAttr} from "@/contexts/RunContextProvider.tsx"

export const RunContext = createContext<RunContextAttr|undefined>(undefined)
export const useRunContext = (): RunContextAttr => {
    const context = useContext<RunContextAttr|undefined>(RunContext)
    if (!context) throw new Error('Wrap this shit in <ConsoleContext.Provider>!!')
    return context
}

