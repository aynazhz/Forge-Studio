import { useEffect, useRef, useState } from 'react'
import { openWorkspaceDb, readWorkspace, saveWorkspace } from '../../lib/workspaceDb'
import { createProject, type WorkspaceData } from './project'

export function useWorkspace() {
  const [data, setData] = useState<WorkspaceData | null>(null)
  const [status, setStatus] = useState('Opening local workspace…')
  const [error, setError] = useState('')
  const dbRef = useRef<IDBDatabase | null>(null)
  const revision = useRef<string | null>(null)
  const savedData = useRef<WorkspaceData | null>(null)
  const writes = useRef(Promise.resolve())

  useEffect(() => {
    let cancelled = false
    let db: IDBDatabase | undefined

    async function load() {
      try {
        db = await openWorkspaceDb()
        if (cancelled) {
          db.close()
          return
        }
        const saved = await readWorkspace(db)
        if (cancelled) return
        dbRef.current = db
        if (saved) {
          revision.current = saved.revision
          savedData.current = saved.data
          setData(saved.data)
          setStatus('Saved locally')
          return
        }
      } catch (cause) {
        db?.close()
        if (cancelled) return
        setError(`Local storage is unavailable. Changes are session-only. ${String(cause)}`)
        setStatus('Session only')
      }

      const project = createProject('React Workbench')
      setData({ projects: [project], activeProjectId: project.id })
    }

    void load()
    return () => {
      cancelled = true
      dbRef.current = null
      db?.close()
    }
  }, [])

  useEffect(() => {
    const db = dbRef.current
    if (!db || !data || data === savedData.current) return
    let current = true
    setStatus('Saving locally…')
    const write = writes.current.then(async () => {
      revision.current = await saveWorkspace(db, data, revision.current)
      savedData.current = data
    })
    writes.current = write.catch(() => {})
    void write.then(() => {
      if (!current) return
      setError('')
      setStatus('Saved locally')
    }, (cause: unknown) => {
      if (!current) return
      setError(`Local save failed. Your edits are still in this tab. ${String(cause)}`)
      setStatus('Save failed')
    })
    return () => { current = false }
  }, [data])

  return { data, setData, status, error }
}
