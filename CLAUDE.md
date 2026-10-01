# Household Budget & Chores

Simple, non-gamey app for two people (J and P): big-expense tracking, settle-up, monthly category plan, bills, and recurring chores. Live sync between both phones.

## Working style
Jakem prefers guided, step-by-step help with confirmation between steps, not a big pre-built dump. Do one step, confirm, then continue.

## Stack
- Single-file web app: `public/index.html` (vanilla JS, ES modules, Firebase v10.14.1 via gstatic CDN, no build step)
- Firebase project `homebudget-56acc` (Hosting + Firestore in australia-southeast1 + Email/Password Auth)
- Two users already created in Firebase Auth (J and P)
- Config is in `index.html` (web API keys are not secrets; Firestore rules are the protection)

## Layout
```
household-budget/
  CLAUDE.md
  firebase.json        (hosting -> public/)
  .firebaserc          (default project homebudget-56acc)
  public/index.html
```

## Firestore model (current)
`/expenses/{id}`: amountCents (int), description, category, paidBy ("J"|"P"), split ("half"|"custom"|"mine"), otherShareCents, date ("YYYY-MM-DD"), recurring (bool), isBig (amountCents >= 20000), source ("manual"), createdBy (uid), createdAt (serverTimestamp)

Settle-up is derived client-side: sum of what the non-payer owes the payer, netted per person.

Planned: `/chores`, `/bills`, `/budgets/{YYYY-MM}`, `/settlements`.

## Decisions
- Manual entry only. Westpac (retail) exports PDF only, so no CSV import. CDR/Basiq ruled out as too heavy.
- Focus is big expenses and planning, not everyday spending. "Big" = $200+, configurable later.
- Design reference: teal #1F5F5B, IBM Plex Sans/Mono, light neutral background.

## Next steps (in order)
1. Init git, create GitHub repo, push, confirm `firebase deploy --only hosting` works.
2. Replace Firestore test-mode rules (expire ~30 days after creation) with rules allowing only the two signed-in uids. Add `firestore.rules` to the repo.
3. Add `firestore.indexes.json` for the `expenses` query (`date` desc, `createdAt` desc) if the console asks for an index.
4. Map each login to J or P instead of a manual toggle.
5. Settle-up: record settlements so the balance resets.
6. Home screen per mockup: overdue strip, today/this week agenda, October plan by category, bills timeline.
7. Chores: rolling (every N days) and fixed-day recurrence.
8. Optional: GitHub Actions auto-deploy to Firebase Hosting on push to main.
