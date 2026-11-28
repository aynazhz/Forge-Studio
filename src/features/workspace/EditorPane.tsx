import { useLayoutEffect, useRef, useState } from 'react'
import type { filePaths } from '../project/tree'
import { languageFor, monaco } from './monaco'

type FileModel = {
  path: string
  model: monaco.editor.ITextModel
  view: monaco.editor.ICodeEditorViewState | null
}
type Props = {
  files: ReturnType<typeof filePaths>
  activeId: string | null
  onEdit: (id: string, content: string) => void
  onPosition: (position: string) => void
}

export function EditorPane({ files, activeId, onEdit, onPosition }: Props) {
  const host = useRef<HTMLDivElement>(null)
  const editor = useRef<monaco.editor.IStandaloneCodeEditor | null>(null)
  const models = useRef(new Map<string, FileModel>())
  const active = useRef<string | null>(null)
  const [error, setError] = useState('')

  useLayoutEffect(() => {
    const cache = models.current
    let instance: monaco.editor.IStandaloneCodeEditor
    try {
      instance = monaco.editor.create(host.current!, {
        theme: 'forge',
        model: null,
        automaticLayout: true,
        ariaLabel: 'Code editor',
        fontFamily: '"Cascadia Code", "JetBrains Mono", Consolas, monospace',
        fontSize: 14,
        lineHeight: 24,
        padding: { top: 16 },
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        tabSize: 2,
      })
    } catch (cause) {
      setError(`Could not open the editor. ${String(cause)}`)
      return
    }
    editor.current = instance

    return () => {
      instance.dispose()
      cache.forEach(({ model }) => model.dispose())
      cache.clear()
      editor.current = null
      active.current = null
    }
  }, [])

  useLayoutEffect(() => {
    const instance = editor.current
    if (!instance) return

    const content = instance.onDidChangeModelContent(() => {
      const model = instance.getModel()
      const id = active.current
      if (id && model === models.current.get(id)?.model) onEdit(id, model.getValue())
    })
    const cursor = instance.onDidChangeCursorPosition(({ position }) => {
      onPosition(`Ln ${position.lineNumber}, Col ${position.column}`)
    })
    return () => {
      content.dispose()
      cursor.dispose()
    }
  }, [onEdit, onPosition])

  useLayoutEffect(() => {
    const instance = editor.current
    if (!instance) return
    const cache = models.current
    const oldActive = active.current ? cache.get(active.current) : undefined
    const paths = new Map(files.map(({ entry, path }) => [entry.id, path]))
    const oldActivePath = active.current ? paths.get(active.current) : undefined
    if (oldActive && (active.current !== activeId || oldActive.path !== oldActivePath)) {
      oldActive.view = instance.saveViewState()
      active.current = null
      instance.setModel(null)
    }

    const previousViews = new Map<string, FileModel['view']>()
    for (const [id, existing] of cache) {
      if (paths.get(id) === existing.path) continue
      previousViews.set(id, existing.view)
      existing.model.dispose()
      cache.delete(id)
    }
    for (const { entry, path } of files) {
      if (cache.has(entry.id)) continue
      const model = monaco.editor.createModel(entry.content, languageFor(path), monaco.Uri.file(path))
      cache.set(entry.id, { path, model, view: previousViews.get(entry.id) ?? null })
    }

    const next = activeId ? cache.get(activeId) : undefined
    if (next && active.current !== activeId) {
      active.current = activeId
      instance.setModel(next.model)
      if (next.view) instance.restoreViewState(next.view)
      const position = instance.getPosition()
      if (position) onPosition(`Ln ${position.lineNumber}, Col ${position.column}`)
    }
  }, [activeId, files, onPosition])

  return (
    <div className="editor-area">
      <div className="editor-host" ref={host} hidden={!activeId || !!error} />
      {error && <p className="empty" role="alert">{error}</p>}
      {!error && !activeId && <div className="empty"><strong>No file open</strong><p>Choose a file in the Explorer or open a search result.</p></div>}
    </div>
  )
}
