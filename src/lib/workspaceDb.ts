import { withEntries, type Project, type WorkspaceData } from '../features/project/project'
import type { Entry } from '../features/project/tree'

const databaseName = 'forge-studio'
const store = 'workspace'

export function openWorkspaceDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(databaseName, 1)
    request.onupgradeneeded = () => request.result.createObjectStore(store)
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
    request.onblocked = () => reject(new Error('Close other Forge Studio tabs to open local storage.'))
  })
}

export function readWorkspace(db: IDBDatabase): Promise<{ data: WorkspaceData; revision: string | null } | null> {
  return new Promise((resolve, reject) => {
    const request = db.transaction(store).objectStore(store).get('current')
    request.onsuccess = () => {
      try {
        if (request.result === undefined) {
          resolve(null)
          return
        }
        const saved = record(request.result)
        resolve({
          data: restoreWorkspace(saved),
          revision: typeof saved.revision === 'string' ? saved.revision : null,
        })
      } catch (error) {
        reject(error)
      }
    }
    request.onerror = () => reject(request.error)
  })
}

export function saveWorkspace(db: IDBDatabase, workspace: WorkspaceData, expected: string | null): Promise<string> {
  return new Promise((resolve, reject) => {
    const revision = crypto.randomUUID()
    const transaction = db.transaction(store, 'readwrite')
    const records = transaction.objectStore(store)
    const request = records.get('current')
    let conflict = false

    transaction.oncomplete = () => resolve(revision)
    transaction.onabort = () => reject(conflict
      ? new Error('Another tab saved a newer workspace. Reload to open that version.')
      : transaction.error ?? new Error('The local save was cancelled.'))
    request.onsuccess = () => {
      if ((request.result?.revision ?? null) !== expected) {
        conflict = true
        transaction.abort()
        return
      }
      records.put({ version: 1, revision, workspace }, 'current')
    }
  })
}

function record(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error('Invalid workspace record.')
  return value as Record<string, unknown>
}

function stringList(value: unknown): string[] {
  if (!Array.isArray(value) || !value.every((item) => typeof item === 'string')) {
    throw new Error('Invalid workspace list.')
  }
  return [...new Set(value as string[])]
}

function restoreProject(raw: unknown): Project {
  const project = record(raw)
  if (typeof project.id !== 'string' || typeof project.name !== 'string' ||
      !Array.isArray(project.entries) || !(project.activeFileId === null || typeof project.activeFileId === 'string')) {
    throw new Error('Invalid saved project.')
  }
  const entries = project.entries.map((item): Entry => {
    const entry = record(item)
    if (typeof entry.id !== 'string' || typeof entry.name !== 'string' || !entry.name ||
        entry.name === '.' || entry.name === '..' || /[/\\:*?"<>|]/.test(entry.name) ||
        !(entry.parentId === null || typeof entry.parentId === 'string')) {
      throw new Error('Invalid saved file or folder.')
    }
    const { id, name, parentId } = entry
    if (entry.kind === 'folder') return { id, name, parentId, kind: 'folder' }
    if (entry.kind === 'file' && typeof entry.content === 'string') {
      return { id, name, parentId, kind: 'file', content: entry.content }
    }
    throw new Error('Invalid saved file contents.')
  })
  const byId = new Map(entries.map((entry) => [entry.id, entry]))
  const siblingNames = new Set<string>()
  if (byId.size !== entries.length) throw new Error('Duplicate saved file IDs.')

  for (const entry of entries) {
    const siblingKey = JSON.stringify([entry.parentId, entry.name.toLowerCase()])
    if (siblingNames.has(siblingKey)) throw new Error('Duplicate saved file names.')
    siblingNames.add(siblingKey)
    const visited = new Set([entry.id])
    let parentId = entry.parentId
    while (parentId !== null) {
      const parent = byId.get(parentId)
      if (parent?.kind !== 'folder' || visited.has(parentId)) throw new Error('Invalid saved folder hierarchy.')
      visited.add(parentId)
      parentId = parent.parentId
    }
  }

  return withEntries({
    id: project.id, name: project.name, entries,
    tabs: stringList(project.tabs), activeFileId: project.activeFileId,
    expanded: stringList(project.expanded),
  }, entries)
}

export function restoreWorkspace(value: unknown): WorkspaceData {
  const saved = record(value)
  if (saved.version !== 1) throw new Error('Unsupported workspace storage version.')
  const workspace = record(saved.workspace)
  if (!Array.isArray(workspace.projects) || !workspace.projects.length) throw new Error('No saved projects.')
  const projects = workspace.projects.map(restoreProject)
  if (new Set(projects.map((project) => project.id)).size !== projects.length) throw new Error('Duplicate saved projects.')
  const activeProject = projects.find((project) => project.id === workspace.activeProjectId)
  return { projects, activeProjectId: activeProject?.id ?? projects[0].id }
}
