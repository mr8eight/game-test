import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'

const rootDir = process.cwd()
const distDir = path.join(rootDir, 'dist')
const outputDir = path.join(rootDir, 'dist-standalone')
const inputHtmlPath = path.join(distDir, 'index.html')
const outputHtmlPath = path.join(outputDir, 'game-standalone.html')

const readAsset = async (assetPath) => {
  const normalizedPath = assetPath.replace(/^\//, '')
  return readFile(path.join(distDir, normalizedPath), 'utf8')
}

const inlineAssets = async () => {
  let html = await readFile(inputHtmlPath, 'utf8')

  html = html.replace(/<link rel="modulepreload"[^>]*>/g, '')

  const stylesheetMatches = [...html.matchAll(/<link rel="stylesheet"[^>]*href="([^"]+)"[^>]*>/g)]
  for (const match of stylesheetMatches) {
    const [fullMatch, href] = match
    const css = await readAsset(href)
    html = html.replace(fullMatch, `<style>\n${css}\n</style>`)
  }

  const scriptMatches = [...html.matchAll(/<script type="module"[^>]*src="([^"]+)"[^>]*><\/script>/g)]
  for (const match of scriptMatches) {
    const [fullMatch, src] = match
    const js = await readAsset(src)
    html = html.replace(fullMatch, `<script type="module">\n${js}\n</script>`)
  }

  await mkdir(outputDir, { recursive: true })
  await writeFile(outputHtmlPath, html, 'utf8')

  console.log(`Standalone HTML written to ${outputHtmlPath}`)
}

inlineAssets().catch((error) => {
  console.error(error)
  process.exit(1)
})
