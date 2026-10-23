import { useEffect, useId, useState, type FormEvent } from "react";
//task-2

type MachineStatus = "running" | "idle" | "offline";

type Machine = {
  id: string;
  name: string;
  status: MachineStatus;
  location: string;
};

type InspectionResult = "pass" | "fail";

type Inspection = {
  id: number;
  machineId: string;
  inspector: string;
  result: InspectionResult;
  notes: string;
};

type ApiResult<T> = {
  data: T | null;
  success: boolean;
  message?: string;
};

const demoMachines: Machine[] = [
  { id: "M-101", name: "Lathe", status: "running", location: "Chennai Plant" },
  { id: "M-102", name: "Press", status: "idle", location: "Pune Plant" },
  { id: "M-103", name: "Drill", status: "offline", location: "Delhi Plant" },
  { id: "M-104", name: "Mill", status: "running", location: "Kolkata Plant" },
];

function Task2TypesDemo() {
  const machinesResult: ApiResult<Machine[]> = {
    data: demoMachines.slice(0, 2),
    success: true,
  };

  const failedResult: ApiResult<number> = {
    data: null,
    success: false,
    message: "Server not reachable",
  };

  const inspection: Inspection = {
    id: 1,
    machineId: "M-101",
    inspector: "Asha",
    result: "pass",
    notes: "All good",
  };

  return (
    <pre>
      {JSON.stringify({ machinesResult, failedResult, inspection }, null, 2)}
    </pre>
  );
}

//task-3

const statusColors: Record<MachineStatus, string> = {
  running: "green",
  idle: "orange",
  offline: "red",
};

function StatusBadge({ status }: { status: MachineStatus }) {
  return (
    <span
      style={{
        background: statusColors[status],
        color: "white",
        padding: "2px 10px",
        borderRadius: 12,
      }}
    >
      {status}
    </span>
  );
}

function Header({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <header style={{ background: "#222", color: "white", padding: 12, borderRadius: 8 }}>
      <h2 style={{ margin: 0 }}>{title}</h2>
      <small>{subtitle}</small>
    </header>
  );
}

type MachineCardProps = {
  machine: Machine;
  selected?: boolean;                 // optional
  onSelect?: (id: string) => void;    // optional callback
};

function MachineCard({ machine, selected = false, onSelect }: MachineCardProps) {
  return (
    <div
      style={{
        border: selected ? "2px solid royalblue" : "1px solid #ccc",
        padding: 12,
        margin: 8,
        borderRadius: 8,
      }}
    >
      <h3 style={{ margin: 0 }}>
        {machine.id} - {machine.name}
      </h3>
      <StatusBadge status={machine.status} />
      <p>Location: {machine.location}</p>
      {onSelect && (
        <button type="button" onClick={() => onSelect(machine.id)}>
          {selected ? "Selected" : "Select"}
        </button>
      )}
    </div>
  );
}

type InspectionFormProps = {
  machines: Machine[];
  onSubmit: (data: Omit<Inspection, "id">) => void; // Inspection without the id
};

