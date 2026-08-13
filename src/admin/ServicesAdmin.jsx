import React, { useState, useEffect } from "react";
import { databases } from "../lib/appwrite";
import { ID, Query } from "appwrite";
import { Plus, Trash2, Edit2, Save, Loader2, ListPlus, X } from "lucide-react";

const ServicesAdmin = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [newFeature, setNewFeature] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    caption: "",
    price: 0,
    priceOriginal: 0,
    features: [],
    isCorporate: false,
  });

  const DB_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
  const COL_ID = import.meta.env.VITE_APPWRITE_SERVICES_COLLECTION_ID;

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await databases.listDocuments(DB_ID, COL_ID, [
        Query.orderAsc("$createdAt")
      ]);
      setServices(response.documents);
    } catch (error) {
      console.error("Error fetching services:", error);
    } finally {
      setLoading(false);
    }
  };

  const addFeature = () => {
    if (!newFeature.trim()) return;
    setFormData({ ...formData, features: [...formData.features, newFeature.trim()] });
    setNewFeature("");
  };

  const removeFeature = (index) => {
    const updated = formData.features.filter((_, i) => i !== index);
    setFormData({ ...formData, features: updated });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Convert price fields to float just in case
      const submissionData = {
        ...formData,
        price: parseFloat(formData.price),
        priceOriginal: parseFloat(formData.priceOriginal),
      };

      if (isEditing) {
        await databases.updateDocument(DB_ID, COL_ID, currentId, submissionData);
      } else {
        await databases.createDocument(DB_ID, COL_ID, ID.unique(), submissionData);
      }
      resetForm();
      fetchServices();
    } catch (error) {
      alert("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Hapus layanan ini?")) return;
    try {
      await databases.deleteDocument(DB_ID, COL_ID, id);
      fetchServices();
    } catch (error) {
      alert("Gagal menghapus: " + error.message);
    }
  };

  const resetForm = () => {
    setFormData({ title: "", caption: "", price: 0, priceOriginal: 0, features: [], isCorporate: false });
    setIsEditing(false);
    setCurrentId(null);
  };

  if (loading && services.length === 0) return (
    <div className="flex justify-center items-center h-64"><Loader2 className="animate-spin text-p1" size={40} /></div>
  );

  return (
    <div className="space-y-10 pb-20">
      <div className="bg-[#0C1838] border border-[#334679] rounded-3xl p-8 shadow-500">
        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
          {isEditing ? <Edit2 size={20} /> : <Plus size={20} />}
          {isEditing ? "Edit Layanan" : "Tambah Layanan Baru"}
        </h3>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-p5 mb-2">Nama Layanan / Tier</label>
                <input type="text" required value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="w-full bg-[#05091D] border border-[#334679] rounded-xl px-4 py-3 focus:border-p1 outline-none transition-all" placeholder="Contoh: Landing Page" />
              </div>
              <div>
                <label className="block text-sm text-p5 mb-2">Caption Singkat</label>
                <input type="text" required value={formData.caption} onChange={(e) => setFormData({...formData, caption: e.target.value})} className="w-full bg-[#05091D] border border-[#334679] rounded-xl px-4 py-3 focus:border-p1 outline-none transition-all" placeholder="Contoh: Personal & Portfolio" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-p5 mb-2">Harga (Jt)</label>
                  <input type="number" step="0.1" required value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} className="w-full bg-[#05091D] border border-[#334679] rounded-xl px-4 py-3 focus:border-p1 outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-sm text-p5 mb-2">Harga Asli (Jt)</label>
                  <input type="number" step="0.1" required value={formData.priceOriginal} onChange={(e) => setFormData({...formData, priceOriginal: e.target.value})} className="w-full bg-[#05091D] border border-[#334679] rounded-xl px-4 py-3 focus:border-p1 outline-none transition-all" />
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-[#05091D] rounded-xl border border-[#334679]">
                <input type="checkbox" id="corp" checked={formData.isCorporate} onChange={(e) => setFormData({...formData, isCorporate: e.target.checked})} className="size-5 rounded border-s3 bg-s1 text-p1 focus:ring-p1" />
                <label htmlFor="corp" className="text-sm text-p5 cursor-pointer">Centang jika ini Paket **Corporate**</label>
              </div>
            </div>

            <div className="space-y-4">
              <label className="block text-sm text-p5 mb-2">Fitur Layanan</label>
              <div className="flex gap-2">
                <input type="text" value={newFeature} onChange={(e) => setNewFeature(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())} className="flex-1 bg-[#05091D] border border-[#334679] rounded-xl px-4 py-3 focus:border-p1 outline-none transition-all" placeholder="Tambah fitur..." />
                <button type="button" onClick={addFeature} className="p-3 bg-[#334679] rounded-xl hover:bg-p1 hover:text-s1 transition-all"><ListPlus size={24} /></button>
              </div>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-2 scroll-hide">
                {formData.features.map((f, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-[#05091D] border border-[#334679] rounded-lg group">
                    <span className="text-sm">{f}</span>
                    <button type="button" onClick={() => removeFeature(idx)} className="text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"><X size={16} /></button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t border-[#334679]">
            <button type="submit" disabled={loading} className="flex-1 bg-p1 text-s1 font-bold py-3 rounded-xl hover:bg-white transition-all flex items-center justify-center gap-2 disabled:opacity-50">
              <Save size={20} /> {isEditing ? "Perbarui Layanan" : "Simpan Layanan"}
            </button>
            {isEditing && <button type="button" onClick={resetForm} className="px-6 border border-[#334679] rounded-xl hover:bg-red-500/10 hover:text-red-400 transition-all">Batal</button>}
          </div>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div>
          <h4 className="text-p1 font-bold mb-4 uppercase tracking-widest text-sm flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-p1"></span> Paket Individu
          </h4>
          <div className="space-y-4">
            {services.filter(s => !s.isCorporate).map(service => (
              <ServiceCard key={service.$id} service={service} onEdit={() => { setIsEditing(true); setCurrentId(service.$id); setFormData({ title: service.title, caption: service.caption, price: service.price, priceOriginal: service.priceOriginal, features: service.features || [], isCorporate: service.isCorporate }); window.scrollTo({top: 0, behavior: 'smooth'}); }} onDelete={() => handleDelete(service.$id)} />
            ))}
          </div>
        </div>
        <div>
          <h4 className="text-p3 font-bold mb-4 uppercase tracking-widest text-sm flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-p3"></span> Paket Corporate
          </h4>
          <div className="space-y-4">
            {services.filter(s => s.isCorporate).map(service => (
              <ServiceCard key={service.$id} service={service} onEdit={() => { setIsEditing(true); setCurrentId(service.$id); setFormData({ title: service.title, caption: service.caption, price: service.price, priceOriginal: service.priceOriginal, features: service.features || [], isCorporate: service.isCorporate }); window.scrollTo({top: 0, behavior: 'smooth'}); }} onDelete={() => handleDelete(service.$id)} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const ServiceCard = ({ service, onEdit, onDelete }) => (
  <div className="bg-[#0C1838] border border-[#334679] rounded-2xl p-6 flex items-center justify-between group hover:border-p1/40 transition-all shadow-md">
    <div className="flex-1">
      <div className="flex items-center gap-2 mb-1">
        <h5 className="font-bold text-lg">{service.title}</h5>
        <span className="text-[10px] text-p5 opacity-60">Rp {service.price} Jt</span>
      </div>
      <p className="text-xs text-p5 opacity-70 line-clamp-1">{service.caption}</p>
      <p className="text-[10px] text-p1 mt-1">{service.features?.length || 0} Fitur Terdaftar</p>
    </div>
    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
      <button onClick={onEdit} className="p-2 bg-[#05091D] border border-[#334679] rounded-lg text-p1 hover:border-p1 transition-all"><Edit2 size={16} /></button>
      <button onClick={onDelete} className="p-2 bg-[#05091D] border border-[#334679] rounded-lg text-red-500 hover:border-red-500 transition-all"><Trash2 size={16} /></button>
    </div>
  </div>
);

export default ServicesAdmin;
