import {expect} from 'chai'
import {describe} from 'mocha'
import {root} from "../src/data/Code"
import Chain from "../src/helpers/Chain"

//
type Node = {id: string, children: Node[], parent: Node|null}

//
describe('Chain.ts', () => {

    it('simple assertion', () => {
        expect(2).to.eq(2)
    })

    it('should remove shallow', () => {

        root.children.push({
            id: 'dino', key: '', children: [], parent: root, name: '', desc: '', theme: ''
        })

        //
        expect(Chain.isReconciled(root)).to.be.true

        //
        expect(root.children.length).to.eq(1)

        //
        const newRoot = Chain.remove(root, 'dino')

        //
        expect(root.children.length).to.eq(1)
        expect(root.children[0].id).to.eq('dino')
        expect(newRoot.children.length).to.eq(0)
    })

    it('should reconcile', () => {
        const schema: Node = {
            id: 'root', children: [
                {
                    id: 'a1', parent: null, children: [
                        { id: 'a2', parent: null, children: [
                            {id: 'a3', parent: null, children: []}
                        ] },
                        { id: 'a2-1', children: [], parent: null }
                    ]
                },
                {
                    id: 'b1', parent: null, children: [
                        { id: 'b2', children: [], parent: null }
                    ]
                }
            ]
        }
        const newSchema = Chain.reconcile(schema)
        expect(Chain.isReconciled(newSchema)).to.be.true

        //
        expect(newSchema.children[0].id).to.eq('a1')
        expect(newSchema.children[0].parent?.id).to.eq('root')

        expect(newSchema.children[0].children[0].id).to.eq('a2')
        expect(newSchema.children[0].children[0].parent?.id).to.eq('a1')

        expect(newSchema.children[0].children[0].children[0].id).to.eq('a3')
        expect(newSchema.children[0].children[0].children[0].parent?.id).to.eq('a2')

        //
        expect(newSchema.children[1].id).to.eq('b1')
        expect(newSchema.children[1].parent?.id).to.eq('root')

        expect(newSchema.children[1].children[0].id).to.eq('b2')
        expect(newSchema.children[1].children[0].parent?.id).to.eq('b1')

    })

    it('should remove deep', () => {

        const _schema: Node = {
            id: 'root', children: [
                {
                    id: 'a1', parent: null, children: [
                        { id: 'a2', children: [], parent: null },
                        { id: 'a2-1', children: [], parent: null }
                    ]
                },
                {
                    id: 'b1', parent: null, children: [
                        { id: 'b2', children: [], parent: null }
                    ]
                }
            ]
        }
        const schema = Chain.reconcile(_schema)
        expect(Chain.isReconciled(schema)).to.be.true

        //
        let newSchema = Chain.remove(schema, 'a1')
        expect(Chain.isReconciled(newSchema)).to.be.true
        expect(newSchema.children).to.length(1)
        expect(newSchema.children[0].id).to.eq('b1')

        //
        newSchema = Chain.remove(schema, 'b1')
        expect(Chain.isReconciled(newSchema)).to.be.true
        expect(newSchema.children).to.length(1)
        expect(newSchema.children[0].id).to.eq('a1')
    })

    it('should find... even deeper', () => {
        const _schema: Node = {
            id: 'root', children: [
                {
                    id: 'a1', parent: null, children: [
                        { id: 'a2', children: [], parent: null },
                        { id: 'a2-1', children: [], parent: null }
                    ]
                },
                {
                    id: 'b1', parent: null, children: [
                        { id: 'b2', children: [], parent: null }
                    ]
                }
            ]
        }

        expect(Chain.find(_schema, 'root')?.id).to.eq('root')
        expect(Chain.find(_schema, 'a2')?.id).to.eq('a2')
        expect(Chain.find(_schema, 'a2-1')?.id).to.eq('a2-1')
        expect(Chain.find(_schema, 'a2-3')).to.null

        //
        const reconciledSchema = Chain.reconcile(_schema)
        expect(Chain.find(reconciledSchema, 'b2')?.parent?.id).to.eq('b1')
        expect(Chain.isReconciled(reconciledSchema)).to.be.true

    })

    it('should insert', () => {
        const _schema: Node = {
            id: 'root', children: [
                {
                    id: 'a1', parent: null, children: [
                        { id: 'a2', children: [], parent: null },
                        { id: 'a2-1', children: [], parent: null }
                    ]
                },
                {
                    id: 'b1', parent: null, children: [
                        { id: 'b2', children: [], parent: null }
                    ]
                }
            ]
        }
        const schema = Chain.reconcile(_schema)
        expect(Chain.isReconciled(schema)).to.be.true

        //
        let newSchema = Chain.insert(schema, {
            id: 'macaco', parent: null, children: []
        }, 'a1', 1)
        expect(Chain.isReconciled(newSchema)).to.be.true

        //
        expect(schema?.children[0].children[1].id).to.eq('a2-1')
        expect(newSchema?.children[0].children[1].id).to.eq('macaco')

        //
        newSchema = Chain.insert(schema, {
            id: 'shoebody', parent: null, children: []
        }, 'root', 0)
        expect(Chain.isReconciled(newSchema)).to.be.true
        expect(newSchema?.children[0].id).to.eq('shoebody')

    })

    it('should move', () => {
        const schema: Node = {
            id: 'root', children: [
                {
                    id: 'a1', parent: null, children: [
                        { id: 'a2', children: [], parent: null },
                        { id: 'a2-1', children: [], parent: null }
                    ]
                },
                {
                    id: 'b1', parent: null, children: [
                        { id: 'b2', children: [], parent: null }
                    ]
                }
            ]
        }
        const newSchema = Chain.move(schema, 'b2', 'a1', 1)

        //
        expect(Chain.isReconciled(newSchema)).to.be.true
        expect(newSchema.children[0]?.children[1]?.id).to.eq('b2')
        expect(newSchema.children[1]?.children.length).to.eq(0)
        expect(newSchema).not.to.equal(schema)
    })

    it('should NOT move', () => {
        const schema: Node = {
            id: 'root', children: [
                {
                    id: 'a1', parent: null, children: [
                        {id: 'a2', children: [], parent: null},
                        {id: 'a2-1', children: [], parent: null}
                    ]
                },
                {
                    id: 'b1', parent: null, children: [
                        {id: 'b2', children: [], parent: null}
                    ]
                }
            ]
        }
        const newSchema = Chain.move(schema, 'a1', 'a2-1', 1)
        expect(newSchema).to.equal(schema)
    })

    it ('should substitute', () => {
        const schema: Node = {
            id: 'root', children: [
                {
                    id: 'a1', parent: null, children: [
                        {id: 'a2', children: [], parent: null},
                        {id: 'a2-1', children: [], parent: null}
                    ]
                },
                {
                    id: 'b1', parent: null, children: [
                        {id: 'b2', children: [], parent: null}
                    ]
                }
            ]
        }
        const newSchema = Chain.substitute(schema, 'a2-1', {
            id: 'macaco', parent: null, children: []
        })
        expect(Chain.isReconciled(newSchema)).to.be.true

        //
        expect(newSchema.children[0].children[1].id).to.be.eq('macaco')
        expect(Chain.find(schema, 'a2-1')).to.be.an('object')
        expect(Chain.find(newSchema, 'a2-1')).to.be.null
    })

})