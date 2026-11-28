import { expect, type Page } from '@playwright/test'

export async function writeEditor(page: Page, code: string) {
  const input = page.getByRole('textbox', { name: 'Code editor', exact: true })
  await expect(input).toHaveCount(1)
  await input.focus()
  await page.keyboard.press('ControlOrMeta+A')
  await page.keyboard.insertText(code)
}
