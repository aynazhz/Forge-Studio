import { useLayoutEffect, useRef, useState, type FormEvent } from 'react'
import type { ItemAction } from './Explorer'
import { branchIds, entryPath, type Entry } from '../project/tree'

export type WorkspaceAction = { kind: ItemAction | 'project'; item?: Entry }

const titles = {
  project: 'New project', file: 'New file', folder: 'New folder',
  rename: 'Rename item', move: 'Move item', delete: 'Delete item',
}

export function WorkspaceDialog({ action, entries, onCancel, onSubmit }: {
  action: WorkspaceAction
  entries: Entry[]
  onCancel: () => void
  onSubmit: (name: string, parentId: string | null) => void
}) {
  const dialog = useRef<HTMLDialogElement>(null)
  const { kind, item } = action
  const [name, setName] = useState(kind === 'rename' ? item?.name ?? '' : '')
  const [destination, setDestination] = useState(
    kind !== 'move' && item?.kind === 'folder' ? item.id : item?.parentId ?? '',
  )
  const [error, setError] = useState('')
  const affected = item ? branchIds(entries, item.id) : new Set<string>()
  const available = entries.filter((entry) => entry.kind === 'folder' && (kind !== 'move' || !affected.has(entry.id)))

  useLayoutEffect(() => {
    const element = dialog.current!
    element.showModal()
    return () => { element.close() }
  }, [])

  function submit(event: FormEvent) {
    event.preventDefault()
    try {
      onSubmit(name, destination || null)
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : String(cause))
    }
  }

  return (
    <dialog className="dialog" ref={dialog} aria-labelledby="action-title" onCancel={(event) => { event.preventDefault(); onCancel() }}>
      <form onSubmit={submit}>
        <h2 id="action-title">{titles[kind]}</h2>
        {kind === 'project' && <p>Start with a working React and TypeScript project.</p>}
        {(kind === 'move' || kind === 'delete') && item && (
          <p><code>{entryPath(entries, item)}</code></p>
        )}
        {kind === 'delete' && (
          <p>{affected.size > 1
            ? `This folder and its ${affected.size - 1} nested items will be permanently removed.`
            : 'This item will be permanently removed.'}</p>
        )}
        {kind !== 'move' && kind !== 'delete' && (
          <label>Name<input autoFocus value={name} onChange={(event) => setName(event.target.value)} required maxLength={120} /></label>
        )}
        {['file', 'folder', 'move'].includes(kind) && (
          <label>Destination
            <select autoFocus={kind === 'move'} value={destination} onChange={(event) => setDestination(event.target.value)}>
              <option value="">Project root</option>
              {available.map((entry) => <option key={entry.id} value={entry.id}>{entryPath(entries, entry)}</option>)}
            </select>
          </label>
        )}
        {error && <p role="alert" className="form-error">{error}</p>}
        <div className="dialog-actions">
          <button type="button" autoFocus={kind === 'delete'} onClick={onCancel}>Cancel</button>
          <button className={kind === 'delete' ? 'danger-button' : 'primary-button'}>
            {kind === 'delete' ? 'Delete' : kind === 'move' ? 'Move' : kind === 'rename' ? 'Rename' : 'Create'}
          </button>
        </div>
      </form>
    </dialog>
  )
}
