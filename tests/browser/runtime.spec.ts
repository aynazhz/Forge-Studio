import { expect, test } from '@playwright/test'
import { performance } from 'node:perf_hooks'
import { starterFiles } from '../../src/features/project/template'
import { writeEditor } from './editor'

test('Monaco drives real React, a second module and recovery', async ({ page }) => {
  const start = performance.now()
  await page.goto('/')
  const preview = page.frameLocator('iframe[title="React preview"]')
  await expect(preview.getByRole('heading', { name: 'Make it yours.' })).toBeVisible()
  console.log(`first heading from navigation: ${Math.round(performance.now() - start)} ms`)
  await preview.getByRole('button', { name: 'Increment' }).click()
  await expect(preview.getByRole('status', { name: 'Count' })).toHaveText('1')

  const changed = starterFiles['/src/App.tsx'].replace('Make it yours.', 'Edited in Monaco')
  const editStart = performance.now()
  await writeEditor(page, changed)
  await expect(preview.getByRole('heading', { name: 'Edited in Monaco' })).toBeVisible()
  console.log(`heading update including editor input: ${Math.round(performance.now() - editStart)} ms`)

  await page.getByRole('button', { name: '/src/caption.ts', exact: true }).click()
  await writeEditor(page, "export const caption = 'Updated second module'")
  await expect(preview.getByText('Updated second module')).toBeVisible()

  await writeEditor(page, 'export const caption = @')
  await expect(page.getByRole('region', { name: 'Preview' }).getByRole('alert')).toContainText(/caption|Unexpected|Syntax/i)
  await writeEditor(page, "export const caption = 'Recovered in Chromium'")
  await expect(preview.getByText('Recovered in Chromium')).toBeVisible()
  await expect(page.getByRole('region', { name: 'Preview' }).getByRole('alert')).toHaveCount(0)
})
