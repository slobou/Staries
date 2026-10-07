#!/usr/bin/env node
// Splits the working tree into the work packages defined in docs/work-packages.json
// so that several contributors can commit their own part.
//
//   npm run handoff -- list                 Show packages and file counts
//   npm run handoff -- verify               Every changed file belongs to exactly one package
//   npm run handoff -- export [id|all]      Copy package files to ./handoff/<id>-<slug>/ (+ .zip)
//   npm run handoff -- people               One zip per person with GitHub Desktop instructions
//   npm run handoff -- check                Apply packages in order on top of HEAD and typecheck each step
//   npm run handoff -- docs                 Regenerate docs/WORK_PACKAGES.md

import { execFileSync, spawnSync } from 'node:child_process'
import {
  cpSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
  statSync,
  symlinkSync,
  writeFileSync,
} from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const MANIFEST = path.join(ROOT, 'docs', 'work-packages.json')
const OUT_DIR = path.join(ROOT, 'handoff')

const { packages, lead } = JSON.parse(readFileSync(MANIFEST, 'utf8'))

const git = (...args) =>
  execFileSync('git', args, { cwd: ROOT, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 })

function walk(rel, base = ROOT) {
  const abs = path.join(base, rel)
  if (!existsSync(abs)) return []
  if (statSync(abs).isFile()) return [rel]
  return readdirSync(abs, { withFileTypes: true })
    .filter((e) => e.name !== '.DS_Store')
    .flatMap((e) => walk(path.posix.join(rel.split(path.sep).join('/'), e.name), base))
}

/** Folder the package files are read from (the repo itself, or e.g. ./contrib). */
const sourceBase = (pkg) => (pkg.sourceRoot ? path.join(ROOT, pkg.sourceRoot) : ROOT)

const expand = (pkg) => [...new Set(pkg.files.flatMap((f) => walk(f, sourceBase(pkg))))].sort()

function changedFiles() {
  // -z: NUL separated, no quoting; -uall: list files inside untracked dirs.
  const raw = git('status', '--porcelain', '-z', '-uall')
  const out = []
  const parts = raw.split('\0').filter(Boolean)
  for (let i = 0; i < parts.length; i++) {
    const status = parts[i].slice(0, 2)
    out.push(parts[i].slice(3))
    if (status.includes('R') || status.includes('C')) i++ // skip origin path
  }
  return out.filter((f) => !f.startsWith('handoff/') && !f.endsWith('.DS_Store'))
}

function owners() {
  const map = new Map()
  for (const pkg of packages) {
    for (const file of expand(pkg)) {
      map.set(file, [...(map.get(file) ?? []), pkg.id])
    }
  }
  return map
}

function findPackage(id) {
  const pkg = packages.find((p) => p.id === id || p.slug === id)
  if (!pkg) {
    console.error(`Unknown package "${id}". Run: npm run handoff -- list`)
    process.exit(1)
  }
  return pkg
}

function cmdList() {
  for (const pkg of packages) {
    const deps = pkg.dependsOn.length ? ` (needs ${pkg.dependsOn.join(', ')})` : ''
    console.log(`WP-${pkg.id}  ${pkg.title}  [${expand(pkg).length} files]${deps}`)
  }
}

function cmdVerify() {
  const map = owners()
  const changed = changedFiles()
  const orphans = changed.filter((f) => !map.has(f))
  const alreadyInTree = [...new Set(packages.filter((p) => p.sourceRoot).flatMap((p) => expand(p)))].filter((f) =>
    existsSync(path.join(ROOT, f)),
  )
  const duplicates = [...map].filter(([, ids]) => ids.length > 1)
  const extras = new Set(packages.filter((p) => p.sourceRoot).flatMap((p) => expand(p)))
  const missing = [...map.keys()].filter((f) => !changed.includes(f) && !extras.has(f))

  let ok = true
  if (orphans.length) {
    ok = false
    console.error('\nChanged files that belong to no package:')
    orphans.forEach((f) => console.error(`  ${f}`))
  }
  if (alreadyInTree.length) {
    ok = false
    console.error('\nExtra files that also exist in the working tree (they would end up in the lead commit):')
    alreadyInTree.forEach((f) => console.error(`  ${f}`))
  }
  if (duplicates.length) {
    ok = false
    console.error('\nFiles claimed by more than one package:')
    duplicates.forEach(([f, ids]) => console.error(`  ${f} -> ${ids.join(', ')}`))
  }
  if (missing.length) {
    console.warn('\nNote: files in a package that are not modified (already committed?):')
    missing.forEach((f) => console.warn(`  ${f}`))
  }
  if (ok) {
    console.log(`OK: ${changed.length} changed files, all assigned to exactly one package.`)
  } else {
    process.exit(1)
  }
}

