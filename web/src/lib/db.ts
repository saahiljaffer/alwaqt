import Database from 'better-sqlite3'
import fs from 'fs'
import path from 'path'

// Resolve DB path: same dir as project (web/), or web/prayertimes.db when run from repo root
const cwdPath = path.resolve(process.cwd(), 'prayertimes.db')
const webPath = path.resolve(process.cwd(), 'web', 'prayertimes.db')
const dbPath = fs.existsSync(cwdPath)
  ? cwdPath
  : fs.existsSync(webPath)
  ? webPath
  : cwdPath

const db = new Database(dbPath)

export default db
