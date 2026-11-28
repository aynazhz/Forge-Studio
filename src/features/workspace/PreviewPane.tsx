import { SandpackRuntime } from '@codesandbox/sandpack-client/clients/runtime'
import { Monitor, RotateCw } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { sandboxSetup } from '../runtime/sandpack'

type PreviewState = { status: 'Loading' | 'Building' | 'Running' | 'Error'; error?: string }
type PreviewSession = { files: Record<string, string>; update: (files: Record<string, string>) => void }

export function PreviewPane({ files }: { files: Record<string, string> }) {
  const iframe = useRef<HTMLIFrameElement>(null)
  const latest = useRef(files)
  const session = useRef<PreviewSession | null>(null)
  const [attempt, setAttempt] = useState(0)
  const [state, setState] = useState<PreviewState>({ status: 'Loading' })

  useEffect(() => { latest.current = files }, [files])

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
    const client = new SandpackRuntime(frame, sandboxSetup(latest.current), {
      showOpenInCodeSandbox: false, showErrorScreen: false,
    })
    const currentSession: PreviewSession = {
      files: latest.current,
      update(next) {
        this.files = next
        begin('Building')
        client.updateSandbox(sandboxSetup(next))
      },
    }
    session.current = currentSession
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
      session.current = null
    }
  }, [attempt])

  useEffect(() => {
    const current = session.current
    if (!current || current.files === files) return
    const timer = window.setTimeout(() => current.update(files), 220)
    return () => clearTimeout(timer)
  }, [files, attempt])

  return (
    <section className="preview" aria-label="Preview">
      <header className="preview-header">
        <h2><Monitor size={15} /> Preview</h2>
        <span className="runtime-status" data-state={state.status} role="status">{state.status}</span>
        <button className="icon-button" title="Reload preview" aria-label="Reload preview" onClick={() => setAttempt((value) => value + 1)}><RotateCw size={15} /></button>
      </header>
      <div className="preview-content">
        <iframe className="preview-frame" key={attempt} ref={iframe} title="React preview" sandbox="allow-scripts allow-same-origin" referrerPolicy="no-referrer" />
        {state.error && <pre className="preview-error" role="alert">{state.error}</pre>}
      </div>
    </section>
  )
}