function InspectionForm({ machines, onSubmit }: InspectionFormProps) {
  const uid = useId();
  const [machineId, setMachineId] = useState(machines[0]?.id ?? "");
  const [inspector, setInspector] = useState("");
  const [result, setResult] = useState<InspectionResult>("pass");
  const [notes, setNotes] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    onSubmit({ machineId, inspector, result, notes });
    setInspector("");
    setNotes("");
  }

  return (
    <form onSubmit={handleSubmit} style={{ margin: 8 }}>
      <div>
        <label htmlFor={`${uid}-machine`}>Machine</label>
        <br />
        <select
          id={`${uid}-machine`}
          value={machineId}
          onChange={(e) => setMachineId(e.target.value)}
        >
          {machines.map((m) => (
            <option key={m.id} value={m.id}>
              {m.id} - {m.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor={`${uid}-inspector`}>Inspector</label>
        <br />
        <input
          id={`${uid}-inspector`}
          value={inspector}
          onChange={(e) => setInspector(e.target.value)}
        />
      </div>

      <div>
        <label htmlFor={`${uid}-result`}>Result</label>
        <br />
        <select
          id={`${uid}-result`}
          value={result}
          onChange={(e) => setResult(e.target.value as InspectionResult)}
        >
          <option value="pass">Pass</option>
          <option value="fail">Fail</option>
        </select>
      </div>

      <div>
        <label htmlFor={`${uid}-notes`}>Notes</label>
        <br />
        <textarea
          id={`${uid}-notes`}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>

      <button type="submit">Save inspection</button>
    </form>
  );
}

function Task3ComponentsDemo() {
  return (
    <div>
      <Header title="Machine Inspection" subtitle="Task 3 demo" />
      {demoMachines.slice(0, 2).map((m) => (
        <MachineCard key={m.id} machine={m} />
      ))}
      <InspectionForm
        machines={demoMachines}
        onSubmit={(data) => console.log("Task 3 submitted:", data)}
      />
    </div>
  );
}

//task-4

function Task4SelectionDemo() {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selectedMachine = demoMachines.find((m) => m.id === selectedId);

  return (
    <div>
      {demoMachines.map((m) => (
        <MachineCard
          key={m.id}
          machine={m}
          selected={m.id === selectedId}
          onSelect={setSelectedId}
        />
      ))}

      {selectedMachine ? (
        <p>
          You selected: {selectedMachine.name} ({selectedMachine.id}) at{" "}
          {selectedMachine.location}
        </p>
      ) : (
        <p>No machine selected.</p>
      )}
    </div>
  );
}

//Task-5

type StatusFilter = "all" | MachineStatus;

function Task5StateDemo() {
  const [search, setSearch] = useState("");                         // filter 1
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all"); // filter 2
  const [records, setRecords] = useState<Inspection[]>([]);         // submitted records

  const visibleMachines = demoMachines.filter((m) => {
    const matchesText = m.name.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || m.status === statusFilter;
    return matchesText && matchesStatus;
  });

  function addRecord(data: Omit<Inspection, "id">) {
    setRecords((prev) => [...prev, { id: Date.now(), ...data }]);
  }

  return (
    <div>
      <div>
        <label htmlFor="t5-search">Search by name </label>
        <input
          id="t5-search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />{" "}
        <label htmlFor="t5-status">Status </label>
        <select
          id="t5-status"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
        >
          <option value="all">All</option>
          <option value="running">Running</option>
          <option value="idle">Idle</option>
          <option value="offline">Offline</option>
        </select>
      </div>

      {visibleMachines.length === 0 ? (
        <p>No machines match the filters.</p>
      ) : (
        visibleMachines.map((m) => <MachineCard key={m.id} machine={m} />)
      )}

      <h4>New inspection</h4>
      <InspectionForm machines={demoMachines} onSubmit={addRecord} />

      <h4>Submitted records ({records.length})</h4>
      {records.length === 0 ? (
        <p>Nothing submitted yet.</p>
      ) : (
        <ul>
          {records.map((r) => (
            <li key={r.id}>
              {r.machineId} - {r.result} - {r.inspector}: {r.notes}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

//task-6

type ValidatedFormErrors = {
  machineId?: string;
  inspector?: string;
  notes?: string;
};

type SaveState = "idle" | "saving" | "error" | "success";

// pretend server: notes containing the word "fail" are rejected
function fakeSaveInspection(
  data: Omit<Inspection, "id">
): Promise<ApiResult<Inspection>> {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (data.notes.toLowerCase().includes("fail")) {
        resolve({ data: null, success: false, message: "Server rejected the inspection." });
      } else {
        resolve({ data: { id: Date.now(), ...data }, success: true });
      }
    }, 1000);
  });
}

type ValidatedFormProps = {
  machines: Machine[];
  onSaved: (inspection: Inspection) => void;
};

function ValidatedInspectionForm({ machines, onSaved }: ValidatedFormProps) {
  const [machineId, setMachineId] = useState("");
  const [inspector, setInspector] = useState("");
  const [result, setResult] = useState<InspectionResult>("pass");
  const [notes, setNotes] = useState("");
  const [errors, setErrors] = useState<ValidatedFormErrors>({});
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    const newErrors: ValidatedFormErrors = {};
    if (machineId === "") newErrors.machineId = "Please choose a machine.";
    if (inspector.trim() === "") newErrors.inspector = "Inspector name is required.";
    if (notes.trim() === "") newErrors.notes = "Notes are required.";
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return; // stop if any error

    setSaveState("saving");
    const response = await fakeSaveInspection({ machineId, inspector, result, notes });

    if (response.success && response.data) {
      onSaved(response.data);
      setSaveState("success");
      setMessage(`Inspection saved for ${response.data.machineId}.`);
      setMachineId("");
      setInspector("");
      setNotes("");
    } else {
      setSaveState("error");
      setMessage(response.message ?? "Something went wrong.");
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate style={{ margin: 8 }}>
      <div>
        <label htmlFor="vf-machine">Machine (required)</label>
        <br />
        <select
          id="vf-machine"
          value={machineId}
          onChange={(e) => setMachineId(e.target.value)}
          aria-invalid={Boolean(errors.machineId)}
          aria-describedby={errors.machineId ? "vf-machine-error" : undefined}
        >
          <option value="">Select machine</option>
          {machines.map((m) => (
            <option key={m.id} value={m.id}>
              {m.id} - {m.name}
            </option>
          ))}
        </select>
        {errors.machineId && (
          <p id="vf-machine-error" role="alert" style={{ color: "red" }}>
            {errors.machineId}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="vf-inspector">Inspector (required)</label>
        <br />
        <input
          id="vf-inspector"
          value={inspector}
          onChange={(e) => setInspector(e.target.value)}
          aria-invalid={Boolean(errors.inspector)}
          aria-describedby={errors.inspector ? "vf-inspector-error" : undefined}
        />
        {errors.inspector && (
          <p id="vf-inspector-error" role="alert" style={{ color: "red" }}>
            {errors.inspector}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="vf-result">Result</label>
        <br />
        <select
          id="vf-result"
          value={result}
          onChange={(e) => setResult(e.target.value as InspectionResult)}
        >
          <option value="pass">Pass</option>
          <option value="fail">Fail</option>
        </select>
      </div>

      <div>
        <label htmlFor="vf-notes">Notes (required)</label>
        <br />
        <textarea
          id="vf-notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          aria-invalid={Boolean(errors.notes)}
          aria-describedby={errors.notes ? "vf-notes-error" : undefined}
        />
        {errors.notes && (
          <p id="vf-notes-error" role="alert" style={{ color: "red" }}>
            {errors.notes}
          </p>
        )}
      </div>

      <button type="submit" disabled={saveState === "saving"}>
        {saveState === "saving" ? "Saving..." : "Save inspection"}
      </button>

      {saveState === "saving" && <p role="status">Loading... saving to server</p>}
      {saveState === "error" && (
        <p role="alert" style={{ color: "red" }}>
          Error: {message}
        </p>
      )}
      {saveState === "success" && (
        <p role="status" style={{ color: "green" }}>
          Success: {message}
        </p>
      )}
    </form>
  );
}

function Task6ValidationDemo() {
  const [records, setRecords] = useState<Inspection[]>([]);

  return (
    <div>
      <p>Tip: type the word "fail" in the notes to see the error state.</p>
      <ValidatedInspectionForm
        machines={demoMachines}
        onSaved={(r) => setRecords((prev) => [...prev, r])}
      />

      <h4>Saved inspections</h4>
      {records.length === 0 ? (
        <p>No inspections saved yet.</p>
      ) : (
        <ul>
          {records.map((r) => (
            <li key={r.id}>
              {r.machineId} - {r.result} - {r.inspector}: {r.notes}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

//task-7

type LoadMode = "ok" | "empty" | "fail" | "slow";

function fakeFetchMachines(mode: LoadMode): Promise<ApiResult<Machine[]>> {
  return new Promise((resolve) => {
    const delay = mode === "slow" ? 3000 : 800;

    setTimeout(() => {
      if (mode === "fail") {
        resolve({ data: null, success: false, message: "Could not reach the server." });
      } else if (mode === "empty") {
        resolve({ data: [], success: true });
      } else if (mode === "slow") {
        resolve({
          data: [{ id: "SLOW-1", name: "Slow machine", status: "idle", location: "Old result" }],
          success: true,
        });
      } else {
        resolve({ data: demoMachines, success: true });
      }
    }, delay);
  });
}

function Task7DataLoader() {
  const [mode, setMode] = useState<LoadMode>("ok");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [machines, setMachines] = useState<Machine[]>([]);

  useEffect(() => {
    let ignore = false;

    fakeFetchMachines(mode).then((response) => {
      if (ignore) return;

      setLoading(false);
      if (response.success && response.data) {
        setMachines(response.data);
      } else {
        setMachines([]);
        setError(response.message ?? "Unknown error");
      }
    });

    return () => {
      ignore = true;
    };
  }, [mode]);

  function changeMode(newMode: LoadMode) {
    if (newMode === mode) return;
    setMode(newMode);
    setLoading(true);
    setError(null);
  }

  return (
    <div>
      <button type="button" onClick={() => changeMode("ok")}>Load OK</button>
      <button type="button" onClick={() => changeMode("empty")}>Load empty</button>
      <button type="button" onClick={() => changeMode("fail")}>Load error</button>
      <button type="button" onClick={() => changeMode("slow")}>Load slow (3s)</button>
      <p>Current mode: {mode}</p>

      {loading && <p role="status">Loading machines...</p>}

      {!loading && error && (
        <p role="alert" style={{ color: "red" }}>
          {error}
        </p>
      )}

      {!loading && !error && machines.length === 0 && <p>No machines found.</p>}

      {!loading &&
        !error &&
        machines.map((m) => <MachineCard key={m.id} machine={m} />)}
    </div>
  );
}

//Final App component

export default function App() {
  return (
    <div style={{ padding: 24, textAlign: "left", maxWidth: 800, margin: "0 auto" }}>
      <h1>Machine Inspection App</h1>

      <section><h2>Task 2: Types</h2><Task2TypesDemo /></section>
      <hr />
      <section><h2>Task 3: Reusable components</h2><Task3ComponentsDemo /></section>
      <hr />
      <section><h2>Task 4: Selection callback</h2><Task4SelectionDemo /></section>
      <hr />
      <section><h2>Task 5: Filters, form, records</h2><Task5StateDemo /></section>
      <hr />
      <section><h2>Task 6: Validation and states</h2><Task6ValidationDemo /></section>
      <hr />
      <section><h2>Task 7: Loading data</h2><Task7DataLoader /></section>
    </div>
  );
}