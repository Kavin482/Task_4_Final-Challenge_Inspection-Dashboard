# Machine Inspection App

A small React + TypeScript app (built with Vite) to view machines, filter them,
and record inspections.

## How to run

1. Install Node.js.
2. Open a terminal inside the project folder (the one with `package.json`).
3. Run:
   ```bash
   npm install
   npm run dev
   ```
4. Open the URL shown in the terminal (usually http://localhost:5173).

Other commands:
- `npx tsc -b` checks for TypeScript errors.
- `npm run build` creates a production build.

## Data types

- `Machine`: id, name, status (`running` | `idle` | `offline`), location
- `Inspection`: id, machineId, inspector, result (`pass` | `fail`), notes
- `ApiResult<T>`: data, success, optional message

## Component structure

```
App
 ├─ Task3ComponentsDemo
 │   ├─ Header
 │   ├─ MachineCard
 │   └─ InspectionForm
 ├─ Task4SelectionDemo     MachineCard + selection callback
 ├─ Task5StateDemo         holds filters and submitted records
 │   ├─ MachineCard
 │   └─ InspectionForm     holds form values
 ├─ Task6ValidationDemo
 │   └─ ValidatedInspectionForm   validation + loading/error/success
 └─ Task7DataLoader        loads machines with useEffect
     └─ MachineCard
         └─ StatusBadge
```

## How components communicate

- Parent to child: props (`machine`, `selected`, `machines`).
- Child to parent: callbacks (`onSelect(id)`, `onSubmit(data)`, `onSaved(record)`).

## State and effects

- `useState`: filters, form values, errors, save state, submitted records.
- `useEffect`: loads demo data when the mode changes. Its cleanup sets
  `ignore = true` so slow, outdated responses are discarded.