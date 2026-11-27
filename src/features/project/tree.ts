type EntryBase = { id: string; parentId: string | null; name: string }
export type FileEntry = EntryBase & { kind: 'file'; content: string }
export type FolderEntry = EntryBase & { kind: 'folder' }
export type Entry = FileEntry | FolderEntry

export function entryPath(entries: Entry[], entry: Entry): string {
  const parent = entries.find((candidate) => candidate.id === entry.parentId)
  return parent ? `${entryPath(entries, parent)}/${entry.name}` : `/${entry.name}`
}

function validName(entries: Entry[], parentId: string | null, input: string, exceptId?: string) {
  const name = input.trim()
  if (!name || name === '.' || name === '..' || /[/\\:*?"<>|]/.test(name) ||
      [...name].some((character) => character.charCodeAt(0) < 32) || name.endsWith('.')) {
    throw new Error('Enter a valid name without path separators or reserved characters.')
  }
  if (parentId !== null && !entries.some((entry) => entry.id === parentId && entry.kind === 'folder')) {
    throw new Error('The destination folder does not exist.')
  }
  if (entries.some((entry) => entry.parentId === parentId && entry.id !== exceptId &&
      entry.name.toLowerCase() === name.toLowerCase())) {
    throw new Error('That name is already used in this folder.')
  }
  return name
}

export function addEntry(entries: Entry[], id: string, parentId: string | null, input: string, kind: Entry['kind']): Entry[] {
  const name = validName(entries, parentId, input)
  const entry: Entry = kind === 'file'
    ? { id, parentId, name, kind, content: '' }
    : { id, parentId, name, kind }
  return [...entries, entry]
}

function requireEntry(entries: Entry[], id: string) {
  const entry = entries.find((candidate) => candidate.id === id)
  if (!entry) throw new Error('This item no longer exists.')
  return entry
}

export function branchIds(entries: Entry[], id: string) {
  const ids = new Set([id])
  function visit(parentId: string) {
    for (const child of entries.filter((entry) => entry.parentId === parentId)) {
      ids.add(child.id)
      visit(child.id)
    }
  }
  visit(id)
  return ids
}

export function renameEntry(entries: Entry[], id: string, input: string) {
  const entry = requireEntry(entries, id)
  const name = validName(entries, entry.parentId, input, id)
  return entries.map((candidate) => candidate.id === id ? { ...candidate, name } : candidate)
}

export function moveEntry(entries: Entry[], id: string, parentId: string | null) {
  const entry = requireEntry(entries, id)
  if (parentId !== null && branchIds(entries, id).has(parentId)) {
    throw new Error('An item cannot move into itself or one of its descendants.')
  }
  validName(entries, parentId, entry.name, id)
  return entries.map((candidate) => candidate.id === id ? { ...candidate, parentId } : candidate)
}

export function deleteEntry(entries: Entry[], id: string) {
  const deleted = branchIds(entries, id)
  return entries.filter((entry) => !deleted.has(entry.id))
}

export function filePaths(entries: Entry[]) {
  return entries.flatMap((entry) => entry.kind === 'file' ? [{ entry, path: entryPath(entries, entry) }] : [])
}
