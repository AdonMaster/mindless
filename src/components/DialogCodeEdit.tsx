import {type ChangeEvent, useEffect, useRef, useState} from "react"
import type {Code} from "@/data/Code.ts"
import {LuCheck} from "react-icons/lu"

export function DialogCodeEdit(p: {code: Code|null, setCode: (Code: Code|null)=>void}) {

    //
    const refDialog = useRef<HTMLDialogElement>(null)
    const [local, setLocal] = useState<Code|null>(null)

    //
    const isValid = local?.name?.length ?? 0

    // start
    useEffect(() => {

        //
        refDialog.current?.addEventListener('close', () => {
            p.setCode(null)
        })

        if (p.code) {
            setLocal({...p.code})
            refDialog.current?.showModal()
        }

    }, [p]);

    //
    function nameChanged(e: ChangeEvent<HTMLInputElement>) {
        if (! local) return
        setLocal({...local, name: e.target.value})
    }
    function descChanged(e: ChangeEvent<HTMLTextAreaElement>) {
        if (! local) return
        setLocal({...local, desc: e.target.value})
    }

    //
    function save() {
        p.setCode(local)
        refDialog.current?.close()
    }

    //
    return <>
        <dialog ref={refDialog} className="modal sm:modal-middle ">
            <div className="modal-box">

                <form method="dialog">
                    <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                </form>

                <h3 className="text-lg font-bold mb-4">
                    {local?.key}
                </h3>

                <fieldset className="fieldset w-full">
                    <legend className="fieldset-legend">Name *</legend>
                    <input
                        value={local?.name ?? ''}
                        onChange={nameChanged}
                        type="text" className="input w-full" placeholder="Type here"
                    />

                    <legend className="fieldset-legend">Description</legend>
                    <textarea
                        className="textarea h-24 w-full resize-none" placeholder=""
                        value={local?.desc ?? ''}
                        onChange={descChanged}
                    ></textarea>
                </fieldset>

                <div className="modal-action">
                    <button
                        disabled={!isValid} onClick={save}
                        value={'ok'} className="btn btn-primary"
                    >
                        <LuCheck/>
                        Save
                    </button>
                </div>
            </div>
        </dialog>
    </>
}