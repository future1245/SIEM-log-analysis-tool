import { useState } from "react";
import { Save, CheckCircle } from "lucide-react";

export default function SaveAlerts() {
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    setSaved(false);

    try {
      const res = await fetch("http://127.0.0.1:5000/api/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        }
      });

      const data = await res.json();

      console.log("Saved file:", data.file);

      setSaved(true);
    } catch (err) {
      console.error("Save failed:", err);
    }

    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center h-full p-8">
      <div className="bg-[#0f172a] border border-slate-700 rounded-xl p-8 w-[420px] shadow-xl">

        {/* Title */}
        <h1 className="text-xl font-semibold text-white mb-2 flex items-center gap-2">
          <Save size={20} />
          Save Alerts
        </h1>

        {/* Description */}
        <p className="text-slate-400 text-sm mb-6">
          Save all current alerts to disk so they persist after server restart.
        </p>

        {/* Button */}
        <button
          onClick={handleSave}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 transition px-4 py-2 rounded-lg text-white font-medium flex items-center justify-center gap-2"
        >
          <Save size={16} />
          {loading ? "Saving..." : "Save Alerts"}
        </button>

        {/* Success message */}
        {saved && (
          <div className="mt-4 flex items-center gap-2 text-green-400 text-sm">
            <CheckCircle size={16} />
            Alerts saved successfully
          </div>
        )}
      </div>
    </div>
  );
}