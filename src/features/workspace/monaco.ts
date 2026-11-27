import * as monaco from 'monaco-editor'
import EditorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'
import TypeScriptWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker'
import CssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker'
import HtmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker'
import JsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker'

self.MonacoEnvironment = {
  getWorker(_moduleId, label) {
    if (label === 'typescript' || label === 'javascript') return new TypeScriptWorker()
    if (label === 'css') return new CssWorker()
    if (label === 'html') return new HtmlWorker()
    if (label === 'json') return new JsonWorker()
    return new EditorWorker()
  },
}

const compilerOptions = {
  jsx: monaco.languages.typescript.JsxEmit.React,
  target: monaco.languages.typescript.ScriptTarget.ESNext,
  moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
  allowNonTsExtensions: true,
}
monaco.languages.typescript.typescriptDefaults.setCompilerOptions(compilerOptions)
monaco.languages.typescript.javascriptDefaults.setCompilerOptions({ ...compilerOptions, allowJs: true })
monaco.languages.typescript.typescriptDefaults.setEagerModelSync(true)

monaco.editor.defineTheme('forge', {
  base: 'vs-dark',
  inherit: true,
  rules: [
    { token: 'keyword', foreground: 'C9A8F0' },
    { token: 'string', foreground: 'B0D994' },
    { token: 'number', foreground: 'E4B88F' },
  ],
  colors: {
    'editor.background': '#14191b',
    'editor.foreground': '#dce5e2',
    'editorLineNumber.foreground': '#83938e',
    'editorLineNumber.activeForeground': '#cbd9d3',
    'editor.lineHighlightBackground': '#1b2325',
    'editor.selectionBackground': '#304c41',
    'editorCursor.foreground': '#a7eac3',
  },
})

export function languageFor(path: string) {
  switch (path.split('.').pop()?.toLowerCase()) {
    case 'ts':
    case 'tsx': return 'typescript'
    case 'js':
    case 'jsx': return 'javascript'
    case 'css': return 'css'
    case 'html': return 'html'
    case 'json': return 'json'
    case 'md': return 'markdown'
    default: return 'plaintext'
  }
}

export { monaco }
