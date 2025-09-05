import type {CodeParam} from "@/data/Code.ts";
import {type ChangeEvent, Fragment, memo, useCallback, useState} from "react"
import { Num } from "@/helpers/Num.ts"
import {DayPicker} from "react-day-picker"
import "react-day-picker/style.css"

export const CodeEditParams = memo((p: {
    params: CodeParam[], onParamDelta: (param: CodeParam) => void
})=> {

    const paramStringChanged = useCallback((param: CodeParam, e: ChangeEvent<HTMLInputElement>) => {
        p.onParamDelta({...param, value: e.target.value})
    }, [p]);

    const paramNumberChanged = useCallback((param: CodeParam, e: ChangeEvent<HTMLInputElement>) => {
        const v = Num.normalize(e.target.value)
        p.onParamDelta({...param, value: v})
    }, [p]);

    const [dtLocal, setDtLocal] = useState<Date|undefined>(new Date)
    const paramDateChanged = useCallback((param: CodeParam, dt: Date|undefined) => {
        p.onParamDelta({...param, value: dt})
        setDtLocal(dt)
    }, [p]);

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
                {param.type == 'date' && <div className={'flex justify-center'}>
                    <DayPicker
                        mode="single"
                        selected={dtLocal}
                        onSelect={e => paramDateChanged(param, e)}
                    />
                </div>}


            </Fragment>)}
        </fieldset>
    </div>
})