function commitMessage(pkg) {
  return `${pkg.commit.subject}\n\n${pkg.commit.body}\n`
}

/** Text for GitHub Desktop, which has separate "Summary" and "Description" boxes. */
function desktopCommitText(pkg) {
  return `Copy each part into GitHub Desktop, bottom-left, before pressing "Commit".

SUMMARY (the short box):
${pkg.commit.subject}

DESCRIPTION (the big box):
${pkg.commit.body}
`
}

const personSlug = (person) => person.toLowerCase().replace(/\s+/g, '-')

function originUrl() {
  try {
    return git('remote', 'get-url', 'origin').trim().replace(/\.git$/, '')
  } catch {
    return '(ask the project lead for the repository link)'
  }
}

/** Plain-language steps for GitHub Desktop. No terminal needed. */
function desktopSteps(branch, packages_, filesByPkg) {
  const hasHidden = (files) => files.some((f) => path.posix.basename(f).startsWith('.'))
  const sections = packages_
    .map((pkg, i) => {
      const files = filesByPkg.get(pkg.id)
      return `### Package ${i + 1} of ${packages_.length}: WP-${pkg.id} — ${pkg.title}

Folder: \`${pkg.id}-${pkg.slug}\` (inside this download). Expected number of files: **${files.length}**.

1. In GitHub Desktop open the menu **Repository → Show in Finder** (Mac) or **Show in Explorer** (Windows). Your project folder opens.
2. Open the \`files\` folder of this package. Select **everything inside it** and copy it into your project folder, **merging** the folders:
   - **Windows:** drag or copy/paste. If it asks about existing folders it merges them; answer **Replace** only for individual *files*.
   - **Mac:** hold the **Option (⌥)** key while dragging, and choose **Merge**. Do **not** copy/paste folders with ⌘C/⌘V and never choose **Replace** on a folder, that would delete other people's files.${
     hasHidden(files)
       ? '\n   - This package contains hidden files that start with a dot (such as `.gitignore`). On Mac press **⌘ Shift .** in Finder to show them; on Windows enable "Hidden items" in the View menu.'
       : ''
   }
3. Go back to GitHub Desktop, tab **Changes**. Check:
   - It lists about **${files.length}** files. Compare with \`FILES.txt\` if you want.
   - Files with a green **+** are new; a few may show as modified. That is fine.
   - There must be **no red − (deleted) files**. If there are, right-click the list → **Discard all changes** and repeat step 2 more carefully.
4. Bottom-left, fill the **Summary** and **Description** boxes with the text from \`${pkg.id}-${pkg.slug}/COMMIT MESSAGE.txt\`, then press the blue **Commit to ${branch}** button.
`
    })
    .join('\n')

  return `## One-time setup

1. Install **GitHub Desktop** and sign in with your GitHub account.
2. **File → Clone repository** and pick the project: ${originUrl()} (if you cannot find it, ask the project lead).
3. Make sure the current branch (top bar) is **develop**, then press **Fetch origin** / **Pull origin** so you have the latest. You work directly on \`develop\`; no new branch is needed.

## Your commits

${sections}
## When all your commits are done

1. Press **Push origin** at the top.
2. If GitHub Desktop says it needs to **Pull origin** first (because someone else pushed before you), press **Pull origin**, then **Push origin** again. This is normal and safe, because everyone adds different files.
3. Tell the project lead you are done.

If something looks wrong, **do not push**. Message the project lead instead; nothing is shared until you press Push origin.
`
}

