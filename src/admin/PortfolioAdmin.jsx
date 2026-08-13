import React, { useState, useEffect } from "react";
import { databases, storage } from "../lib/appwrite";
import { ID, Query } from "appwrite";
import { Plus, Trash2, Edit2, Upload, Save, Loader2, X } from "lucide-react";
import Button from "../components/Button";

const PortfolioAdmin = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [uploading, setLoadingUpload] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
    logo_url: "",
    screenshot_url: "",
    gallery_urls: [],
  });

  const ENDPOINT = import.meta.env.VITE_APPWRITE_ENDPOINT;
  const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID;
  const DB_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
  const COL_ID = import.meta.env.VITE_APPWRITE_PORTFOLIO_COLLECTION_ID;
  const BUCKET_ID = import.meta.env.VITE_APPWRITE_BUCKET_ID;

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await databases.listDocuments(DB_ID, COL_ID, [
        Query.orderDesc("$createdAt")
      ]);
      setProjects(response.documents);
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e, type) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setLoadingUpload(true);
    try {
      if (type === "gallery") {
        const newUrls = [...formData.gallery_urls];
        for (const file of files) {
          if (newUrls.length >= 5) break;
          const uploadedFile = await storage.createFile(BUCKET_ID, ID.unique(), file);
          const fileUrl = ENDPOINT + "/storage/buckets/" + BUCKET_ID + "/files/" + uploadedFile.$id + "/view?project=" + PROJECT_ID;
          newUrls.push(fileUrl);
        }
        setFormData({ ...formData, gallery_urls: newUrls });
      } else {
        const uploadedFile = await storage.createFile(BUCKET_ID, ID.unique(), files[0]);
        const fileUrl = ENDPOINT + "/storage/buckets/" + BUCKET_ID + "/files/" + uploadedFile.$id + "/view?project=" + PROJECT_ID;
        if (type === "logo") setFormData({ ...formData, logo_url: fileUrl });
        else if (type === "screenshot") setFormData({ ...formData, screenshot_url: fileUrl });
      }
    } catch (error) {
      alert("Gagal unggah: " + error.message);
    } finally {
      setLoadingUpload(false);
    }
  };

  const removeGalleryImage = (index) => {
    const updatedGallery = formData.gallery_urls.filter((_, i) => i !== index);
    setFormData({ ...formData, gallery_urls: updatedGallery });
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
      fetchProjects();
    } catch (error) {
      alert("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Hapus projek ini?")) return;
    try {
      await databases.deleteDocument(DB_ID, COL_ID, id);
      fetchProjects();
    } catch (error) {
      alert("Gagal menghapus: " + error.message);
    }
  };

  const resetForm = () => {
    setFormData({ title: "", category: "", description: "", logo_url: "", screenshot_url: "", gallery_urls: [] });
    setIsEditing(false);
    setCurrentId(null);
  };

  if (loading && projects.length === 0) return (
    <div className="flex justify-center items-center h-64"><Loader2 className="animate-spin text-p1" size={40} /></div>
  );

  return (
    <div className="space-y-10 pb-20">
      <div className="bg-[#0C1838] border border-[#334679] rounded-3xl p-8 shadow-500">
        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">{isEditing ? <Edit2 size={20} /> : <Plus size={20} />} {isEditing ? "Edit Projek" : "Tambah Projek Baru"}</h3>
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div><label className="block text-sm text-p5 mb-2">Nama Projek</label><input type="text" required value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="w-full bg-[#05091D] border border-[#334679] rounded-xl px-4 py-3 focus:border-p1 outline-none transition-all" /></div>
              <div><label className="block text-sm text-p5 mb-2">Kategori</label><input type="text" required value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} className="w-full bg-[#05091D] border border-[#334679] rounded-xl px-4 py-3 focus:border-p1 outline-none transition-all" /></div>
              <div><label className="block text-sm text-p5 mb-2">Deskripsi</label><textarea rows="4" required value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full bg-[#05091D] border border-[#334679] rounded-xl px-4 py-3 focus:border-p1 outline-none transition-all" /></div>
            </div>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-p5 mb-2">Logo Projek</label>
                  <div className="flex flex-col gap-3">
                    {formData.logo_url && <img src={formData.logo_url} className="w-16 h-16 object-contain bg-white/10 rounded-lg p-2" />}
                    <label className="cursor-pointer border-2 border-dashed border-[#334679] rounded-xl p-3 hover:border-p1 transition-all flex flex-col items-center justify-center gap-2 text-center">
                      <Upload size={16} /><span className="text-[10px] text-p5">Upload Logo</span>
                      <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, "logo")} accept="image/*" />
                    </label>
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-p5 mb-2">Screenshot Utama</label>
                  <div className="flex flex-col gap-3">
                    {formData.screenshot_url && <img src={formData.screenshot_url} className="w-full h-16 object-cover rounded-lg border border-[#334679]" />}
                    <label className="cursor-pointer border-2 border-dashed border-[#334679] rounded-xl p-3 hover:border-p1 transition-all flex flex-col items-center justify-center gap-2 text-center">
                      <Upload size={16} /><span className="text-[10px] text-p5">Upload Main</span>
                      <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, "screenshot")} accept="image/*" />
                    </label>
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm text-p5 mb-2">Galeri Projek (Maksimal 5)</label>
                <div className="grid grid-cols-5 gap-3 mb-4">
                  {formData.gallery_urls.map((url, idx) => (
                    <div key={idx} className="relative group aspect-square rounded-lg overflow-hidden border border-[#334679]">
                      <img src={url} className="w-full h-full object-cover" />
                      <button type="button" onClick={() => removeGalleryImage(idx)} className="absolute top-1 right-1 p-1 bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"><X size={10} /></button>
                    </div>
                  ))}
                  {formData.gallery_urls.length < 5 && (
                    <label className="cursor-pointer border-2 border-dashed border-[#334679] rounded-lg aspect-square flex flex-col items-center justify-center gap-1 hover:border-p1 transition-all">
                      <Plus size={16} className="text-p5" /><span className="text-[8px] text-p5 uppercase">Add</span>
                      <input type="file" multiple className="hidden" onChange={(e) => handleFileUpload(e, "gallery")} accept="image/*" />
                    </label>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="flex gap-3 pt-4 border-t border-[#334679]">
            <button type="submit" disabled={loading || uploading} className="flex-1 bg-p1 text-s1 font-bold py-3 rounded-xl hover:bg-white transition-all flex items-center justify-center gap-2 disabled:opacity-50">
              <Save size={20} /> {isEditing ? "Simpan Perubahan" : "Simpan Projek"}
            </button>
            {isEditing && <button type="button" onClick={resetForm} className="px-6 border border-[#334679] rounded-xl hover:bg-red-500/10 hover:text-red-400 transition-all">Batal</button>}
          </div>
        </form>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div key={project.$id} className="bg-[#0C1838] border border-[#334679] rounded-3xl overflow-hidden group hover:border-p1/50 transition-all">
            <div className="relative h-40">
              <img src={project.screenshot_url} className="w-full h-full object-cover" alt="preview" />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                <button onClick={() => { setIsEditing(true); setCurrentId(project.$id); setFormData({ title: project.title, category: project.category, description: project.description, logo_url: project.logo_url, screenshot_url: project.screenshot_url, gallery_urls: project.gallery_urls || [] }); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="p-3 bg-p1 rounded-full text-s1 hover:scale-110 transition-transform"><Edit2 size={18} /></button>
                <button onClick={() => handleDelete(project.$id)} className="p-3 bg-red-500 rounded-full text-white hover:scale-110 transition-transform"><Trash2 size={18} /></button>
              </div>
            </div>
            <div className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <img src={project.logo_url} className="w-8 h-8 object-contain bg-white/5 rounded p-1" alt="logo" />
                <span className="text-[10px] uppercase tracking-wider text-p1 bg-p1/10 px-2 py-0.5 rounded-full border border-p1/20">{project.category}</span>
              </div>
              <h4 className="font-bold text-lg">{project.title}</h4>
              <p className="text-[10px] text-p5 mt-2">{project.gallery_urls?.length || 0} Gambar Galeri</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PortfolioAdmin;
