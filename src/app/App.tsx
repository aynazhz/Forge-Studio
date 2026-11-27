import { useEffect, useRef, useState } from 'react'
import { starterFiles } from '../features/project/template'
import { PreviewPane } from '../features/workspace/PreviewPane'
import { languageFor, monaco } from '../features/workspace/monaco'

export function App() {
  const [files, setFiles] = useState<Record<string, string>>(starterFiles)
  const [path, setPath] = useState('/src/App.tsx')
  const host = useRef<HTMLDivElement>(null)
  const editor = useRef<monaco.editor.IStandaloneCodeEditor | null>(null)

  useEffect(() => {
    const models = Object.entries(starterFiles).map(([name, code]) =>
      monaco.editor.createModel(code, languageFor(name), monaco.Uri.file(name)),
    )
    const instance = monaco.editor.create(host.current!, {
      theme: 'forge', automaticLayout: true, minimap: { enabled: false },
      model: null, ariaLabel: 'Code editor',
    })
    editor.current = instance
    const subscription = instance.onDidChangeModelContent(() => {
      const model = instance.getModel()
      if (model) setFiles((current) => ({ ...current, [model.uri.path]: model.getValue() }))
    })
    return () => {
      subscription.dispose()
      instance.dispose()
      models.forEach((model) => model.dispose())
    }
  }, [])

  useEffect(() => {
    editor.current?.setModel(monaco.editor.getModel(monaco.Uri.file(path)))
  }, [path])

  return (
    <main className="experiment">
      <section>
        <h1>Forge Studio / Runtime experiment</h1>
        <div>{Object.keys(files).map((name) => (
          <button key={name} aria-pressed={path === name} onClick={() => setPath(name)}>{name}</button>
        ))}</div>
        <div className="editor" ref={host} />
      </section>
      <PreviewPane files={files} />
    </main>
  )
}