function packageReadme(pkg, files) {
  const dirs = [...new Set(files.map((f) => path.posix.dirname(f)))]
  const deps = pkg.dependsOn.length
    ? `Merge these first: ${pkg.dependsOn.map((d) => `WP-${d}`).join(', ')}.`
    : 'No dependencies. You can commit this at any time.'
  return `# WP-${pkg.id} — ${pkg.title}

${pkg.summary}

${deps}

Files in this package (${files.length}):

${files.map((f) => `- \`${f}\``).join('\n')}

Folders touched: ${dirs.map((d) => `\`${d}\``).join(', ')}

Command line users: copy \`files/\` into the repo root, run
\`xargs git --literal-pathspecs add -- < FILES.txt\` and \`git commit -F COMMIT.txt\`.
`
}

function writePackage(pkg, files, dir) {
  rmSync(dir, { recursive: true, force: true })
  for (const file of files) {
    const dest = path.join(dir, 'files', file)
    mkdirSync(path.dirname(dest), { recursive: true })
    cpSync(path.join(sourceBase(pkg), file), dest)
  }
  writeFileSync(path.join(dir, 'FILES.txt'), files.join('\n') + '\n')
  writeFileSync(path.join(dir, 'COMMIT.txt'), commitMessage(pkg))
  writeFileSync(path.join(dir, 'COMMIT MESSAGE.txt'), desktopCommitText(pkg))
  writeFileSync(path.join(dir, 'README.md'), packageReadme(pkg, files))
}

function cmdExport(target = 'all') {
  const selected = target === 'all' ? packages : [findPackage(target)]
  mkdirSync(OUT_DIR, { recursive: true })
  for (const pkg of selected) {
    const files = expand(pkg)
    if (!files.length) {
      console.warn(`WP-${pkg.id}: no files found, skipping`)
      continue
    }
    const name = `${pkg.id}-${pkg.slug}`
    writePackage(pkg, files, path.join(OUT_DIR, name))

    const zip = path.join(OUT_DIR, `${name}.zip`)
    rmSync(zip, { force: true })
    const zipped = spawnSync('zip', ['-qr', zip, name], { cwd: OUT_DIR })
    console.log(
      `WP-${pkg.id}  ${files.length} files -> handoff/${name}${zipped.status === 0 ? ' (+ .zip)' : ''}`,
    )
  }
}

function leadGuide(person, mine) {
  const others = packages.filter((p) => p.owner && p.owner !== person)
  return `# ${person} (project lead) — START HERE

You commit **all the logic and the base app**, straight from the folder you already have. Nobody else touches logic. The other people only add one small page each, after your base is merged.

## 1. Commit the base (about 10 minutes)

1. Open this repository in **GitHub Desktop**. The **Changes** tab already lists every new and modified file.
2. Stay on the **develop** branch (top bar). You are the only one adding the base, so no extra branch is needed.
3. Check the list: it should contain the app, \`lib\`, \`hooks\`, \`store\`, \`docs\`, \`scripts\`, etc. It must **not** contain \`handoff\` or \`contrib\` (they are git-ignored). The \`node_modules\` and \`.env.local\` files must not appear either.
4. Make the commit. **Simplest:** one commit with everything.
   - Summary: \`Add Staries on Stellar: authorship registry, certificates and licenses\`
   - Description: \`Authorship proofs anchored on Stellar, public certificates and verification, direct license payments, author studio, catalog and reader, brand and docs.\`
   - Press **Commit to develop**.

   *Optional, nicer history:* make several commits by unticking files and committing groups one at a time (see "File groups" below). Order does not matter because they all end up in your branch.
5. Press **Push origin**. Now \`develop\` on GitHub has the full base.
6. Tell the others it is their turn and send each their zip from \`handoff/people/\`.

## 2. Collect the small contributions

${others.map((p) => `- **${p.owner}** — WP-${p.id}: ${p.title} (adds ${expand(p).map((f) => `\`${f}\``).join(', ')})`).join('\n')}

Each one adds new files only, so their commits cannot conflict with each other. They push straight to \`develop\`; check each one when it lands.

## 3. Final check

After everything is merged, open the repo, **Pull origin**, and run:

\`\`\`bash
npm install
npm run build
\`\`\`

Then walk through \`docs/DEMO.md\`.

When develop looks good, release it to **main**: in GitHub Desktop switch to \`main\`, **Branch → Merge into current branch…**, pick \`develop\`, then **Push origin**. (Or open a pull request develop → main on GitHub.)

## File groups (optional, for several commits)

${mine
  .map(
    (p) => `### WP-${p.id} — ${p.title}

Suggested message: \`${p.commit.subject}\`

${expand(p)
  .map((f) => `- \`${f}\``)
  .join('\n')}
