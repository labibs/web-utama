import React, { useState, useEffect } from "react";
import { databases, storage } from "../lib/appwrite";
import { ID, Query } from "appwrite";
import { Plus, Trash2, Edit2, Upload, Save, Loader2, MessageSquare } from "lucide-react";

const TestimonialsAdmin = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [uploading, setLoadingUpload] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    role: "",
    comment: "",
    avatar_url: "",
  });

  const ENDPOINT = import.meta.env.VITE_APPWRITE_ENDPOINT;
  const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID;
  const DB_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
  const COL_ID = import.meta.env.VITE_APPWRITE_TESTIMONIALS_COLLECTION_ID;
  const BUCKET_ID = import.meta.env.VITE_APPWRITE_BUCKET_ID;

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const response = await databases.listDocuments(DB_ID, COL_ID, [
        Query.orderDesc("$createdAt")
      ]);
      setTestimonials(response.documents);
    } catch (error) {
      console.error("Error fetching testimonials:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoadingUpload(true);
    try {
      const uploadedFile = await storage.createFile(BUCKET_ID, ID.unique(), file);
      const fileUrl = ENDPOINT + "/storage/buckets/" + BUCKET_ID + "/files/" + uploadedFile.$id + "/view?project=" + PROJECT_ID;
      setFormData({ ...formData, avatar_url: fileUrl });
    } catch (error) {
      alert("Gagal unggah foto: " + error.message);
    } finally {
      setLoadingUpload(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isEditing) {
        await databases.updateDocument(DB_ID, COL_ID, currentId, formData);
      } else {
        await databases.createDocument(DB_ID, COL_ID, ID.unique(), formData);
      }
      resetForm();
      fetchTestimonials();
    } catch (error) {
      alert("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Hapus testimoni ini?")) return;
    try {
      await databases.deleteDocument(DB_ID, COL_ID, id);
      fetchTestimonials();
    } catch (error) {
      alert("Gagal menghapus: " + error.message);
    }
  };

  const resetForm = () => {
    setFormData({ name: "", role: "", comment: "", avatar_url: "" });
    setIsEditing(false);
    setCurrentId(null);
  };

  if (loading && testimonials.length === 0) return (
    <div className="flex justify-center items-center h-64"><Loader2 className="animate-spin text-p1" size={40} /></div>
  );

  return (
    <div className="space-y-10">
      <div className="bg-[#0C1838] border border-[#334679] rounded-3xl p-8 shadow-500">
        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
          {isEditing ? <Edit2 size={20} /> : <Plus size={20} />} {isEditing ? "Edit Testimoni" : "Tambah Testimoni Baru"}
        </h3>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-p5 mb-2">Nama Klien</label>
              <input type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full bg-[#05091D] border border-[#334679] rounded-xl px-4 py-3 focus:border-p1 outline-none transition-all" />
            </div>
            <div>
              <label className="block text-sm text-p5 mb-2">Jabatan / Role</label>
              <input type="text" required value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})} className="w-full bg-[#05091D] border border-[#334679] rounded-xl px-4 py-3 focus:border-p1 outline-none transition-all" />
            </div>
            <div>
              <label className="block text-sm text-p5 mb-2">Komentar / Quote</label>
              <textarea rows="4" required value={formData.comment} onChange={(e) => setFormData({...formData, comment: e.target.value})} className="w-full bg-[#05091D] border border-[#334679] rounded-xl px-4 py-3 focus:border-p1 outline-none transition-all" />
            </div>
          </div>
          <div className="space-y-6">
            <div>
              <label className="block text-sm text-p5 mb-2">Foto Profil (Avatar)</label>
              <div className="flex items-center gap-6">
                {formData.avatar_url && <img src={formData.avatar_url} className="size-24 rounded-full border-2 border-s2 object-cover bg-s2/30" />}
                <label className="flex-1 cursor-pointer border-2 border-dashed border-[#334679] rounded-xl p-8 hover:border-p1 transition-all flex flex-col items-center justify-center gap-2">
                  <Upload size={24} /><span className="text-sm text-p5">Klik untuk Upload Foto</span>
                  <input type="file" className="hidden" onChange={handleFileUpload} accept="image/*" />
                </label>
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <button type="submit" disabled={loading || uploading} className="flex-1 bg-p1 text-s1 font-bold py-3 rounded-xl hover:bg-white transition-all flex items-center justify-center gap-2 disabled:opacity-50">
                <Save size={20} /> {isEditing ? "Simpan Perubahan" : "Simpan Testimoni"}
              </button>
              {isEditing && <button type="button" onClick={resetForm} className="px-6 border border-[#334679] rounded-xl hover:bg-red-500/10 hover:text-red-400 transition-all">Batal</button>}
            </div>
          </div>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {testimonials.map((t) => (
          <div key={t.$id} className="bg-[#0C1838] border border-[#334679] rounded-3xl p-6 group hover:border-p1/50 transition-all">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-4">
                <img src={t.avatar_url} className="size-12 rounded-full object-cover border border-s3" />
                <div>
                  <h4 className="font-bold text-base leading-tight">{t.name}</h4>
                  <p className="text-[10px] text-p1 uppercase tracking-wider">{t.role}</p>
                </div>
              </div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => { setIsEditing(true); setCurrentId(t.$id); setFormData({ name: t.name, role: t.role, comment: t.comment, avatar_url: t.avatar_url }); window.scrollTo({top: 0, behavior: 'smooth'}); }} className="p-2 text-p1 hover:bg-p1/10 rounded-lg"><Edit2 size={14} /></button>
                <button onClick={() => handleDelete(t.$id)} className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg"><Trash2 size={14} /></button>
              </div>
            </div>
            <p className="text-sm text-p5 italic opacity-80 leading-relaxed">&quot;{t.comment}&quot;</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TestimonialsAdmin;
