import { describe, expect, it } from 'vitest'
import { addEntry, deleteEntry, entryPath, moveEntry, renameEntry, type Entry } from '../src/features/project/tree'
import { closeTab, createProject, editFile, openFile, withEntries } from '../src/features/project/project'
import { restoreWorkspace } from '../src/lib/workspaceDb'

function sampleTree() {
  let entries: Entry[] = []
  entries = addEntry(entries, 'src', null, 'src', 'folder')
  entries = addEntry(entries, 'nested', 'src', 'nested', 'folder')
  return addEntry(entries, 'app', 'nested', 'App.tsx', 'file')
}

describe('file tree', () => {
  it('creates files and folders with stable IDs and derived paths', () => {
    const entries = sampleTree()
    expect(entries[2]).toMatchObject({ id: 'app', kind: 'file', content: '' })
    expect(entryPath(entries, entries[2])).toBe('/src/nested/App.tsx')
  })

  it('renames a folder and moves a subtree without changing file IDs', () => {
    const renamed = renameEntry(sampleTree(), 'src', 'source')
    expect(entryPath(renamed, renamed[2])).toBe('/source/nested/App.tsx')
    const moved = moveEntry(renamed, 'nested', null)
    expect(entryPath(moved, moved[2])).toBe('/nested/App.tsx')
    expect(moved[2].id).toBe('app')
  })

  it('deletes descendants and keeps siblings', () => {
    expect(deleteEntry(sampleTree(), 'nested').map(({ id }) => id)).toEqual(['src'])
  })

  it('rejects duplicates, invalid names, bad parents, conflicting moves and cycles', () => {
    const entries = sampleTree()
    expect(() => addEntry(entries, 'other', 'src', ' NESTED ', 'folder')).toThrow(/already/)
    expect(() => renameEntry(entries, 'nested', '../bad')).toThrow(/valid name/)
    expect(() => addEntry(entries, 'other', 'app', 'example', 'file')).toThrow(/destination/)
    expect(() => moveEntry(entries, 'src', 'nested')).toThrow(/descendants/)
    expect(() => moveEntry(entries, 'nested', 'nested')).toThrow(/descendants/)
    const withConflict = addEntry(entries, 'duplicate', 'src', 'App.tsx', 'file')
    expect(() => moveEntry(withConflict, 'app', 'src')).toThrow(/already/)
  })
})

describe('open files and persistence', () => {
  it('avoids duplicate tabs, falls back after closing, and removes deleted tabs', () => {
    const project = createProject('Demo')
    const original = project.activeFileId!
    const other = project.entries.find(({ name }) => name === 'caption.ts')!.id
    const opened = openFile(openFile(project, other), other)
    expect(opened.tabs).toEqual([original, other])
    expect(opened.activeFileId).toBe(other)
    expect(closeTab(opened, other).activeFileId).toBe(original)
    expect(closeTab(project, original).activeFileId).toBeNull()
    expect(withEntries(opened, deleteEntry(opened.entries, other))).toMatchObject({ tabs: [original], activeFileId: original })
  })

  it('round-trips projects and reconciles stale tab metadata', () => {
    let project = createProject('Demo')
    const active = project.activeFileId!
    project = editFile(project, active, 'export default function App() {}')
    const workspace = { projects: [project], activeProjectId: project.id }
    const serialized = JSON.stringify({ version: 1, workspace })
    expect(restoreWorkspace(JSON.parse(serialized))).toEqual(workspace)

    const stale = { ...project, tabs: [active, 'missing', active], activeFileId: 'missing' }
    expect(restoreWorkspace({ version: 1, workspace: { ...workspace, projects: [stale] } })).toEqual(workspace)
  })

  it('rejects an unsupported schema or cyclic restored folder graph', () => {
    const project = createProject('Demo')
    const workspace = { projects: [project], activeProjectId: project.id }
    expect(() => restoreWorkspace({ version: 99, workspace })).toThrow(/version/)
    const src = project.entries[0]
    src.parentId = src.id
    expect(() => restoreWorkspace({ version: 1, workspace })).toThrow(/hierarchy/)
  })
})