`,
  )
  .join('\n')}`
}

/** Lead gets a guide for their own working tree; everyone else gets a zip with GitHub Desktop steps. */
function cmdPeople() {
  const people = [...new Set(packages.map((p) => p.owner).filter(Boolean))]
  if (!people.length) {
    console.error('No "owner" set in docs/work-packages.json')
    process.exit(1)
  }
  const base = path.join(OUT_DIR, 'people')
  rmSync(base, { recursive: true, force: true })
  mkdirSync(base, { recursive: true })

  for (const person of people) {
    const mine = packages.filter((p) => p.owner === person)
    const slug = personSlug(person)

    if (person === lead) {
      writeFileSync(path.join(base, `${slug}-LEAD-GUIDE.md`), leadGuide(person, mine))
      console.log(`${person} (lead): ${mine.length} packages -> handoff/people/${slug}-LEAD-GUIDE.md (no zip, commit from your own folder)`)
      continue
    }

    const dir = path.join(base, slug)
    const filesByPkg = new Map(mine.map((p) => [p.id, expand(p)]))
    for (const pkg of mine) {
      writePackage(pkg, filesByPkg.get(pkg.id), path.join(dir, `${pkg.id}-${pkg.slug}`))
    }
    const intro = `# ${person} — START HERE

Your contribution is small and safe: you add ${mine.length === 1 ? 'one new page' : `${mine.length} new pages`} to the Staries website, with your own GitHub account so the work is credited to you.

${mine.map((p) => `- **WP-${p.id}** ${p.title}`).join('\n')}

You do not need to write code or use the terminal. Everything is done in **GitHub Desktop**.

> **Wait for the project lead to say "the base is merged"** before you start. If you start earlier, your page will not have the pieces it needs.

`
    writeFileSync(path.join(dir, 'START HERE.md'), intro + desktopSteps('develop', mine, filesByPkg))
    const zip = path.join(base, `${slug}.zip`)
    spawnSync('zip', ['-qr', zip, slug], { cwd: base })
    console.log(`${person}: ${mine.map((p) => `WP-${p.id}`).join(', ')} -> handoff/people/${slug}.zip`)
  }
}

function run(cmd, args, cwd) {
  const r = spawnSync(cmd, args, { cwd, encoding: 'utf8', env: { ...process.env, CI: '1' } })
  return { ok: r.status === 0, out: `${r.stdout ?? ''}${r.stderr ?? ''}` }
}

function cmdCheck() {
  const tmp = mkdtempSync(path.join(tmpdir(), 'staries-check-'))
  console.log(`Replaying packages on top of HEAD in ${tmp}`)
  try {
    // Baseline = what is committed today.
    const archive = spawnSync('sh', ['-c', `git archive HEAD | tar -x -C "${tmp}"`], { cwd: ROOT })
    if (archive.status !== 0) throw new Error('git archive failed')
    symlinkSync(path.join(ROOT, 'node_modules'), path.join(tmp, 'node_modules'), 'dir')

    let failed = false
    for (const pkg of packages) {
      for (const file of expand(pkg)) {
        const dest = path.join(tmp, file)
        mkdirSync(path.dirname(dest), { recursive: true })
        cpSync(path.join(sourceBase(pkg), file), dest)
      }
      run('npx', ['next', 'typegen'], tmp)
      const result = run('npx', ['tsc', '--noEmit'], tmp)
      console.log(`${result.ok ? 'PASS' : 'FAIL'}  after WP-${pkg.id} ${pkg.slug}`)
      if (!result.ok) {
        failed = true
        console.log(result.out.split('\n').slice(0, 15).join('\n'))
      }
    }
    if (failed) {
      console.log('\nSome intermediate states do not typecheck. Merge in dependency order.')
      process.exitCode = 1
    } else {
      console.log('\nEvery step typechecks when applied in order.')
    }
  } finally {
    rmSync(tmp, { recursive: true, force: true })
  }
}

