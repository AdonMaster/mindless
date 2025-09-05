import {type Code, normalizeParamValue} from "@/data/Code.ts"
import clsx from "clsx"
import {LuGripVertical, LuX} from "react-icons/lu"
import {AnimatePresence, motion} from 'framer-motion'
import {type DragEvent, Fragment, memo, type MouseEvent, useCallback, useMemo, useState} from "react"
import _debounce from 'lodash.debounce'
import {DragSeparator} from "@/components/DragSeparator.tsx"
import {Num} from "@/helpers/Num.ts"
import {Switch} from "@/helpers/Switch.ts";

//
export const CodeComponent = memo(function(p: {
    code: Code,
    droppedOn: (code: Code, index: number)=>void, edit: (code: Code)=>void,
    destroy: (code: Code)=>void,
    dragging: Code|null,
    setDragging: (code: Code|null)=>void
}) {

    //
    type IsDraggingStatus = 'none'|'allow'|'deny'
    const [isDragging, setIsDragging] = useState<IsDraggingStatus>('none')

    //
    const setIsDraggingDebounced = useMemo<(s: IsDraggingStatus)=>void>(
        () => _debounce(v => setIsDragging(v), 10),
        []
    )

    //
    const cIsDraggingBgTheme = Switch.f(isDragging, '')
        .case('none', ()=>`bg-${p.code.theme}/20`)
        .case('allow', ()=>`bg-${p.code.theme}`)
        .case('deny', ()=>`bg-error`)
        .get()

    //
    const ondragstart = useCallback((e: DragEvent<HTMLDivElement>) => {
        e.stopPropagation()
        e.dataTransfer.dropEffect = 'move'
        p.setDragging(p.code)
    }, [p]);
    const ondragover = useCallback((e: DragEvent<HTMLDivElement>) => {
        e.stopPropagation()

        // acceptance
        if (
            p.code.accept.includes('*')
            || p.code.accept.includes(p.dragging?.key?.split(':')?.at(0) ?? '')
        ) {
            e.preventDefault()
            e.dataTransfer.dropEffect = 'move'
            setIsDraggingDebounced('allow')
        } else {
            e.dataTransfer.dropEffect = 'none'
            setIsDraggingDebounced('deny')
        }
    }, [p, setIsDraggingDebounced]);
    const ondragenter = useCallback((e: DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        e.dataTransfer.dropEffect = 'move'
        setIsDraggingDebounced('allow')
    }, [setIsDraggingDebounced]);
    const ondragleave = useCallback((e: DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        setIsDraggingDebounced('none')
    }, [setIsDraggingDebounced]);
    const ondrop = useCallback((e: DragEvent<HTMLDivElement>) => {
        e.stopPropagation()
        e.preventDefault()
        setIsDraggingDebounced('none')

        //
        let index = -1
        const target = (e.target as HTMLElement)
        if (target.id == 'drag-separator') {
            index = Num.int((e.target as HTMLElement).dataset['index'], -1)
        }
        p.droppedOn(p.code, index)

    }, [p, setIsDraggingDebounced]);

    //
    const edit = useCallback((e: MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault()
        p.edit(p.code)
    }, [p]);

    const destroy = useCallback((e: MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault()
        p.destroy(p.code)
    }, [p]);

    //
    return <div
        className={clsx(
            'transition-colors',
            cIsDraggingBgTheme,
            'p-3 rounded',
        )}
        onDragStart={ondragstart}
        onDragOver={ondragover}
        onDragEnter={ondragenter}
        onDragLeave={ondragleave}
        onDrop={ondrop}
        onDragExit={ondragleave}
    >

        {/*title bar*/}
        <div className={'flex items-start gap-2'}>

            {/*grip*/}
            <a
                href={'#/'} onClick={edit}
                className="badge badge-ghost rounded badge-secondary"
            >
                <LuGripVertical/>
                {p.code.key}
            </a>

            {/*h3*/}
            <div className={'grow'}>
                <h3 className={'font-semibold'}>{p.code.name} </h3>
                {!!p.code.desc && <p className="text-xs opacity-60">{p.code.desc}</p>}

                {/*entries*/}
                {p.code.params.length > 0 && <div className={'flex flex-wrap gap-2 mt-1 text-sm'}>
                    <h3 className={'font-bold text-neutral-500'}>Params:</h3>
                    {p.code.params.map((pa, idx) => <Fragment key={pa.name}>
                        {idx > 0 && <div className={'opacity-25'}>|</div>}
                        <span>{pa.name}</span> <span className={'font-bold'}>{ normalizeParamValue(pa) }</span>
                    </Fragment>)}
                </div>}
            </div>

            {/*close*/}
            {p.code.key != 'root' && <a
                href="#/close" className={'text-neutral-600 hover:text-neutral-300'}
                onClick={destroy}
            >
                <LuX/>
            </a>}
        </div>

        {/*divider*/}
        {!!p.code.children.length && <hr className={'opacity-10 my-2'}/>}

        {/*separator drop zone*/}
        {p.code.children.length > 0 && <DragSeparator dataIndex={0}/>}

        {/*children*/}
        <AnimatePresence>
            {p.code.children.map((code, idx) => <motion.div
                key={code.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                layoutId={code.id}
            >
                <CodeComponent
                    code={code}
                    droppedOn={p.droppedOn} edit={p.edit} destroy={p.destroy} dragging={p.dragging} setDragging={p.setDragging}
                />

                {/*separator drop zone*/}
                <DragSeparator dataIndex={idx + 1}/>

            </motion.div>)}
        </AnimatePresence>
    </div>

})
