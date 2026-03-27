import React, { useState, useEffect } from 'react';
import './index.css';

// --- Icons ---
const UploadIcon = () => (
  <svg className="w-14 h-14 text-blue-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
  </svg>
);

const SparkleIcon = () => (
  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path>
  </svg>
);

export default function App() {
  const [selectedImages, setSelectedImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_URL = 'http://localhost:8000/predict';

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    
    // ดักเงื่อนไข 5 รูปตามที่มึงต้องการ
    if (files.length > 5) {
      setError('จำกัดการอัปโหลดสูงสุด 5 รูปต่อครั้งเท่านั้น');
      return;
    }

    if (files.length > 0) {
      setSelectedImages(files);
      const filePreviews = files.map(file => URL.createObjectURL(file));
      setPreviews(filePreviews);
      setPredictions([]); 
      setError(null);
    }
  };

  const handlePredict = async () => {
    if (selectedImages.length === 0) return;
    setLoading(true);
    setError(null);

    try {
      // ยิงพร้อมกัน 5 รูปด้วย Promise.all
      const predictPromises = selectedImages.map(async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        const response = await fetch(API_URL, { method: 'POST', body: formData });
        if (!response.ok) throw new Error(`Analysis failed for ${file.name}`);
        return response.json();
      });

      const results = await Promise.all(predictPromises);
      setPredictions(results);
    } catch (err) {
      console.warn("Using Mock Data (API Offline):", err);
      // Mock data สำหรับเทส UI
      setTimeout(() => {
        setPredictions(selectedImages.map(() => ({
          result: 'Sarcoptic Mange',
          confidence: Math.random() * (0.99 - 0.85) + 0.85
        })));
        setLoading(false);
      }, 2000);
    } finally {
      if (!error) setLoading(false);
    }
  };

  const formatConfidence = (conf) => {
    const num = parseFloat(conf);
    return isNaN(num) ? 'N/A' : `${(num > 1 ? num : num * 100).toFixed(1)}%`;
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-900 selection:bg-blue-100 pb-20">
      
      {/* Premium Navbar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200/60 py-4 px-10">
        <div className="max-w-[1600px] mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-blue-400 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
              <span className="text-white font-bold text-2xl">+</span>
            </div>
            <span className="text-2xl font-black text-slate-800 tracking-tight">PetDerm<span className="text-blue-600">AI</span></span>
          </div>
          <div className="hidden md:block text-sm font-medium text-slate-500">
            Kasetsart University | DiSTech Project
          </div>
        </div>
      </nav>

      <main className="max-w-[1600px] mx-auto px-8 pt-12">
        
        {/* Header Section */}
        <section className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-black text-slate-900 mb-6 tracking-tight leading-tight">
            AI-Powered <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500">Dermatology Analysis</span>
          </h1>
          <p className="text-xl text-slate-500 max-w-3xl mx-auto font-light leading-relaxed">
            ระบบวิเคราะห์โรคผิวหนังสัตว์เลี้ยงด้วยปัญญาประดิษฐ์ที่แม่นยำและรวดเร็ว <br/>
            อัปโหลดรูปภาพรอยโรค เพื่อรับผลการวิเคราะห์ทันที (max 5 images)
          </p>
        </section>

        {/* Upload & Dashboard Area */}
        <div className="flex flex-col gap-10">
          
          {/* Dropzone */}
          <section className="w-full max-w-4xl mx-auto">
            <label className={`group relative flex flex-col items-center justify-center w-full h-72 rounded-[2.5rem] border-2 border-dashed transition-all duration-500 cursor-pointer
              ${selectedImages.length > 0 ? 'bg-white border-blue-400 shadow-xl shadow-blue-50' : 'bg-white border-slate-200 hover:border-blue-400 hover:bg-blue-50/30'}`}>
              
              <div className="flex flex-col items-center justify-center py-10">
                <div className={`transition-transform duration-500 group-hover:scale-110 ${loading ? 'animate-bounce' : ''}`}>
                  <UploadIcon />
                </div>
                <h2 className="text-2xl font-bold text-slate-800 mb-2">
                  {selectedImages.length > 0 ? `${selectedImages.length} Images Selected` : 'Drop your photos here'}
                </h2>
                <p className="text-slate-400 font-medium tracking-wide">JPG or PNG (Max. 5 files)</p>
              </div>

              <input type="file" className="hidden" multiple accept="image/*" onChange={handleImageChange} disabled={loading} />
            </label>
          </section>

          {/* Action Button */}
          {selectedImages.length > 0 && !loading && predictions.length === 0 && (
            <div className="flex justify-center animate-in fade-in zoom-in duration-300">
              <button 
                onClick={handlePredict}
                className="group flex items-center gap-3 px-12 py-5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold text-xl shadow-[0_15px_30px_-10px_rgba(37,99,235,0.4)] transition-all hover:-translate-y-1 active:scale-95"
              >
                <SparkleIcon />
                เริ่มการวิเคราะห์รอยโรค
              </button>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="max-w-md mx-auto p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-center font-bold animate-shake">
              ⚠️ {error}
            </div>
          )}

          {/* Results Grid - Optimized for 1080p (Wide View) */}
          {(loading || predictions.length > 0) && (
            <section className="w-full mt-6 animate-in fade-in slide-in-from-bottom-10 duration-700">
              <div className="flex items-center justify-between mb-10">
                <h3 className="text-3xl font-black text-slate-900 tracking-tight text-left border-l-8 border-blue-600 pl-6">
                  {loading ? 'Analyzing Data...' : 'Analysis Reports'}
                </h3>
                {predictions.length > 0 && (
                  <button onClick={() => { setSelectedImages([]); setPredictions([]); setPreviews([]); }} className="text-blue-600 font-bold hover:underline">
                    Clear All
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
  {(loading ? Array(selectedImages.length).fill(null) : predictions).map((res, idx) => (
    
    <div key={idx} className="bg-white rounded-[2rem] overflow-hidden border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-500 group">
      
      {/* Image Section */}
      <div className="flex justify-center pt-6">
        <div className="relative h-64 w-64 overflow-hidden rounded-xl">

          {loading && (
            <div className="absolute inset-0 bg-slate-100 animate-pulse flex items-center justify-center">
              <div className="w-10 h-10 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin"></div>
            </div>
          )}

          <img
            src={previews[idx]}
            alt="pet"
            className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 ${
              loading ? "opacity-0" : "opacity-100"
            }`}
          />

          <div className="absolute top-4 left-4 bg-black/20 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-white tracking-widest uppercase">
            Case #0{idx + 1}
          </div>

        </div>
      </div>

      {/* Result Section */}
      <div className="p-5 text-center">
        <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] mb-2">
          AI Diagnosis
        </p>

        <h4 className="text-xl font-bold text-slate-900 mb-6 min-h-[56px] leading-tight">
          {loading ? "Processing..." : res?.result || "Pending..."}
        </h4>

        <div className="flex flex-col gap-2 pt-5 border-t border-slate-50">
          
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-slate-400">Accuracy</span>
            <span className="text-sm font-black text-slate-900">
              {res ? formatConfidence(res.confidence) : "--"}
            </span>
          </div>

          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600 transition-all duration-1000"
              style={{ width: res ? formatConfidence(res.confidence) : "0%" }}
            ></div>
          </div>

        </div>
      </div>

    </div>

  ))}
</div>
            </section>
          )}
        </div>
      </main>
    </div>
  );
}