export type ChainNode<T> = { id: string, children: T[], parent: T|null }

export default {

    remove<T extends ChainNode<T>>(og: T, id: string): T
    {
        const res: T = {...og}
        res.children = og.children.filter(fi => fi.id != id)
        res.children = res.children.map(m => this.remove({...m, parent: res} as T, id))
        return res
    },


    reconcile<T extends ChainNode<T>>(og: T): T {
        const res: T = {...og}
        res.children = og.children.map(ma => {
            return this.reconcile({...ma, parent: res} as T)
        })
        return res
    },

    isReconciled<T extends ChainNode<T>>(og: T): boolean {
        for (const child of og.children) {
            if (child.parent !== og) return false
            if (! this.isReconciled(child)) return false
        }
        return true
    },

    find<T extends ChainNode<T>>(root: T, id: string): T|null {
        if (root.id == id) return root
        for (const ch of root.children) {
            if (ch.id == id) return ch
            const foundInner = this.find(ch, id)
            if (foundInner) return foundInner
        }
        return null
    },

    nullParent<T extends ChainNode<T>>(root: T): T {
        const res = {...root, parent: null}
        res.children = res.children.map(ma => this.nullParent(ma))
        return res
    },

    jsonStringify<T extends ChainNode<T>>(root: T): string {
        return JSON.stringify(this.nullParent(root))
    },

    insert<T extends ChainNode<T>>(root: T, node: T, parentId: string, index: number): T
    {
        const res: T = {...root, children: []}
        let insertStatus: 'nop'|'should'|'done' = root.id == parentId ? 'should' : 'nop'

        let i = -1
        for (const fe of root.children) {
            i++
            if (insertStatus == 'should') {
                if (i == index) {
                    res.children.push({...node, parent: res})
                    insertStatus = 'done'
                }
            }
            res.children.push(this.insert({...fe, parent: res}, node, parentId, index))
        }

        if (insertStatus == 'should') {
            res.children.push({...node, parent: res})
        }

        return res
    },

    substitute<T extends ChainNode<T>>(root: T, id: string, newInstance: T): T
    {
        // substitute root
        if (root.id == id) return {...newInstance}

        //
        const res: T = {...root, children: []}
        for (const fe of root.children) {
            if (fe.id == id) {
                res.children.push({...newInstance, parent: res})
            } else {
                res.children.push(this.substitute({...fe, parent: res}, id, newInstance))
            }
        }

        return res
    },

    move<T extends ChainNode<T>>(root: T, originId: string, destinationParentId: string, destinationIndex: number): T
    {

        // // is dragging parent of some deep child
        // let cur: Code|null = c
        // while (cur) {
        //     if (cur.id == dragging.id) return
        //     cur = cur.parent
        // }
        // //
        // if (! dragging.parent) return
        //
        // //
        // const newRoot = Chain.reconcile(root)



        const origin = this.find(root, originId)
        if (! origin) return root

        const removed = this.remove(root, originId)
        const parent = this.find(removed, destinationParentId)
        if (! parent) return root

        //
        return this.insert(removed, origin, destinationParentId, destinationIndex)
    }

}