function waveOf(pkg) {
  if (!pkg.dependsOn.length) return 1
  return 1 + Math.max(...pkg.dependsOn.map((d) => waveOf(findPackage(d))))
}

function cmdDocs() {
  const lines = [
    '# Work packages',
    '',
    '> Generated from `docs/work-packages.json` by `npm run handoff -- docs`. Do not edit by hand.',
    '',
    'Two kinds of packages, to keep commits simple and safe:',
    '',
    `- **${lead}** (the lead) commits **all the logic and the base app** (WP-01 to WP-12) straight from the working folder. Nothing risky is delegated.`,
    '- **Everyone else** adds **one small, self-contained page** (WP-13 to WP-18). Each package is one or two **new** files that no one else touches, so commits cannot conflict and nobody needs to write code.',
    '',
    '## How to use',
    '',
    '```bash',
    'npm run handoff -- verify        # every changed file belongs to exactly one package',
    'npm run handoff -- people        # writes ./handoff/people/*',
    '```',
    '',
    `- \`handoff/people/${personSlug(lead)}-LEAD-GUIDE.md\`: the lead's checklist (commit the base, merge it first, then collect the rest).`,
    '- `handoff/people/person-N.zip` for everyone else: a `START HERE.md` with step-by-step **GitHub Desktop** instructions (no terminal) and the new file(s) with their commit message. `./handoff` and `./contrib` are git-ignored.',
    '',
    'Other commands: `export all` (one zip per package), `list`, `check` (replays all packages in order and typechecks each step), `docs` (regenerates this file).',
    '',
    '**Order:** the lead merges the base first. After that the small page packages can be merged in any order.',
    '',
    '## Overview',
    '',
    'Merge **wave** = the earliest round in which a package can be merged (everything it depends on is in an earlier wave). Packages in the same wave can be merged in any order.',
    '',
    '| WP | Package | Wave | Depends on | Files | Assignee |',
    '| --- | --- | --- | --- | --- | --- |',
    ...packages.map(
      (p) =>
        `| ${p.id} | ${p.title} | ${waveOf(p)} | ${p.dependsOn.length ? p.dependsOn.map((d) => `WP-${d}`).join(', ') : '—'} | ${expand(p).length} | ${p.owner ?? '_unassigned_'} |`,
    ),
    '',
    '## By person',
    '',
    ...[...new Set(packages.map((p) => p.owner).filter(Boolean))].map(
      (o) =>
        `- **${o}**: ${packages
          .filter((p) => p.owner === o)
          .map((p) => `WP-${p.id} ${p.slug}`)
          .join(', ')}`,
    ),
    '',
  ]
  for (const pkg of packages) {
    const files = expand(pkg)
    lines.push(
      `## WP-${pkg.id} — ${pkg.title}`,
      '',
      pkg.summary,
      '',
      `Depends on: ${pkg.dependsOn.length ? pkg.dependsOn.map((d) => `WP-${d}`).join(', ') : 'nothing'}`,
      '',
      'Suggested commit message:',
      '',
      '```text',
      commitMessage(pkg).trimEnd(),
      '```',
      '',
      'Files:',
      '',
      ...files.map((f) => `- \`${f}\``),
      '',
    )
  }
  writeFileSync(path.join(ROOT, 'docs', 'WORK_PACKAGES.md'), lines.join('\n'))
  console.log('Wrote docs/WORK_PACKAGES.md')
}

const [command = 'list', arg] = process.argv.slice(2)
const commands = {
  list: cmdList,
  verify: cmdVerify,
  export: () => cmdExport(arg),
  people: cmdPeople,
  check: cmdCheck,
  docs: cmdDocs,
}
if (!commands[command]) {
  console.error(`Unknown command "${command}". Use: ${Object.keys(commands).join(' | ')}`)
  process.exit(1)
}
commands[command]()
