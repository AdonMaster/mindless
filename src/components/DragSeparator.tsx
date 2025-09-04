import {useState} from "react"
import clsx from "clsx"

export function DragSeparator(p: {dataIndex: number}) {

    const [isDragging, setIsDragging] = useState(false)

    return (
        <div
            data-index={p.dataIndex}
            id={'drag-separator'}
            onDragEnter={() => setIsDragging(true)}
            onDragLeave={() => setIsDragging(false)}
            onDrop={() => setIsDragging(false)}
            className={clsx('h-[8px] bg-neutral-300 transition-opacity', isDragging ? 'opacity-100' : 'opacity-0')}
        >

        </div>
    )

}