import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Copy, Check, Loader2 } from "lucide-react";
import { templates } from "../data/templates";

const TemplateForm = () => {
  const { id } = useParams();
  const template = templates.find(t => t.id === id);

  const [formData, setFormData] = useState({});
  const [generatedContent, setGeneratedContent] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Initialize form data
  useEffect(() => {
    if (template) {
      const initialData = {};
      template.fields.forEach(field => {
        initialData[field.name] = "";
      });
      setFormData(initialData);
    }
  }, [template]);

  if (!template) {
    return (
      <div className="p-8 text-center">
        Template not found.{" "}
        <Link to="/" className="text-blue-600">
          Go Home
        </Link>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Generate prompt from template fields
      const prompt = template.generate(formData);

      // Call backend
      const res = await fetch("http://localhost:3001/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      if (!res.ok) throw new Error("AI generation failed");

      const data = await res.json();
      setGeneratedContent(data.output);
      setShowPreview(true);

    } catch (err) {
      console.error(err);
      setError("Failed to generate content. Make sure backend & Ollama are running.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  /* ================= PREVIEW ================= */
  if (showPreview) {
    return (
      <div className="min-h-screen px-4 py-12 bg-gray-50 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <button
            onClick={() => setShowPreview(false)}
            className="flex items-center mb-6 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to edit
          </button>

          <div className="overflow-hidden bg-white rounded-lg shadow-lg">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">
                Generated Result
              </h2>
              <button
                onClick={handleCopy}
                className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
              >
                {copied ? (
                  <Check className="w-4 h-4 mr-2" />
                ) : (
                  <Copy className="w-4 h-4 mr-2" />
                )}
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>

            <div className="p-6 bg-gray-50">
              <pre className="p-6 font-sans text-gray-800 whitespace-pre-wrap bg-white border rounded-md shadow-sm">
                {generatedContent}
              </pre>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ================= FORM ================= */
  return (
    <div className="min-h-screen px-4 py-12 bg-gray-50 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <Link
          to="/"
          className="flex items-center mb-6 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Dashboard
        </Link>

        <div className="overflow-hidden bg-white rounded-lg shadow-lg">
          <div className="px-6 py-8 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">{template.title}</h1>
            <p className="mt-2 text-gray-600">{template.description}</p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {template.fields.map((field) => (
              <div key={field.name}>
                <label className="block text-sm font-medium text-gray-700">{field.label}</label>

                {field.type === "textarea" ? (
                  <textarea
                    name={field.name}
                    rows={4}
                    required
                    value={formData[field.name] || ""}
                    onChange={handleChange}
                    className="block w-full p-2 mt-1 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder={field.placeholder}
                  />
                ) : (
                  <input
                    type={field.type}
                    name={field.name}
                    required
                    value={formData[field.name] || ""}
                    onChange={handleChange}
                    className="block w-full p-2 mt-1 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder={field.placeholder}
                  />
                )}
              </div>
            ))}

            {error && <div className="text-sm text-red-600">{error}</div>}

            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                "Generate with AI"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TemplateForm;
