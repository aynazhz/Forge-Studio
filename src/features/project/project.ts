import { starterFiles } from './template'
import type { Entry } from './tree'

export type Project = {
  id: string
  name: string
  entries: Entry[]
  tabs: string[]
  activeFileId: string | null
  expanded: string[]
}

export type WorkspaceData = { projects: Project[]; activeProjectId: string }

export function createProject(name: string): Project {
  const src: Entry = { id: crypto.randomUUID(), parentId: null, name: 'src', kind: 'folder' }
  const files = Object.entries(starterFiles).map(([path, content]): Entry => ({
    id: crypto.randomUUID(),
    parentId: path.startsWith('/src/') ? src.id : null,
    name: path.split('/').at(-1)!,
    kind: 'file',
    content,
  }))
  const app = files.find((file) => file.name === 'App.tsx')!
  return {
    id: crypto.randomUUID(), name, entries: [src, ...files],
    tabs: [app.id], activeFileId: app.id, expanded: [src.id],
  }
}

export function openFile(project: Project, id: string) {
  if (!project.entries.some((entry) => entry.id === id && entry.kind === 'file')) return project
  return {
    ...project, activeFileId: id,
    tabs: project.tabs.includes(id) ? project.tabs : [...project.tabs, id],
  }
}

export function closeTab(project: Project, id: string) {
  const index = project.tabs.indexOf(id)
  if (index === -1) return project
  const tabs = project.tabs.filter((tab) => tab !== id)
  const activeFileId = project.activeFileId === id
    ? tabs[index] ?? tabs[index - 1] ?? null
    : project.activeFileId
  return { ...project, tabs, activeFileId }
}

export function withEntries(project: Project, entries: Entry[]) {
  const files = new Set(entries.filter((entry) => entry.kind === 'file').map((entry) => entry.id))
  const folders = new Set(entries.filter((entry) => entry.kind === 'folder').map((entry) => entry.id))
  const tabs = project.tabs.filter((id) => files.has(id))
  const activeFileId = project.activeFileId && tabs.includes(project.activeFileId)
    ? project.activeFileId : tabs.at(-1) ?? null
  return { ...project, entries, tabs, activeFileId, expanded: project.expanded.filter((id) => folders.has(id)) }
}

export function editFile(project: Project, id: string, content: string) {
  if (!project.entries.some((entry) => entry.id === id && entry.kind === 'file' && entry.content !== content)) {
    return project
  }
  return {
    ...project,
    entries: project.entries.map((entry) => entry.id === id && entry.kind === 'file' ? { ...entry, content } : entry),
  }
}
