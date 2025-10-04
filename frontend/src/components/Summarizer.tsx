import React, { useState } from "react";
import axios from "axios";
import LoadingSpinner from "./LoadingSpinner";

const API_URL = "https://ai-text-summarizer-nu.vercel.app";

type SummaryLength = "short" | "medium" | "long";

const Summarizer: React.FC = () => {
  const [text, setText] = useState<string>("");
  const [summary, setSummary] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [length, setLength] = useState<SummaryLength>("medium");
  const [showToast, setShowToast] = useState<boolean>(false);

  const handleSummarize = async () => {
    if (!text.trim()) {
      setError("Please enter some text to summarize");
      return;
    }

    setLoading(true);
    setError("");
    setSummary("");

    try {
      const response = await axios.post(`${API_URL}/api/summarize`, {
        text,
        length,
      });

      setSummary(response.data.summary);
    } catch (err: any) {
      setError(
        err.response?.data?.error ||
          "Failed to generate summary. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setText("");
    setSummary("");
    setError("");
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(summary);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            AI Text Summarizer
          </h1>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Summary Length
            </label>
            <div className="flex gap-3">
              {(["short", "medium", "long"] as SummaryLength[]).map((len) => (
                <button
                  key={len}
                  onClick={() => setLength(len)}
                  className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 ${
                    length === len
                      ? "bg-blue-600 text-white shadow-lg scale-105"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {len.charAt(0).toUpperCase() + len.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Enter Text to Summarize
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste or type your text here..."
              className="w-full h-64 p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all duration-200"
              disabled={loading}
            />
            <div className="text-right text-sm text-gray-500 mt-2">
              {text.length} / 50,000 characters
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleSummarize}
              disabled={loading || !text.trim()}
              className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <LoadingSpinner />
                  <span>Summarizing...</span>
                </div>
              ) : (
                "Generate Summary"
              )}
            </button>
            <button
              onClick={handleClear}
              disabled={loading}
              className="px-6 py-3 rounded-xl font-semibold bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:bg-gray-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              Clear
            </button>
          </div>

          {error && (
            <div className="mt-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
              <p className="text-red-700">{error}</p>
            </div>
          )}
        </div>

        {summary && (
          <div className="bg-white rounded-2xl shadow-xl p-8 animate-fade-in">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-900">Summary</h2>
              <button
                onClick={handleCopy}
                className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-all duration-200 shadow-md hover:shadow-lg"
              >
                Copy to Clipboard
              </button>
            </div>
            <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-100">
              <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                {summary}
              </p>
            </div>
          </div>
        )}
      </div>

      {showToast && (
        <div className="fixed bottom-8 right-8 bg-gray-900 text-white px-6 py-3 rounded-lg shadow-2xl animate-fade-in flex items-center gap-2">
          <svg
            className="w-5 h-5 text-green-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
          <span>Copied to clipboard!</span>
        </div>
      )}
    </div>
  );
};

export default Summarizer;
