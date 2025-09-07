import type {CodeParam} from "@/data/Code.ts";
import {Fragment, memo, useCallback, useEffect, useState} from "react"
import {Num} from "@/helpers/Num.ts"
import {DayPicker} from "react-day-picker"
import {Switch} from "@/helpers/Switch.ts"

export const CodeEditParams = memo((p: {
    params: CodeParam[], onParamDelta: (param: CodeParam) => void
})=> {

    // pre-populate
    const [local, setLocal] = useState<Record<string, unknown|undefined>>({})
    useEffect(() => {
        setLocal(() => {
            const res: Record<string, unknown|undefined> = {}
            for (const fe of p.params) {
                res[fe.name] = fe.value
                if (fe.type == 'date') res[fe.name+'|month'] = fe.value
            }
            return res
        })
    }, [p])

    //
    const paramChanged = useCallback((param: CodeParam, elementValue: unknown, publish: boolean) =>
    {
        if (publish) {
            const v = Switch.f(param.type, elementValue)
                .case('number', () => Num.float(elementValue, 0))
                .get()
            setLocal(prev => ({...prev, ...{[param.name]: v}}))
            p.onParamDelta({...param, value: v})
        } else {
            setLocal(prev => ({...prev, ...{[param.name]: elementValue}}))
        }
    }, [p]);

    //
    return <div>
        <fieldset className="fieldset w-full">
            {p.params.map(param => <Fragment key={param.name}>
                <legend className="fieldset-legend">{param.name}</legend>

                {/*string*/}
                {param.type == 'string' && <input
                    defaultValue={param.value as string}
                    onBlur={e => paramChanged(param, e.target.value, true)}
                    onChange={e => paramChanged(param, e.target.value, false)}
                    type="text" className="input w-full" placeholder=""
                />}

                {/*number*/}
                {param.type == 'number' && <input
                    defaultValue={param.value as number}
                    onBlur={e => paramChanged(param, e.target.value, true)}
                    onChange={e => paramChanged(param, e.target.value, false)}
                    type="text" className="input w-full" placeholder=""
                />}

                {/*date*/}
                {param.type == 'date' && <div className={'mx-auto'}>
                    <DayPicker
                        className="react-day-picker"
                        mode="single"
                        month={local[param.name+'|month'] as Date}
                        onMonthChange={mo => setLocal(prev => ({...prev, ...{[param.name+'|month']: mo}}))}
                        selected={local[param.name] as Date|undefined}
                        onSelect={e => paramChanged(param, e, true)}
                    />
                </div>}


            </Fragment>)}
        </fieldset>
    </div>
})