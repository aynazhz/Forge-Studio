import { X } from 'lucide-react'
import type { filePaths } from '../project/tree'
import type { Project } from '../project/project'
import { FileMark } from './Explorer'

export function TabBar({ project, files, onOpen, onClose }: {
  project: Project
  files: ReturnType<typeof filePaths>
  onOpen: (id: string) => void
  onClose: (id: string) => void
}) {
  return (
    <nav className="tabs" aria-label="Open files">
      {project.tabs.map((id) => {
        const file = files.find(({ entry }) => entry.id === id)
        if (!file) return null
        const active = project.activeFileId === id
        return (
          <div className="tab" data-active={active} key={id}>
            <button aria-current={active ? 'true' : undefined} title={file.path} onClick={() => onOpen(id)}>
              <FileMark name={file.entry.name} /> <span>{file.entry.name}</span>
            </button>
            <button className="icon-button close-tab" aria-label={`Close ${file.path}`} onClick={() => onClose(id)}><X size={14} /></button>
          </div>
        )
      })}
    </nav>
  )
}
