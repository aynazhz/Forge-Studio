import type { SandboxSetup } from '@codesandbox/sandpack-client'

export function sandboxSetup(files: Record<string, string>): SandboxSetup {
  return {
    template: 'create-react-app-typescript',
    files: Object.fromEntries(
      Object.entries(files).map(([path, code]) => [path, { code }]),
    ),
  }
}
