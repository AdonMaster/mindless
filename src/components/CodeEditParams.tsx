import type {CodeParam} from "@/data/Code.ts";
import {type ChangeEvent, Fragment, memo, useCallback, useEffect, useState} from "react"
import {Num} from "@/helpers/Num.ts"
import {DayPicker} from "react-day-picker"

export const CodeEditParams = memo((p: {
    params: CodeParam[], onParamDelta: (param: CodeParam) => void
})=> {

    // string
    const paramStringChanged = useCallback((param: CodeParam, e: ChangeEvent<HTMLInputElement>) => {
        p.onParamDelta({...param, value: e.target.value})
    }, [p]);

    // number
    const paramNumberChanged = useCallback((param: CodeParam, e: ChangeEvent<HTMLInputElement>) => {
        const v = Num.normalize(e.target.value)
        p.onParamDelta({...param, value: v})
    }, [p]);

    // date
    const [localDates, setLocalDates] = useState<Record<string, Date|undefined>>({})
    const [localMonths, setLocalMonths] = useState<Record<string, Date|undefined>>({})
    useEffect(() => {
        const initDates: Record<string, Date|undefined> = {}
        const initMonths: Record<string, Date|undefined> = {}
        p.params
            .filter(fi => fi.type == 'date')
            .forEach(fo => {
                initDates[fo.name] = fo.value as Date|undefined
                initMonths[fo.name] = fo.value as Date|undefined
            })
        setLocalDates(initDates)
        setLocalMonths(initMonths)
    }, [p])
    const paramDateChanged = useCallback((param: CodeParam, dt: Date|undefined) => {
        setLocalDates(prevState => ({...prevState, ...{[param.name]: dt}}))
        p.onParamDelta({...param, value: dt})
    }, [p]);

    //
    return <div>
        <fieldset className="fieldset w-full">
            {p.params.map(param => <Fragment key={param.name}>
                <legend className="fieldset-legend">{param.name}</legend>

                {/*string*/}
                {param.type == 'string' && <input
                    defaultValue={param.value as string}
                    onBlur={e => paramStringChanged(param, e)}
                    type="text" className="input w-full" placeholder=""
                />}

                {/*number*/}
                {param.type == 'number' && <input
                    defaultValue={Num.normalize(param.value)}
                    onBlur={e => paramNumberChanged(param, e)}
                    type="text" className="input w-full" placeholder=""
                />}

                {/*date*/}
                {param.type == 'date' && <div className={'mx-auto'}>
                    <DayPicker
                        className="react-day-picker"
                        mode="single"
                        month={localMonths[param.name]}
                        onMonthChange={mo => setLocalMonths(prev => ({...prev, ...{[param.name]: mo}}))}
                        selected={localDates[param.name]}
                        animate={false}
                        onSelect={e => {
                            paramDateChanged(param, e)
                        }}
                    />
                </div>}


            </Fragment>)}
        </fieldset>
    </div>
})