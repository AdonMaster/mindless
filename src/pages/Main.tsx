import './Main.css'
import {type DragEvent, useCallback, useState} from "react"
import {type Code} from "@/data/Code.ts"
import {CodeComponent} from "@/components/CodeComponent.tsx"
import {LuGripVertical} from "react-icons/lu"
import clsx from "clsx"
import {DialogCodeEdit} from "@/components/DialogCodeEdit.tsx"
import Chain from "@/helpers/Chain.ts"
import {v4 as uuid} from 'uuid'
import {codeLibrary, root as ogRoot} from "@/data/CodeLibrary.ts"
import {useRunContext} from "@/contexts/RunContext.ts"
import {CodeConsole} from "@/components/CodeConsole.tsx"
import Str from "@/helpers/Str.ts"
import {useResizable} from "react-resizable-layout"

//
export function Main() {

    const [root, setRoot] = useState<Code>({...ogRoot})
    const [dragging, setDragging] = useState<Code|null>(null)
    const [codeEditing, setCodeEditing] = useState<Code|null>(null)
    const {isRunning} = useRunContext()

    //
    const ondragstart = useCallback((model: Code, e: DragEvent<HTMLDivElement>) => {
        e.dataTransfer.dropEffect = 'move'
        setDragging(model)
    }, []);

    //
    const [indexToEdit, setIndexToEdit] = useState(-1)
    const droppedOn = useCallback((c: Code, index: number) => {
        if (!dragging) return

        //
        setIndexToEdit(index)

        // move it
        if (dragging.id) {
            // is dragging parent of some deep child
            let cur: Code|null = c
            while (cur) {
                if (cur.id == dragging.id) return
                cur = cur.parent
            }
            //
            setRoot(prev => Chain.move(prev, dragging.id, c.id, index))
        }

        // new
        else {
            const keyPrefix = dragging.key.split(':')[0]
            setCodeEditing({...dragging, ...{name: keyPrefix + '_' + Str.randomVarName(6), parent: c}})
        }
    }, [dragging]);

    const edit = useCallback((code: Code) => {
        setCodeEditing(code)
    }, []);

    //
    function codeSaved(c: Code|null)
    {
        // clear selection
        setCodeEditing(null)
        if (! c) return

        // edit
        if (c.id) {
            setRoot(prev => Chain.substitute(prev, c.id, c))
        }
        // new
        else {
            const newCode = {...c, id: uuid()} as Code
            setRoot(prev => Chain.insert(prev, newCode, c.parent!.id, indexToEdit))
        }

    }

    const destroy = useCallback((code: Code) => {
        if (! code.parent) return
        setRoot(prev => Chain.remove(prev, code.id))
    }, []);

    // layout
    const { position:footerHeight, separatorProps:footerSeparatorProps } = useResizable({
        axis: "y", reverse: true, min: 100
    })

    //
    return <div className={'h-full flex flex-col'}>

        {/*header*/}
        <header className=" text-white p-4">
            header
        </header>

        {/*main*/}
        <main id="editor" className={clsx(
            'grow p-3 grid grid-cols-[1fr_300px] gap-2 overflow-y-scroll',
        )}>

            {/*editor*/}
            <div className="overflow-y-visible ">
                <CodeComponent
                    key={root.id}
                    code={root} droppedOn={droppedOn} edit={edit} destroy={destroy}
                    dragging={dragging} setDragging={setDragging}
                />
            </div>

            {/*panel lib*/}
            <div id="lib" className={clsx(
                '',
            )}>
                {codeLibrary.map(lib => <div
                    key={lib.key}
                    className="collapse bg-base-100 border-base-300 border"
                >
                    <input type="checkbox" defaultChecked={true}/>
                    <div className="collapse-title font-semibold">
                        {lib.title}
                    </div>
                    <div className="collapse-content flex flex-wrap gap-2">

                        {/*button*/}
                        {lib.snippets.map(code => <div
                            key={code.key}
                            className={clsx("btn btn-sm", 'btn-' + (code.theme || 'primary'))}
                            draggable={!isRunning}
                            onDragStart={e => ondragstart(code, e)}
                        >
                            <LuGripVertical/> {code.name}
                        </div>)}

                    </div>
                </div>)}
            </div>

        </main>

        {/*layout-separator-handle*/}
        <div id="grid-separator" className={'h-[20px] bg-green-950'} {...footerSeparatorProps}>
        </div>

        <footer className={'shrink-0'} style={{height: footerHeight}}>
            <CodeConsole/>
        </footer>

        {/*modals*/}
        <DialogCodeEdit code={codeEditing} setCode={codeSaved}/>
    </div>

}