const fs   = require('fs')
const path = require('path')

const COMPONENTS_DIR = path.join(__dirname, '..', 'apps', 'web', 'src', 'components')

function getAllTsxFiles(dir) {
  const results = []
  fs.readdirSync(dir).forEach(file => {
    const full = path.join(dir, file)
    if (fs.statSync(full).isDirectory()) {
      results.push(...getAllTsxFiles(full))
    } else if (file.endsWith('.tsx') && !file.includes('.test.')) {
      results.push(full)
    }
  })
  return results
}

function addCssImport(filePath) {
  const fileName    = path.basename(filePath, '.tsx')
  const cssFileName = `${fileName}.module.css`
  const cssFullPath = path.join(path.dirname(filePath), cssFileName)

  if (!fs.existsSync(cssFullPath)) {
    console.log(`⚠️  Sin CSS: ${cssFileName}`)
    return
  }

  let content = fs.readFileSync(filePath, 'utf-8')

  if (content.includes(`from './${cssFileName}'`)) {
    console.log(`✅ Ya tiene import: ${fileName}.tsx`)
    return
  }

  const importLine  = `import styles from './${cssFileName}'`
  const lines       = content.split('\n')
  let lastImportIdx = -1

  lines.forEach((line, i) => {
    if (line.startsWith('import ')) lastImportIdx = i
  })

  if (lastImportIdx === -1) {
    lines.unshift(importLine)
  } else {
    lines.splice(lastImportIdx + 1, 0, importLine)
  }

  fs.writeFileSync(filePath, lines.join('\n'), 'utf-8')
  console.log(`➕ Import agregado: ${fileName}.tsx`)
}

const files = getAllTsxFiles(COMPONENTS_DIR)
console.log(`\n🔍 Encontrados ${files.length} componentes\n`)
files.forEach(addCssImport)
console.log('\n✅ Listo\n')