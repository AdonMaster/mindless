import './Main.css'
import {type DragEvent, useCallback, useState} from "react"
import {type Code, codeLibrary, root as ogRoot} from "@/data/Code.ts"
import {CodeComponent} from "@/components/CodeComponent.tsx"
import {LuGripVertical} from "react-icons/lu"
import clsx from "clsx"
import {DialogCodeEdit} from "@/components/DialogCodeEdit.tsx"
import Chain from "@/helpers/Chain.ts"
import {v4 as uuid} from 'uuid'

//
export function Main() {

    const [root, setRoot] = useState<Code>({...ogRoot})
    const [dragging, setDragging] = useState<Code|null>(null)
    const [codeEditing, setCodeEditing] = useState<Code|null>(null)

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
            dragging.parent = c
            setCodeEditing(dragging)
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

    //
    return <div>

        <div className={'flex gap-2 m-3 items-start'}>

            {/*editor*/}
            <div id="editor" className={'p-3 grow'}>
                <CodeComponent
                    key={root.id}
                    code={root} droppedOn={droppedOn} edit={edit} destroy={destroy} setDragging={setDragging}
                />
            </div>

            {/*lib*/}
            <div id="lib" className={'p-3 rounded-lg hidden md:flex w-sm bg-neutral-600'}>
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
                            draggable={true}
                            onDragStart={e => ondragstart(code, e)}
                        >
                            <LuGripVertical/> {code.name}
                        </div>)}

                    </div>
                </div>)}
            </div>

        </div>

        {/*edit*/}
        <DialogCodeEdit code={codeEditing} setCode={codeSaved}/>
    </div>

}