import React, { useRef, useState } from "react";

function App() {
  // State hooks
  const [preview, setPreview] = useState("");
  const [predictedLabel, setPredictedLabel] = useState("—");
  const [confidence, setConfidence] = useState(0);
  const [confidenceText, setConfidenceText] = useState("—");
  const [mockOutput, setMockOutput] = useState("Awaiting image…");
  const [showPreview, setShowPreview] = useState(false);

  const imageInputRef = useRef();

  const classes = ["Spaghetti", "Ramen", "Udon"];

  // Handlers
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new window.FileReader();
    reader.onload = (ev) => {
      setPreview(ev.target.result);
      setShowPreview(true);
      setPredictedLabel("—");
      setConfidence(0);
      setConfidenceText("—");
      setMockOutput("Ready to classify.");
    };
    reader.readAsDataURL(file);
  };

  const handleClassify = () => {
    // Mock classification
    const label = classes[Math.floor(Math.random() * classes.length)];
    const conf = Math.floor(85 + Math.random() * 15); // 85–100%
    setPredictedLabel(label);
    setConfidence(conf);
    setConfidenceText(conf + "%");
    setMockOutput(`Predicted: ${label} (${conf}%)`);
  };

  const handleClear = () => {
    if (imageInputRef.current) imageInputRef.current.value = "";
    setShowPreview(false);
    setPreview("");
    setPredictedLabel("—");
    setConfidence(0);
    setConfidenceText("—");
    setMockOutput("Awaiting image…");
  };

  return (
    <div className="min-h-screen text-[#3a2a20]" style={{
      fontFamily: "'Noto Serif JP', serif",
      background: "radial-gradient(ellipse at center, rgba(255, 255, 255, 0.6) 0%, rgba(240, 232, 218, 0.9) 60%, rgba(236, 226, 208, 1) 100%), repeating-linear-gradient(0deg, rgba(255,255,255,0.05) 0px, rgba(255,255,255,0.05) 2px, rgba(0,0,0,0.03) 3px, rgba(0,0,0,0.03) 5px)",
      backgroundColor: "#efe7d7"
    }}>
      {/* Header */}
      <header className="w-full border-b border-[#8b2f2f]/20 bg-[#8b2f2f] text-[#f9f4ea]">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Lantern icon */}
            <svg className="lantern w-8 h-8" viewBox="0 0 24 24" fill="none" style={{ filter: "drop-shadow(0 2px 2px rgba(0,0,0,0.2))" }}>
              <circle cx="12" cy="12" r="8" fill="#f4c27b" stroke="#3a2a20" strokeWidth="1.5" />
              <rect x="10" y="3" width="4" height="2" rx="1" fill="#3a2a20" />
              <rect x="10" y="19" width="4" height="2" rx="1" fill="#3a2a20" />
              <line x1="12" y1="5" x2="12" y2="19" stroke="#8b2f2f" strokeWidth="1.2" />
            </svg>
            <div>
              <h1 className="jp-title text-2xl md:text-3xl font-semibold" style={{ fontFamily: "'Sawarabi Mincho', serif", letterSpacing: "0.04em" }}>麺屋 — Noodle Classifier</h1>
              <p className="text-sm opacity-90">Spaghetti · Ramen · Udon</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-2">
            <span className="text-sm">Open</span>
            <div className="w-2 h-2 rounded-full bg-[#f4c27b]"></div>
          </div>
        </div>
        <div className="divider-pattern h-1 w-full" style={{
          backgroundImage: "repeating-linear-gradient(90deg, rgba(139,47,47,0.25) 0, rgba(139,47,47,0.25) 2px, transparent 2px, transparent 8px)"
        }}></div>
      </header>

      {/* Main */}
      <main className="max-w-5xl mx-auto px-6 py-10">
        <section className="paper-card rounded-xl p-6 md:p-8" style={{
          background: "linear-gradient(180deg, #faf6ef 0%, #f6f0e6 100%)",
          boxShadow: "0 6px 18px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.6)",
          border: "1px solid rgba(117,84,58,0.15)"
        }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Upload / Preview */}
            <div>
              <h2 className="jp-title text-xl font-bold mb-4" style={{ fontFamily: "'Sawarabi Mincho', serif" }}>Upload your noodle photo</h2>
              <label
                htmlFor="imageInput"
                className="group border-2 border-dashed border-[#8b2f2f]/30 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:border-[#8b2f2f] transition"
              >
                <svg className="w-12 h-12 text-[#8b2f2f] mb-3 group-hover:scale-105 transition" viewBox="0 0 24 24" fill="none">
                  <path d="M3 17V7a2 2 0 0 1 2-2h8l4 4v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z" stroke="currentColor" strokeWidth="1.4" />
                  <path d="M10 14l2-2 2 2 3-3" stroke="currentColor" strokeWidth="1.4" />
                </svg>
                <p className="text-center text-sm">
                  <span className="font-semibold">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-[#3a2a20]/70 mt-1">JPEG, PNG — up to 5 MB</p>
                <input
                  id="imageInput"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  ref={imageInputRef}
                  onChange={handleImageChange}
                />
              </label>

              {showPreview && (
                <div className="mt-5">
                  <div className="jp-title text-sm font-semibold mb-2" style={{ fontFamily: "'Sawarabi Mincho', serif" }}>Preview</div>
                  <div className="relative overflow-hidden rounded-lg border border-[#8b2f2f]/20 bg-[#fff]">
                    <img src={preview} alt="Preview" className="w-full h-64 object-cover" />
                  </div>
                </div>
              )}

              <div className="mt-6 flex items-center gap-3">
                <button
                  className="px-4 py-2 rounded-md bg-[#8b2f2f] text-[#f9f4ea] hover:bg-[#742626] transition disabled:opacity-50"
                  disabled={!showPreview}
                  onClick={handleClassify}
                >
                  Classify
                </button>
                <button
                  className="px-4 py-2 rounded-md bg-[#f4c27b] text-[#3a2a20] hover:bg-[#e4b26b] transition"
                  onClick={handleClear}
                >
                  Clear
                </button>
              </div>
            </div>

            {/* Result */}
            <div>
              <h2 className="jp-title text-xl font-bold mb-4" style={{ fontFamily: "'Sawarabi Mincho', serif" }}>Result</h2>
              <div className="rounded-lg border border-[#8b2f2f]/20 bg-white p-5 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#8b2f2f] text-[#f9f4ea] flex items-center justify-center jp-title text-lg" style={{ fontFamily: "'Sawarabi Mincho', serif" }}>麺</div>
                  <div>
                    <div className="text-sm text-[#3a2a20]/70">Predicted type</div>
                    <div className="jp-title text-2xl font-semibold" style={{ fontFamily: "'Sawarabi Mincho', serif" }}>{predictedLabel}</div>
                  </div>
                </div>

                <div>
                  <div className="text-sm text-[#3a2a20]/70 mb-1">Confidence</div>
                  <div className="w-full h-2 bg-[#3a2a20]/10 rounded">
                    <div className="h-2 bg-[#f4c27b] rounded" style={{ width: `${confidence}%` }}></div>
                  </div>
                  <div className="text-xs mt-1">{confidenceText}</div>
                </div>

                <div className="text-sm leading-relaxed">
                  <span className="font-semibold">Note:</span> Connect the “Classify” button to your ResNet‑18 inference endpoint to replace the mock result below.
                </div>

                <div className="rounded-md bg-[#efe7d7] p-3 text-sm">
                  <span className="font-semibold">Mock output:</span>
                  <span> {mockOutput}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-10 text-center text-sm text-[#3a2a20]/70">
          <div className="divider-pattern h-1 w-full mb-4" style={{
            backgroundImage: "repeating-linear-gradient(90deg, rgba(139,47,47,0.25) 0, rgba(139,47,47,0.25) 2px, transparent 2px, transparent 8px)"
          }}></div>
          <p>Handcrafted ambiance inspired by traditional Japanese shops — 素朴で温かい雰囲気。</p>
        </footer>
      </main>
    </div>
  );
}

export default App;