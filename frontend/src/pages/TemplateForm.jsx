import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Copy, Check, Loader2, FileText, FileDown } from "lucide-react";
import { templates } from "../data/templates";

import jsPDF from "jspdf";
import { Document, Packer, Paragraph } from "docx";
import { saveAs } from "file-saver";

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
        <Link to="/" className="text-blue-600">Go Home</Link>
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
      const prompt = template.generate(formData);

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

  /* ===== EXPORT PDF ===== */
  const handleExportPDF = () => {
    const pdf = new jsPDF();
    pdf.setFont("Times", "Normal");
    pdf.setFontSize(12);

    const text = pdf.splitTextToSize(generatedContent, 180);
    pdf.text(text, 10, 20);

    pdf.save(`${template.id}.pdf`);
  };

  /* ===== EXPORT DOCX ===== */
  const handleExportDOCX = async () => {
    const doc = new Document({
      sections: [
        {
          children: generatedContent
            .split("\n")
            .map(line => new Paragraph(line)),
        },
      ],
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, `${template.id}.docx`);
  };

  /* ================= PREVIEW ================= */
  if (showPreview) {
    return (
      <div className="min-h-screen px-4 py-12 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <button
            onClick={() => setShowPreview(false)}
            className="flex items-center mb-6 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to edit
          </button>

          <div className="overflow-hidden bg-white rounded-lg shadow-lg">
            <div className="flex flex-wrap items-center justify-between gap-2 px-6 py-4 border-b">
              <h2 className="text-xl font-semibold">Generated Result</h2>

              <div className="flex gap-2">
                <button
                  onClick={handleCopy}
                  className="flex items-center px-3 py-2 text-sm text-white bg-blue-600 rounded-md"
                >
                  {copied ? <Check className="w-4 h-4 mr-1" /> : <Copy className="w-4 h-4 mr-1" />}
                  {copied ? "Copied" : "Copy"}
                </button>

                <button
                  onClick={handleExportPDF}
                  className="flex items-center px-3 py-2 text-sm text-white bg-green-600 rounded-md"
                >
                  <FileDown className="w-4 h-4 mr-1" />
                  PDF
                </button>

                <button
                  onClick={handleExportDOCX}
                  className="flex items-center px-3 py-2 text-sm text-white bg-purple-600 rounded-md"
                >
                  <FileText className="w-4 h-4 mr-1" />
                  DOCX
                </button>
              </div>
            </div>

            <div className="p-6 bg-gray-50">
              <pre className="p-6 whitespace-pre-wrap bg-white border rounded-md">
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
    <div className="min-h-screen px-4 py-12 bg-gray-50">
      <div className="max-w-2xl mx-auto">
        <Link to="/" className="flex items-center mb-6 text-gray-600 hover:text-gray-900">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Dashboard
        </Link>

        <div className="bg-white rounded-lg shadow-lg">
          <div className="px-6 py-8 border-b">
            <h1 className="text-2xl font-bold">{template.title}</h1>
            <p className="mt-2 text-gray-600">{template.description}</p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {template.fields.map(field => (
              <div key={field.name}>
                <label className="block text-sm font-medium">{field.label}</label>

                {field.type === "textarea" ? (
                  <textarea
                    name={field.name}
                    rows={4}
                    required
                    value={formData[field.name] || ""}
                    onChange={handleChange}
                    className="block w-full p-2 mt-1 border rounded-md"
                  />
                ) : (
                  <input
                    type={field.type}
                    name={field.name}
                    required
                    value={formData[field.name] || ""}
                    onChange={handleChange}
                    className="block w-full p-2 mt-1 border rounded-md"
                  />
                )}
              </div>
            ))}

            {error && <div className="text-sm text-red-600">{error}</div>}

            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center w-full px-4 py-2 text-white bg-blue-600 rounded-md"
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
