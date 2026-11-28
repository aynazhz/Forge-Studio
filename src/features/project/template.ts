export const starterFiles = {
  '/package.json': JSON.stringify({
    name: 'react-workbench',
    private: true,
    main: '/index.tsx',
    dependencies: { react: '18.3.1', 'react-dom': '18.3.1' },
  }, null, 2),
  '/index.html': '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body><div id="root"></div></body></html>',
  '/index.tsx': `import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './src/App'
import './src/styles.css'

createRoot(document.getElementById('root')!).render(<App />)
`,
  '/src/App.tsx': `import React, { useState } from 'react'
import { caption } from './caption'

export default function App() {
  const [count, setCount] = useState(0)

  return (
    <main className="demo">
      <p className="demo-label">REACT WORKBENCH</p>
      <h1>Make it yours.</h1>
      <p className="demo-caption">{caption}</p>

      <div className="counter">
        <output aria-label="Count">{count}</output>
        <button onClick={() => setCount(count + 1)}>
          Increment
        </button>
      </div>
    </main>
  )
}
`,
  '/src/caption.ts': "export const caption = 'Edit App.tsx to see your changes here.'\n",
  '/src/styles.css': `* { box-sizing: border-box; }
body {
  margin: 0;
  min-width: 200px;
  color: #17231c;
  background: #f1f4ec;
  font-family: system-ui, sans-serif;
}
.demo {
  max-width: 520px;
  min-height: 100vh;
  margin: auto;
  padding: clamp(32px, 10vw, 68px) clamp(22px, 8vw, 54px);
  background-image: radial-gradient(#d7e0d4 1px, transparent 1px);
  background-size: 19px 19px;
}
.demo-label {
  color: #38614c;
  font: 700 11px ui-monospace, monospace;
  letter-spacing: .17em;
}
h1 {
  margin: 17px 0 10px;
  font: 500 clamp(38px, 10vw, 69px)/.98 Georgia, serif;
  letter-spacing: -.055em;
}
.demo-caption { color: #43564a; font-size: 14px; line-height: 1.6; }
.counter {
  margin-top: 34px;
  padding: 16px;
  border: 1px solid #ced8cd;
  border-radius: 10px;
  background: #f9fbf6;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  gap: 14px;
}
output { font: 600 32px ui-monospace, monospace; }
button {
  background: #194a34;
  color: white;
  border: 0;
  border-radius: 6px;
  padding: 10px 14px;
  font: inherit;
  cursor: pointer;
}
button:focus-visible { outline: 2px solid #194a34; outline-offset: 3px; }
`,
}
