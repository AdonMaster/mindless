import type {Code} from "@/data/Code.ts"
import clsx from "clsx"
import {LuGripVertical, LuX} from "react-icons/lu"
import {AnimatePresence, motion} from 'framer-motion'
import {type DragEvent, type MouseEvent, useState} from "react"
import _debounce from 'lodash.debounce'
import {DragSeparator} from "@/components/DragSeparator.tsx"
import Num from "@/helpers/Num.ts"

//
export function CodeComponent(p: {
    code: Code,
    droppedOn: (code: Code, index: number)=>void, edit: (code: Code)=>void,
    destroy: (code: Code)=>void,
    setDragging: (code: Code|null)=>void
}) {

    //
    const [isDragging, setIsDragging] = useState(false)
    const setIsDraggingDebounced = _debounce(setIsDragging, 25)

    //
    function ondragstart(e: DragEvent<HTMLDivElement>) {
        e.stopPropagation()
        e.dataTransfer.dropEffect = 'move'
        p.setDragging(p.code)
    }
    function ondragover(e: DragEvent<HTMLDivElement>) {
        e.preventDefault()
        e.stopPropagation()
        e.dataTransfer.dropEffect = 'move'
        setIsDraggingDebounced(true)
    }
    function ondragenter(e: DragEvent<HTMLDivElement>) {
        e.preventDefault()
        e.dataTransfer.dropEffect = 'move'
        setIsDraggingDebounced(true)
    }
    function ondragleave(e: DragEvent<HTMLDivElement>) {
        e.preventDefault()
        setIsDraggingDebounced(false)
    }
    function ondrop(e: DragEvent<HTMLDivElement>) {
        e.stopPropagation()
        e.preventDefault()
        setIsDraggingDebounced(false)

        //
        let index = -1
        const target = (e.target as HTMLElement)
        if (target.id == 'drag-separator') {
            index = Num.toInt((e.target as HTMLElement).dataset['index'], -1)
        }
        p.droppedOn(p.code, index)
    }

    //
    function edit(e: MouseEvent<HTMLAnchorElement>) {
        e.preventDefault()
        p.edit(p.code)
    }

    function destroy(e: MouseEvent<HTMLAnchorElement>) {
        e.preventDefault()
        p.destroy(p.code)
    }

    //
    return <div
        className={clsx(
            'transition-colors',
            'bg-'+p.code.theme+(isDragging ? '' : '/10'),
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
            <a
                href={'#/'} onClick={edit}
                className="badge badge-ghost rounded badge-secondary"
            >
                <LuGripVertical/>
                {p.code.key}
            </a>
            <div className={'grow'}>
                <h3 className={'font-semibold'}>{p.code.name} </h3>
                {!!p.code.desc && <p className="text-xs opacity-60">{p.code.desc}</p>}
            </div>
            {p.code.key != 'root' && <a
                href="#/close" className={'text-neutral-600 hover:text-neutral-300'}
                onClick={destroy}
            >
                <LuX/>
            </a>}
        </div>


        {/*divider*/}
        {!!p.code.children.length && <hr className={'opacity-10 my-2'}/>}

        {/*drop zone*/}
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
                <CodeComponent code={code} droppedOn={p.droppedOn} edit={p.edit} destroy={p.destroy} setDragging={p.setDragging}/>

                {/*drop zone*/}
                <DragSeparator dataIndex={idx + 1}/>
            </motion.div>)}
        </AnimatePresence>
    </div>

}