import React, { useState, useEffect } from "react";
import { Database, Trash2, Plus, RefreshCw, Send, Check } from "lucide-react";
import { collection, onSnapshot, addDoc, deleteDoc, doc, serverTimestamp, query, orderBy } from "firebase/firestore";
import { db, OperationType, handleFirestoreError } from "../lib/firebase";

interface SavedScenario {
  id: string;
  country: string;
  year: number;
  notes: string;
  gsvVal: string;
  itcVal: string;
  createdAt: any;
}

interface SavedScenariosProps {
  user: any;
  token: string | null;
  activeCountry: string;
  activeYear: number;
  activeGsv: number;
  activeItc: number;
  onLoadScenario: (country: string, year: number) => void;
}

export function SavedScenarios({
  user,
  token,
  activeCountry,
  activeYear,
  activeGsv,
  activeItc,
  onLoadScenario,
}: SavedScenariosProps) {
  const [scenarios, setScenarios] = useState<SavedScenario[]>([]);
  const [newNotes, setNewNotes] = useState<string>("");
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [successMsg, setSuccessMsg] = useState<string>("");

  useEffect(() => {
    if (!user?.uid) {
      setScenarios([]);
      return;
    }

    setIsLoading(true);
    const scenariosRef = collection(db, "users", user.uid, "savedScenarios");
    const q = query(scenariosRef, orderBy("createdAt", "asc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data: SavedScenario[] = [];
      snapshot.forEach((doc) => {
        data.push({ id: doc.id, ...doc.data() } as SavedScenario);
      });
      setScenarios(data);
      setIsLoading(false);
    }, (error) => {
      setIsLoading(false);
      handleFirestoreError(error, OperationType.LIST, `users/${user.uid}/savedScenarios`);
    });

    return () => unsubscribe();
  }, [user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.uid || !newNotes.trim()) return;

    setIsSaving(true);
    try {
      const scenariosRef = collection(db, "users", user.uid, "savedScenarios");
      await addDoc(scenariosRef, {
        userId: user.uid,
        country: activeCountry,
        year: activeYear,
        notes: newNotes,
        gsvVal: activeGsv.toFixed(2),
        itcVal: activeItc.toFixed(2),
        createdAt: serverTimestamp(),
      });
      setNewNotes("");
      setSuccessMsg("Scenario saved success!");
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, `users/${user.uid}/savedScenarios`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!user?.uid) return;
    try {
      const scenarioRef = doc(db, "users", user.uid, "savedScenarios", id);
      await deleteDoc(scenarioRef);
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `users/${user.uid}/savedScenarios/${id}`);
    }
  };

  if (!user) {
    return (
      <div className="bg-slate-50 border border-dashed border-slate-200 rounded-xl p-5 text-center flex flex-col items-center justify-center h-full">
        <Database className="w-8 h-8 text-slate-300 mb-2" />
        <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
          Secured Sandbox Database
        </h4>
        <p className="text-[11px] text-slate-400 mt-1 max-w-[240px] leading-relaxed">
          Sign in above to activate your personal relational database ledger. Save custom scenarios, policy logs, and regulatory annotations directly on Cloud SQL.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full justify-between">
      <div>
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-1.5">
            <span className="bg-emerald-100 text-emerald-800 p-1 rounded-md">
              <Database className="w-3.5 h-3.5" />
            </span>
            <span className="text-xs uppercase font-black tracking-wider text-slate-700">
              Firestore Policy Ledger
            </span>
          </div>
          <button
            title="Real-time syncing enabled"
            className="p-1 hover:bg-slate-100 rounded-md transition-all text-slate-400 hover:text-slate-600"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin text-indigo-600" : ""}`} />
          </button>
        </div>

        {/* Existing Scenarios List */}
        <div className="max-h-[160px] overflow-y-auto space-y-2 mb-4 scrollbar-thin">
          {scenarios.length === 0 ? (
            <p className="text-[11px] text-slate-400 italic text-center py-4">
              {isLoading ? "Synchronizing..." : "No custom policy dockets saved yet."}
            </p>
          ) : (
            scenarios.map((sc) => (
              <div
                key={sc.id}
                className="bg-slate-50 border border-slate-150 p-2.5 rounded-lg flex justify-between items-start gap-2 hover:border-slate-300 hover:bg-white transition-all group"
              >
                <div
                  className="cursor-pointer flex-1"
                  onClick={() => onLoadScenario(sc.country, sc.year)}
                  title="Click to load simulated framework baseline"
                >
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[10px] font-bold text-slate-900 bg-slate-200/60 px-1.5 py-0.5 rounded-sm">
                      {sc.country}
                    </span>
                    <span className="text-[10px] font-medium text-slate-500">
                      {sc.year}
                    </span>
                    <span className="text-[9px] font-mono font-bold text-indigo-600 ml-auto">
                      GSV: {sc.gsvVal} · ITC: {sc.itcVal}
                    </span>
                  </div>
                  <p className="text-[10.5px] text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                    {sc.notes}
                  </p>
                </div>
                <button
                  onClick={() => handleDelete(sc.id)}
                  aria-label="Delete saved entry"
                  className="text-slate-300 hover:text-rose-600 p-1 rounded-md transition-all self-center shrink-0"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Save Scenario Form */}
      <form onSubmit={handleSave} className="border-t border-slate-100 pt-3">
        <label htmlFor="policy-notes" className="text-[10px] uppercase font-bold text-indigo-600 block mb-1">
          Store Active Setup ({activeCountry} · {activeYear})
        </label>
        <div className="relative">
          <input
            id="policy-notes"
            type="text"
            placeholder="Document simulated macro outcome / regulatory policy target..."
            value={newNotes}
            onChange={(e) => setNewNotes(e.target.value)}
            disabled={isSaving}
            maxLength={180}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 pr-10 text-[11px] placeholder:text-slate-400 focus:outline-hidden focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 text-slate-800"
          />
          <button
            type="submit"
            disabled={isSaving || !newNotes.trim()}
            className="absolute right-1.5 top-1.5 p-1 rounded-md bg-indigo-600 hover:bg-indigo-750 text-white disabled:bg-slate-200 disabled:text-slate-400 transition-all cursor-pointer"
          >
            {isSaving ? (
              <RefreshCw className="w-3 h-3 animate-spin" />
            ) : (
              <Plus className="w-3 h-3" />
            )}
          </button>
        </div>

        {successMsg && (
          <div className="flex items-center gap-1 mt-1 text-emerald-600 text-[9.5px] font-semibold animate-pulse">
            <Check className="w-3 h-3" />
            {successMsg}
          </div>
        )}
      </form>
    </div>
  );
}
