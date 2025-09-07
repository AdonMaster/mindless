import {type Code, normalizeParamValue} from "@/data/Code.ts"
import clsx from "clsx"
import {LuGripVertical, LuX} from "react-icons/lu"
import {AnimatePresence, motion} from 'framer-motion'
import {type DragEvent, Fragment, memo, type MouseEvent, useCallback, useMemo, useState} from "react"
import _debounce from 'lodash.debounce'
import {DragSeparator} from "@/components/DragSeparator.tsx"
import {Num} from "@/helpers/Num.ts"
import {Switch} from "@/helpers/Switch.ts";
import {useRunContext} from "@/contexts/RunContext.ts"
import {FaChevronRight, FaCode, FaDotCircle, FaPlay, FaStop} from "react-icons/fa"
import {BounceLoader, MoonLoader} from 'react-spinners'

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
    const { isRunning, isRunningInto, run, stop, isAborting } = useRunContext()

    // computed
    const isRunningStatus = useMemo<
        'not_running_i_can'|'not_running_i_cannot'|'running_me'|'running_parent'|'running_not_related'
    >(() =>
    {
        const isParentRunning = (c: Code, runningId: string): boolean => {
            let cur = c.parent
            while (cur) {
                if (cur.id == runningId) return true
                cur = cur.parent
            }
            return false
        }
        //
        if (isRunning) {
            if (isRunning.id == p.code.id) return 'running_me'
            if (isParentRunning(p.code, isRunning.id)) return 'running_parent'
            return 'running_not_related'
        } else {
            if (p.code.config?.isRunnable == true) return 'not_running_i_can'
            return 'not_running_i_cannot'
        }
    }, [p, isRunning]);

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
        if (isRunning) { return e.preventDefault() }
        e.dataTransfer.dropEffect = 'move'
        p.setDragging(p.code)
    }, [p, isRunning]);
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

        //
        setIsDraggingDebounced('none')

        //
        let index = -1
        const target = (e.target as HTMLElement)
        if (target.id == 'drag-separator') {
            index = Num.int((e.target as HTMLElement).dataset['index'], -1)
        }
        p.droppedOn(p.code, index)

    }, [p, setIsDraggingDebounced, isRunning]);

    //
    const edit = useCallback((e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        if (isRunning) return {}

        p.edit(p.code)
    }, [p, isRunning]);

    const destroy = useCallback((e: MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault()
        if (isRunning) return {}

        p.destroy(p.code)
    }, [p, isRunning]);

    //
    function isStackValid(index: number): boolean
    {
        const cur = p.code.children[index]

        //
        if (cur.exit == 'pass_through') return true

        //
        for (let cont=index-1; cont>=0; cont--) {
            const last = p.code.children[cont]
            if (last.exit == 'pass_through') continue
            return cur.entry == last.exit
        }
        return p.code.entry == cur.entry
    }

    const tryToRun = useCallback(() => {
        if (isRunningStatus == 'running_me') return stop()
        if (isRunningStatus == 'not_running_i_can') return run(p.code)
    }, [isRunningStatus, stop, p.code, run])

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
        <div className={'flex items-center gap-2'}>

            {/*running into*/}
            {
                isRunningInto?.id == p.code.id
                ? <FaChevronRight color={'orange'}/>
                : <FaCode color={'#ffffff10'}/>
            }

            {/*run*/}
            <a
                href={'#/run'}
                className={clsx()}
                onClick={tryToRun}
            >
                {isRunningStatus == 'running_me' && <FaStop color={isAborting ? 'gray' : 'red'}/>}
                {isRunningStatus == 'running_parent' && <MoonLoader size={12} color={'lime'}/>}
                {isRunningStatus == 'running_not_related' && <BounceLoader size={16} color={'#ffffff50'}/>}
                {isRunningStatus == 'not_running_i_can' && <FaPlay color={'green'}/>}
                {isRunningStatus == 'not_running_i_cannot' && <FaDotCircle color={'grey'}/>}
            </a>

            {/*grip*/}
            <button
                onClick={edit}
                className="badge badge-ghost rounded badge-secondary cursor-pointer"
                draggable={true}
            >
                <LuGripVertical/>
                {p.code.key}
            </button>

            {/*h3*/}
            <div className={'grow'}>

                <h3 className={'font-semibold'}>
                    {!['input', 'fn'].includes(p.code.key.split(':')[0]) && p.code.name}
                </h3>

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
            {p.code.id != 'root' && <a
                href={"#/close"} className={'text-neutral-600 hover:text-neutral-300'}
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
                {/*stacking error*/}
                {!isStackValid(idx) && <div className={'h-[4px] bg-[red]'}></div>}

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
