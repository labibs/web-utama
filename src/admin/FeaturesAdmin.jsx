import React, { useState, useEffect } from "react";
import { databases, storage } from "../lib/appwrite";
import { ID, Query } from "appwrite";
import { Plus, Trash2, Edit2, Upload, Save, Loader2, Zap } from "lucide-react";

const FeaturesAdmin = () => {
  const [features, setFeatures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [uploading, setLoadingUpload] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    caption: "",
    text: "",
    icon: "",
    button_title: "",
    button_icon: "",
  });

  const ENDPOINT = import.meta.env.VITE_APPWRITE_ENDPOINT;
  const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID;
  const DB_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
  const COL_ID = import.meta.env.VITE_APPWRITE_FEATURES_COLLECTION_ID;
  const BUCKET_ID = import.meta.env.VITE_APPWRITE_BUCKET_ID;

  useEffect(() => {
    fetchFeatures();
  }, []);

  const fetchFeatures = async () => {
    try {
      const response = await databases.listDocuments(DB_ID, COL_ID);
      setFeatures(response.documents);
    } catch (error) {
      console.error("Error fetching features:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;
    setLoadingUpload(true);
    try {
      const uploadedFile = await storage.createFile(BUCKET_ID, ID.unique(), file);
      const fileUrl = ENDPOINT + "/storage/buckets/" + BUCKET_ID + "/files/" + uploadedFile.$id + "/view?project=" + PROJECT_ID;
      if (type === "icon") setFormData({ ...formData, icon: fileUrl });
      else setFormData({ ...formData, button_icon: fileUrl });
    } catch (error) {
      alert("Gagal: " + error.message);
    } finally {
      setLoadingUpload(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isEditing) await databases.updateDocument(DB_ID, COL_ID, currentId, formData);
      else await databases.createDocument(DB_ID, COL_ID, ID.unique(), formData);
      resetForm();
      fetchFeatures();
    } catch (error) {
      alert("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({ title: "", caption: "", text: "", icon: "", button_title: "", button_icon: "" });
    setIsEditing(false);
    setCurrentId(null);
  };

  if (loading && features.length === 0) return <div className="flex justify-center items-center h-64"><Loader2 className="animate-spin text-p1" size={40} /></div>;

  return (
    <div className="space-y-10">
      <div className="bg-[#0C1838] border border-[#334679] rounded-3xl p-8 shadow-500">
        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">{isEditing ? <Edit2 size={20} /> : <Plus size={20} />} {isEditing ? "Edit Layanan" : "Tambah Layanan Baru"}</h3>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <input type="text" required placeholder="Judul" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="w-full bg-[#05091D] border border-[#334679] rounded-xl px-4 py-3" />
            <input type="text" required placeholder="Caption" value={formData.caption} onChange={(e) => setFormData({...formData, caption: e.target.value})} className="w-full bg-[#05091D] border border-[#334679] rounded-xl px-4 py-3" />
            <textarea rows="4" required placeholder="Deskripsi" value={formData.text} onChange={(e) => setFormData({...formData, text: e.target.value})} className="w-full bg-[#05091D] border border-[#334679] rounded-xl px-4 py-3" />
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              {formData.icon && <img src={formData.icon} className="w-12 h-12" />}
              <label className="flex-1 cursor-pointer border-2 border-dashed border-[#334679] rounded-xl p-3 text-center">
                Upload Icon Layanan
                <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, "icon")} accept="image/*" />
              </label>
            </div>
            <input type="text" required placeholder="Teks Tombol" value={formData.button_title} onChange={(e) => setFormData({...formData, button_title: e.target.value})} className="w-full bg-[#05091D] border border-[#334679] rounded-xl px-4 py-3" />
            <div className="flex items-center gap-4">
              {formData.button_icon && <img src={formData.button_icon} className="w-12 h-12" />}
              <label className="flex-1 cursor-pointer border-2 border-dashed border-[#334679] rounded-xl p-3 text-center">
                Upload Icon Tombol
                <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, "btn")} accept="image/*" />
              </label>
            </div>
            <button type="submit" disabled={uploading} className="w-full bg-p1 text-s1 font-bold py-3 rounded-xl flex items-center justify-center gap-2"><Save size={20} /> Simpan</button>
          </div>
        </form>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {features.map((f) => (
          <div key={f.$id} className="bg-[#0C1838] border border-[#334679] rounded-2xl p-6 flex justify-between items-center group">
            <div className="flex items-center gap-4">
              <img src={f.icon} className="w-12 h-12" />
              <div><h4 className="font-bold">{f.title}</h4><p className="text-xs text-p5 opacity-60">{f.caption}</p></div>
            </div>
            <div className="flex gap-2 opacity-0 group-hover:opacity-100">
              <button onClick={() => { setIsEditing(true); setCurrentId(f.$id); setFormData({ title: f.title, caption: f.caption, text: f.text, icon: f.icon, button_title: f.button_title, button_icon: f.button_icon }); }} className="p-2 text-p1"><Edit2 size={16} /></button>
              <button onClick={async () => { if(confirm("Hapus?")) { await databases.deleteDocument(DB_ID, COL_ID, f.$id); fetchFeatures(); } }} className="p-2 text-red-500"><Trash2 size={16} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturesAdmin;
