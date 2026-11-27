import { SandpackRuntime } from '@codesandbox/sandpack-client/clients/runtime'
import { useEffect, useRef, useState } from 'react'
import { sandboxSetup } from '../runtime/sandpack'

type PreviewState = { status: 'Loading' | 'Building' | 'Running' | 'Error'; error?: string }

export function PreviewPane({ files }: { files: Record<string, string> }) {
  const iframe = useRef<HTMLIFrameElement>(null)
  const runtime = useRef<SandpackRuntime | null>(null)
  const [attempt, setAttempt] = useState(0)
  const [state, setState] = useState<PreviewState>({ status: 'Loading' })

  useEffect(() => {
    const frame = iframe.current!
    let timeout: number
    function begin(status: 'Loading' | 'Building') {
      clearTimeout(timeout)
      setState({ status })
      timeout = window.setTimeout(() => {
        setState({ status: 'Error', error: 'Preview did not respond. Check the network and reload the preview.' })
      }, 20_000)
    }

    begin('Loading')
    const client = new SandpackRuntime(frame, sandboxSetup({}), {
      showOpenInCodeSandbox: false, showErrorScreen: false,
    })
    runtime.current = client
    const unsubscribe = client.listen((message) => {
      if (message.type === 'start') begin('Building')
      if (message.type === 'action' && (message.action === 'show-error' || message.action === 'notification')) {
        clearTimeout(timeout)
        const error = message.action === 'show-error'
          ? [message.path, message.message].filter(Boolean).join('\n')
          : message.title
        setState({ status: 'Error', error })
      }
      if (message.type === 'done') {
        clearTimeout(timeout)
        setState((current) => message.compilatonError
          ? { status: 'Error', error: current.error ?? 'The project could not compile.' }
          : current.status === 'Error' ? current : { status: 'Running' })
      }
    })
    return () => {
      clearTimeout(timeout)
      unsubscribe()
      client.destroy()
      runtime.current = null
    }
  }, [attempt])

  useEffect(() => {
    runtime.current?.updateSandbox(sandboxSetup(files))
  }, [files, attempt])

  return (
    <section className="preview" aria-label="Preview">
      <header className="preview-header">
        <strong>Preview</strong>
        <span className="runtime-status" data-state={state.status} role="status">{state.status}</span>
        <button onClick={() => setAttempt((value) => value + 1)}>Reload preview</button>
      </header>
      <div className="preview-content">
        <iframe className="preview-frame" key={attempt} ref={iframe} title="React preview" sandbox="allow-scripts allow-same-origin" referrerPolicy="no-referrer" />
        {state.error && <pre className="preview-error" role="alert">{state.error}</pre>}
      </div>
    </section>
  )
}
