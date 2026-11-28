import { Box, Braces, ChevronRight, CircleCheck, HardDrive, Plus } from 'lucide-react'
import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from 'react'
import { closeTab, createProject, editFile, openFile, withEntries, type Project } from '../features/project/project'
import { addEntry, deleteEntry, filePaths, moveEntry, renameEntry, type Entry } from '../features/project/tree'
import { useWorkspace } from '../features/project/useWorkspace'
import { EditorPane } from '../features/workspace/EditorPane'
import { Explorer, FileMark, type ItemAction } from '../features/workspace/Explorer'
import { languageFor } from '../features/workspace/monaco'
import { PreviewPane } from '../features/workspace/PreviewPane'
import { ResizeHandle } from '../features/workspace/ResizeHandle'
import { TabBar } from '../features/workspace/TabBar'
import { WorkspaceDialog, type WorkspaceAction } from '../features/workspace/WorkspaceDialog'

export function App() {
  const { data, setData, status, error } = useWorkspace()
  const open = (id: string) => setData((current) => current && { ...current, activeProjectId: id })
  const update = useCallback((projectId: string, change: (project: Project) => Project) => {
    setData((current) => current && ({
      ...current, projects: current.projects.map((project) => project.id === projectId ? change(project) : project),
    }))
  }, [setData])

  if (!data) return <main className="startup" role="status">{status}</main>

  const project = data.projects.find(({ id }) => id === data.activeProjectId)!
  return (
    <Workspace
      key={project.id}
      project={project}
      projects={data.projects}
      storageStatus={status}
      storageError={error}
      onOpenProject={open}
      onCreateProject={(name) => {
        const newProject = createProject(name)
        setData((current) => current && ({
          projects: [...current.projects, newProject], activeProjectId: newProject.id,
        }))
      }}
      onUpdate={update}
    />
  )
}

function Workspace({ project, projects, storageStatus, storageError, onOpenProject, onCreateProject, onUpdate }: {
  project: Project
  projects: Project[]
  storageStatus: string
  storageError: string
  onOpenProject: (id: string) => void
  onCreateProject: (name: string) => void
  onUpdate: (id: string, change: (project: Project) => Project) => void
}) {
  const [selection, setSelection] = useState(project.activeFileId)
  const [action, setAction] = useState<WorkspaceAction | null>(null)
  const [previewWidth, setPreviewWidth] = useState(40)
  const [position, setPosition] = useState('Ln 1, Col 1')
  const searchRef = useRef<HTMLInputElement>(null)
  const selected = project.entries.find((entry) => entry.id === selection)
  const files = useMemo(() => filePaths(project.entries), [project.entries])
  const runtimeFiles = useMemo(() => Object.fromEntries(files.map(({ entry, path }) => [path, entry.content])), [files])
  const active = files.find(({ entry }) => entry.id === project.activeFileId)
  const pathParts = active?.path.slice(1).split('/')
  const projectId = project.id
  const edit = useCallback((id: string, text: string) => {
    onUpdate(projectId, (current) => editFile(current, id, text))
  }, [onUpdate, projectId])

  useEffect(() => {
    function shortcut(event: KeyboardEvent) {
      if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key.toLowerCase() === 'f' && !action) {
        event.preventDefault()
        searchRef.current?.focus()
      }
    }
    window.addEventListener('keydown', shortcut)
    return () => window.removeEventListener('keydown', shortcut)
  }, [action])

  function select(id: string) {
    setSelection(id)
    const entry = project.entries.find((entry) => entry.id === id)
    if (entry?.kind === 'file') {
      onUpdate(project.id, (current) => openFile(current, id))
    } else if (entry?.kind === 'folder') {
      onUpdate(project.id, (current) => ({
        ...current, expanded: current.expanded.includes(id)
          ? current.expanded.filter((folder) => folder !== id) : [...current.expanded, id],
      }))
    }
  }

  function openFileTab(id: string) {
    setSelection(id)
    onUpdate(project.id, (current) => openFile(current, id))
  }

  function openAction(kind: ItemAction, target: Entry | undefined = selected) {
    setAction({ kind, item: target })
  }

  function applyAction(name: string, destination: string | null) {
    if (!action) return
    const { kind, item } = action
    if (kind === 'project') {
      const trimmed = name.trim()
      if (!trimmed) throw new Error('Enter a project name.')
      if (projects.some((other) => other.name.toLowerCase() === trimmed.toLowerCase())) {
        throw new Error('That project name is already in use.')
      }
      onCreateProject(trimmed)
    } else if (kind === 'file' || kind === 'folder') {
      const id = crypto.randomUUID()
      addEntry(project.entries, id, destination, name, kind)
      onUpdate(project.id, (current) => {
        const next = withEntries(current, addEntry(current.entries, id, destination, name, kind))
        const expanded = destination && !next.expanded.includes(destination)
          ? [...next.expanded, destination] : next.expanded
        const updated = { ...next, expanded }
        return kind === 'file' ? openFile(updated, id) : updated
      })
      setSelection(id)
    } else if (item) {
      const change = kind === 'rename' ? (entries: Entry[]) => renameEntry(entries, item.id, name)
        : kind === 'move' ? (entries: Entry[]) => moveEntry(entries, item.id, destination)
          : (entries: Entry[]) => deleteEntry(entries, item.id)
      change(project.entries)
      onUpdate(project.id, (current) => withEntries(current, change(current.entries)))
      setSelection(kind === 'delete' ? null : item.id)
    }
    setAction(null)
  }

  return (
    <div className="shell">
      <header className="app-bar">
        <div className="brand"><span className="brand-symbol"><Box size={20} strokeWidth={2.25} /></span><span>Forge Studio</span></div>
        <div className="project-control">
          <label className="sr-only" htmlFor="project-select">Open project</label>
          <select id="project-select" value={project.id} onChange={(event) => onOpenProject(event.target.value)}>
            {projects.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
          </select>
          <button className="new-project" onClick={() => setAction({ kind: 'project' })}><Plus size={16} /> New project</button>
        </div>
      </header>
      {storageError && <p className="storage-error" role="alert">{storageError}</p>}
      <main className="workbench">
        <Explorer
          project={project} files={files} selected={selected} searchRef={searchRef}
          onSelect={select} onOpen={openFileTab} onAction={openAction}
        />
        <div className="split" style={{ '--preview-width': `${previewWidth}%` } as CSSProperties}>
          <section className="editing" aria-label="Editor">
            <TabBar project={project} files={files} onOpen={openFileTab}
              onClose={(id) => onUpdate(project.id, (current) => closeTab(current, id))}
            />
            <div className="breadcrumbs" aria-label="Active file path">
              {pathParts?.map((part, index) => (
                <span key={index}>{index > 0 && <ChevronRight size={12} />}{index === pathParts.length - 1 && <FileMark name={part} />}{part}</span>
              ))}
            </div>
            <EditorPane files={files} activeId={project.activeFileId} onEdit={edit} onPosition={setPosition} />
          </section>
          <ResizeHandle value={previewWidth} onChange={setPreviewWidth} />
          <PreviewPane files={runtimeFiles} />
        </div>
      </main>
      <footer className="status-bar">
        <span role="status" className="storage-status">
          {storageStatus === 'Saved locally' ? <CircleCheck size={13} /> : <HardDrive size={13} />}
          {storageStatus}
        </span>
        {active && <div className="editor-status"><span>{position}</span><span><Braces size={13} />{languageFor(active.path)}</span></div>}
      </footer>
      {action && <WorkspaceDialog action={action} entries={project.entries} onCancel={() => setAction(null)} onSubmit={applyAction} />}
    </div>
  )
}
