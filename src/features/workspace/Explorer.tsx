import {
  ChevronDown, ChevronRight, File, FilePlus2, Folder, FolderOpen, FolderPlus,
  MoveRight, Pencil, Search, Trash2, X,
} from 'lucide-react'
import { useRef, useState, type RefObject } from 'react'
import type { Project } from '../project/project'
import type { Entry, filePaths } from '../project/tree'

export type ItemAction = 'file' | 'folder' | 'rename' | 'move' | 'delete'

export function FileMark({ name }: { name: string }) {
  const extension = name.split('.').pop()?.toLowerCase()
  if (extension === 'ts' || extension === 'tsx') return <span className="file-mark ts" aria-hidden="true">TS</span>
  if (extension === 'js' || extension === 'jsx') return <span className="file-mark js" aria-hidden="true">JS</span>
  if (extension === 'css') return <span className="file-mark css" aria-hidden="true">#</span>
  if (extension === 'html') return <span className="file-mark html" aria-hidden="true">‹›</span>
  if (extension === 'json') return <span className="file-mark json" aria-hidden="true">{'{}'}</span>
  return <File className="file-mark" size={14} aria-hidden="true" />
}

type Props = {
  project: Project
  files: ReturnType<typeof filePaths>
  selected: Entry | undefined
  searchRef: RefObject<HTMLInputElement | null>
  onSelect: (id: string) => void
  onOpen: (id: string) => void
  onAction: (action: ItemAction, target?: Entry) => void
}

export function Explorer({ project, files, selected, searchRef, onSelect, onOpen, onAction }: Props) {
  const [query, setQuery] = useState('')
  const treeRef = useRef<HTMLButtonElement>(null)
  const term = query.trim().toLowerCase()
  const matches = term ? files.flatMap(({ entry, path }) => {
    const lines = entry.content.split(/\r?\n/)
    const line = lines.findIndex((text) => text.toLowerCase().includes(term))
    if (line === -1 && !path.toLowerCase().includes(term)) return []
    return [{ entry, path, line, snippet: lines[line]?.trim() }]
  }) : []

  function renderBranch(parentId: string | null) {
    const children = project.entries.filter((entry) => entry.parentId === parentId)
      .sort((first, second) => first.kind === second.kind
        ? first.name.localeCompare(second.name)
        : first.kind === 'folder' ? -1 : 1)
    return (
      <ul className="tree-list">
        {children.map((entry) => {
          const isFolder = entry.kind === 'folder'
          const expanded = isFolder && project.expanded.includes(entry.id)
          const chosen = entry.id === selected?.id
          return (
            <li key={entry.id}>
              <button
                className="tree-row"
                data-selected={chosen}
                aria-current={chosen ? 'true' : undefined}
                aria-expanded={isFolder ? expanded : undefined}
                onClick={() => onSelect(entry.id)}
                onKeyDown={(event) => {
                  if (event.key === 'F2') {
                    event.preventDefault()
                    onAction('rename', entry)
                  }
                }}
              >
                {isFolder
                  ? <>{expanded ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
                    {expanded ? <FolderOpen className="folder-icon" size={15} /> : <Folder className="folder-icon" size={15} />}</>
                  : <><span className="tree-spacer" /><FileMark name={entry.name} /></>}
                <span className="truncate">{entry.name}</span>
              </button>
              {expanded && renderBranch(entry.id)}
            </li>
          )
        })}
      </ul>
    )
  }

  return (
    <aside className="explorer" aria-label="Explorer">
      <div className="pane-heading">
        <h2>Explorer</h2>
        <div className="small-actions">
          <button className="icon-button" title="New file" aria-label="New file" onClick={() => onAction('file')}><FilePlus2 size={17} /></button>
          <button className="icon-button" title="New folder" aria-label="New folder" onClick={() => onAction('folder')}><FolderPlus size={17} /></button>
        </div>
      </div>
      <div className="search-box">
        <Search size={15} aria-hidden="true" />
        <input ref={searchRef} type="search" value={query} placeholder="Search files and text" aria-label="Search project" onChange={(event) => setQuery(event.target.value)} onKeyDown={(event) => {
          if (event.key === 'Escape') { setQuery(''); treeRef.current?.focus() }
        }} />
        {query && <button className="icon-button" aria-label="Clear search" onClick={() => { setQuery(''); searchRef.current?.focus() }}><X size={13} /></button>}
      </div>
      <div className="explorer-content">
        <div className="tree-heading">
          <button ref={treeRef} className="root-label" title={project.name} onClick={() => setQuery('')}>
            {term ? 'Search results' : project.name}
          </button>
          {term && <span>{matches.length}</span>}
        </div>
        {term ? (
          <ul className="search-results">
            {matches.map(({ entry, path, line, snippet }) => (
              <li key={entry.id}>
                <button onClick={() => { onOpen(entry.id); setQuery('') }}>
                  <FileMark name={entry.name} />
                  <span><strong>{entry.name}</strong><small>{path}{line >= 0 ? `:${line + 1}` : ''}</small>
                    {snippet && <small>{snippet}</small>}</span>
                </button>
              </li>
            ))}
            {!matches.length && <li className="muted-note">No matches in this project.</li>}
          </ul>
        ) : project.entries.length ? renderBranch(null) : <p className="muted-note">This project is empty.</p>}
      </div>
      <div className="item-actions" aria-label="Selected item actions">
        <span className="truncate" title={selected?.name}>{selected?.name ?? 'No selection'}</span>
        <button className="icon-button" title="Rename selected item (F2)" aria-label="Rename selected item" disabled={!selected} onClick={() => onAction('rename')}><Pencil size={15} /></button>
        <button className="icon-button" title="Move selected item" aria-label="Move selected item" disabled={!selected} onClick={() => onAction('move')}><MoveRight size={16} /></button>
        <button className="icon-button destructive" title="Delete selected item" aria-label="Delete selected item" disabled={!selected} onClick={() => onAction('delete')}><Trash2 size={15} /></button>
      </div>
    </aside>
  )
}
