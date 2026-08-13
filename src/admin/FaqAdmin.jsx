import React, { useState, useEffect } from "react";
import { databases } from "../lib/appwrite";
import { ID, Query } from "appwrite";
import { Plus, Trash2, Edit2, Save, Loader2, HelpCircle } from "lucide-react";

const FaqAdmin = () => {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);

  const [formData, setFormData] = useState({
    question: "",
    answer: "",
    order: 0,
  });

  const DB_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
  const COL_ID = import.meta.env.VITE_APPWRITE_FAQ_COLLECTION_ID;

  useEffect(() => {
    fetchFaqs();
  }, []);

  const fetchFaqs = async () => {
    try {
      const response = await databases.listDocuments(DB_ID, COL_ID, [
        Query.orderAsc("order")
      ]);
      setFaqs(response.documents);
    } catch (error) {
      console.error("Error fetching FAQs:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const submissionData = { ...formData, order: parseInt(formData.order) };
      if (isEditing) {
        await databases.updateDocument(DB_ID, COL_ID, currentId, submissionData);
      } else {
        await databases.createDocument(DB_ID, COL_ID, ID.unique(), submissionData);
      }
      resetForm();
      fetchFaqs();
    } catch (error) {
      alert("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Hapus pertanyaan ini?")) return;
    try {
      await databases.deleteDocument(DB_ID, COL_ID, id);
      fetchFaqs();
    } catch (error) {
      alert("Gagal menghapus: " + error.message);
    }
  };

  const resetForm = () => {
    setFormData({ question: "", answer: "", order: faqs.length });
    setIsEditing(false);
    setCurrentId(null);
  };

  if (loading && faqs.length === 0) return (
    <div className="flex justify-center items-center h-64"><Loader2 className="animate-spin text-p1" size={40} /></div>
  );

  return (
    <div className="space-y-10">
      <div className="bg-[#0C1838] border border-[#334679] rounded-3xl p-8 shadow-500">
        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
          {isEditing ? <Edit2 size={20} /> : <Plus size={20} />} {isEditing ? "Edit FAQ" : "Tambah FAQ Baru"}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-sm text-p5 mb-2">Pertanyaan</label>
              <input type="text" required value={formData.question} onChange={(e) => setFormData({...formData, question: e.target.value})} className="w-full bg-[#05091D] border border-[#334679] rounded-xl px-4 py-3 focus:border-p1 outline-none transition-all" />
            </div>
            <div>
              <label className="block text-sm text-p5 mb-2">Jawaban</label>
              <textarea rows="4" required value={formData.answer} onChange={(e) => setFormData({...formData, answer: e.target.value})} className="w-full bg-[#05091D] border border-[#334679] rounded-xl px-4 py-3 focus:border-p1 outline-none transition-all" />
            </div>
            <div className="w-32">
              <label className="block text-sm text-p5 mb-2">Urutan</label>
              <input type="number" value={formData.order} onChange={(e) => setFormData({...formData, order: e.target.value})} className="w-full bg-[#05091D] border border-[#334679] rounded-xl px-4 py-3 focus:border-p1 outline-none transition-all" />
            </div>
          </div>
          <div className="flex gap-3 pt-4 border-t border-[#334679]">
            <button type="submit" disabled={loading} className="flex-1 bg-p1 text-s1 font-bold py-3 rounded-xl hover:bg-white transition-all flex items-center justify-center gap-2">
              <Save size={20} /> {isEditing ? "Simpan Perubahan" : "Simpan FAQ"}
            </button>
            {isEditing && <button type="button" onClick={resetForm} className="px-6 border border-[#334679] rounded-xl hover:bg-red-500/10 hover:text-red-400 transition-all">Batal</button>}
          </div>
        </form>
      </div>

      <div className="space-y-4">
        {faqs.map((faq) => (
          <div key={faq.$id} className="bg-[#0C1838] border border-[#334679] rounded-2xl p-6 flex items-start justify-between group">
            <div className="flex-1 pr-10">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-[10px] text-p1 bg-p1/10 px-2 py-0.5 rounded border border-p1/20">Urutan: {faq.order}</span>
                <h4 className="font-bold text-lg">{faq.question}</h4>
              </div>
              <p className="text-sm text-p5 opacity-70 line-clamp-2">{faq.answer}</p>
            </div>
            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => { setIsEditing(true); setCurrentId(faq.$id); setFormData({ question: faq.question, answer: faq.answer, order: faq.order }); window.scrollTo({top: 0, behavior: 'smooth'}); }} className="p-2 bg-[#05091D] border border-[#334679] rounded-lg text-p1 hover:border-p1 transition-all"><Edit2 size={16} /></button>
              <button onClick={() => handleDelete(faq.$id)} className="p-2 bg-[#05091D] border border-[#334679] rounded-lg text-red-500 hover:border-red-500 transition-all"><Trash2 size={16} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FaqAdmin;
