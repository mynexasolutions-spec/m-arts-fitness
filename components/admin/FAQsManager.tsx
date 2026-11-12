"use client";

import React, { useState, useEffect } from "react";
import {
  FAQItem,
  DEFAULT_FAQS,
  getStoredFAQs,
  saveStoredFAQs,
} from "@/data/faqs";
import {
  HelpCircle,
  Plus,
  Trash2,
  Check,
  RotateCw,
  ArrowUp,
  ArrowDown,
  Pencil,
  Sparkles,
  Layers,
  ChevronDown,
} from "lucide-react";

const CATEGORIES = [
  "All",
  "Shipping & Delivery",
  "Returns & Exchanges",
  "Orders & Bulk",
  "Product Quality",
  "General",
] as const;

export default function FAQsManager() {
  const [faqs, setFaqs] = useState<FAQItem[]>(DEFAULT_FAQS);
  const [savedNotice, setSavedNotice] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [editingFaq, setEditingFaq] = useState<FAQItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    setFaqs(getStoredFAQs());
  }, []);

  const handleSave = (updated: FAQItem[]) => {
    setFaqs(updated);
    saveStoredFAQs(updated);
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2200);
  };

  const toggleActive = (id: string) => {
    const updated = faqs.map((f) =>
      f.id === id ? { ...f, isActive: !f.isActive } : f
    );
    handleSave(updated);
  };

  const moveUp = (index: number) => {
    if (index === 0) return;
    const updated = [...faqs];
    const temp = updated[index - 1];
    updated[index - 1] = updated[index];
    updated[index] = temp;
    // Re-index display orders
    updated.forEach((item, idx) => (item.displayOrder = idx + 1));
    handleSave(updated);
  };

  const moveDown = (index: number) => {
    if (index === faqs.length - 1) return;
    const updated = [...faqs];
    const temp = updated[index + 1];
    updated[index + 1] = updated[index];
    updated[index] = temp;
    updated.forEach((item, idx) => (item.displayOrder = idx + 1));
    handleSave(updated);
  };

  const deleteFaq = (id: string) => {
    if (faqs.length <= 1) {
      alert("At least one FAQ question must remain.");
      return;
    }
    if (confirm("Are you sure you want to delete this FAQ?")) {
      const updated = faqs.filter((f) => f.id !== id);
      updated.forEach((item, idx) => (item.displayOrder = idx + 1));
      handleSave(updated);
    }
  };

  const openAddModal = () => {
    setEditingFaq({
      id: `faq-${Date.now()}`,
      question: "",
      answer: "",
      category: "Shipping & Delivery",
      displayOrder: faqs.length + 1,
      isActive: true,
      createdAt: new Date().toISOString(),
    });
    setIsModalOpen(true);
  };

  const openEditModal = (item: FAQItem) => {
    setEditingFaq({ ...item });
    setIsModalOpen(true);
  };

  const saveModalItem = () => {
    if (!editingFaq || !editingFaq.question.trim() || !editingFaq.answer.trim()) {
      alert("Please fill in both Question and Answer.");
      return;
    }

    const exists = faqs.some((f) => f.id === editingFaq.id);
    let updated: FAQItem[];
    if (exists) {
      updated = faqs.map((f) => (f.id === editingFaq.id ? editingFaq : f));
    } else {
      updated = [...faqs, editingFaq];
    }
    updated.forEach((item, idx) => (item.displayOrder = idx + 1));
    handleSave(updated);
    setIsModalOpen(false);
    setEditingFaq(null);
  };

  const handleResetDefaults = () => {
    if (confirm("Reset all FAQs to default store questions?")) {
      handleSave(DEFAULT_FAQS);
    }
  };

  const filteredFaqs =
    activeCategory === "All"
      ? faqs
      : faqs.filter((f) => f.category === activeCategory);

  const activeCount = faqs.filter((f) => f.isActive).length;

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#141B29] border border-white/[0.08] p-5 rounded-2xl shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              Global Store FAQs Manager
            </h2>
            <p className="text-xs text-stone-400">
              Displayed directly on the Contact page accordion &bull; Total:{" "}
              <strong className="text-white">{faqs.length}</strong> ({activeCount} Active)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {savedNotice && (
            <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20 animate-fade-in">
              <Check className="w-4 h-4" /> FAQs Updated Live!
            </span>
          )}

          <button
            type="button"
            onClick={handleResetDefaults}
            className="px-3 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-xs font-semibold text-stone-400 hover:text-white transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCw className="w-3.5 h-3.5" /> Defaults
          </button>

          <button
            type="button"
            onClick={openAddModal}
            className="px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-orange-500/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Add FAQ
          </button>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 cursor-pointer ${
              activeCategory === cat
                ? "bg-orange-500 text-white shadow-md shadow-orange-500/20 font-bold"
                : "bg-[#141B29] text-stone-400 hover:text-white border border-white/[0.06]"
            }`}
          >
            {cat} {cat === "All" ? `(${faqs.length})` : ""}
          </button>
        ))}
      </div>

      {/* FAQs List */}
      <div className="space-y-3">
        {filteredFaqs.length === 0 ? (
          <div className="bg-[#141B29] border border-white/[0.08] p-8 rounded-2xl text-center text-stone-400 text-xs">
            No FAQs found in this category. Click &ldquo;Add FAQ&rdquo; above to create one.
          </div>
        ) : (
          filteredFaqs.map((faq, index) => {
            const actualIndex = faqs.findIndex((f) => f.id === faq.id);
            return (
              <div
                key={faq.id}
                className={`bg-[#141B29] border rounded-2xl p-4 sm:p-5 shadow-xl transition-all ${
                  faq.isActive
                    ? "border-white/[0.08] hover:border-orange-500/30"
                    : "border-stone-800 opacity-60 bg-stone-900/40"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  {/* Left: Reorder + Content */}
                  <div className="flex items-start gap-3 min-w-0 flex-1">
                    {/* Reorder Buttons */}
                    <div className="flex flex-col gap-0.5 pt-0.5">
                      <button
                        type="button"
                        disabled={actualIndex === 0}
                        onClick={() => moveUp(actualIndex)}
                        className="p-1 rounded hover:bg-white/10 text-stone-400 hover:text-white disabled:opacity-20 cursor-pointer"
                        title="Move Up"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        disabled={actualIndex === faqs.length - 1}
                        onClick={() => moveDown(actualIndex)}
                        className="p-1 rounded hover:bg-white/10 text-stone-400 hover:text-white disabled:opacity-20 cursor-pointer"
                        title="Move Down"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="space-y-1.5 min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-orange-500/15 text-orange-400 border border-orange-500/25">
                          {faq.category}
                        </span>
                        <h4 className="text-sm font-bold text-white">
                          {faq.question}
                        </h4>
                      </div>
                      <p className="text-xs text-stone-300 leading-relaxed pl-0.5">
                        {faq.answer}
                      </p>
                    </div>
                  </div>

                  {/* Right Actions */}
                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-start">
                    <button
                      type="button"
                      onClick={() => toggleActive(faq.id)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                        faq.isActive
                          ? "bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30"
                          : "bg-stone-800 text-stone-500 hover:bg-stone-700"
                      }`}
                    >
                      {faq.isActive ? "Active" : "Hidden"}
                    </button>

                    <button
                      type="button"
                      onClick={() => openEditModal(faq)}
                      className="p-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-stone-300 hover:text-white transition-all cursor-pointer"
                      title="Edit FAQ"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => deleteFaq(faq.id)}
                      className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-all cursor-pointer"
                      title="Delete FAQ"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && editingFaq && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg bg-[#141B29] border border-white/[0.1] rounded-2xl p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-orange-400" />
              {faqs.some((f) => f.id === editingFaq.id) ? "Edit Store FAQ" : "Add New Store FAQ"}
            </h3>

            {/* Question */}
            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1">
                FAQ Question *
              </label>
              <input
                type="text"
                value={editingFaq.question}
                onChange={(e) => setEditingFaq({ ...editingFaq, question: e.target.value })}
                placeholder="e.g. What is your return or replacement policy?"
                className="w-full bg-[#182030] border border-stone-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
              />
            </div>

            {/* Category Dropdown */}
            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1">
                Category
              </label>
              <select
                value={editingFaq.category}
                onChange={(e) => setEditingFaq({ ...editingFaq, category: e.target.value as any })}
                className="w-full bg-[#182030] border border-stone-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
              >
                <option value="Shipping & Delivery">Shipping &amp; Delivery</option>
                <option value="Returns & Exchanges">Returns &amp; Exchanges</option>
                <option value="Orders & Bulk">Orders &amp; Bulk</option>
                <option value="Product Quality">Product Quality</option>
                <option value="General">General</option>
              </select>
            </div>

            {/* Answer */}
            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1">
                Answer *
              </label>
              <textarea
                rows={4}
                value={editingFaq.answer}
                onChange={(e) => setEditingFaq({ ...editingFaq, answer: e.target.value })}
                placeholder="Provide a clear, detailed, and helpful answer for your customers..."
                className="w-full bg-[#182030] border border-stone-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
              />
            </div>

            {/* Active Switch */}
            <div className="flex items-center justify-between pt-1">
              <span className="text-xs text-stone-300 font-medium">Show this FAQ on website</span>
              <button
                type="button"
                onClick={() => setEditingFaq({ ...editingFaq, isActive: !editingFaq.isActive })}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  editingFaq.isActive
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                    : "bg-stone-800 text-stone-500 border border-stone-700"
                }`}
              >
                {editingFaq.isActive ? "Active (Visible)" : "Hidden"}
              </button>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/[0.08]">
              <button
                type="button"
                onClick={() => {
                  setIsModalOpen(false);
                  setEditingFaq(null);
                }}
                className="px-4 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-xs font-semibold text-stone-400 hover:text-white transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={saveModalItem}
                className="px-5 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs transition-all shadow-md shadow-orange-500/20 cursor-pointer"
              >
                Save FAQ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
