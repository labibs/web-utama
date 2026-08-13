import React, { useState, useEffect } from "react";
import { databases, storage } from "../lib/appwrite";
import { ID, Query } from "appwrite";
import { Plus, Trash2, Edit2, Upload, Save, Loader2 } from "lucide-react";

const NebengAdmin = () => {
  const [screens, setScreens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [uploading, setLoadingUpload] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    text: "",
    image_url: "",
  });

  const ENDPOINT = import.meta.env.VITE_APPWRITE_ENDPOINT;
  const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID;
  const DB_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
  const COL_ID = import.meta.env.VITE_APPWRITE_NEBENG_COLLECTION_ID;
  const BUCKET_ID = import.meta.env.VITE_APPWRITE_BUCKET_ID;

  useEffect(() => {
    fetchScreens();
  }, []);

  const fetchScreens = async () => {
    try {
      const response = await databases.listDocuments(DB_ID, COL_ID, [
        Query.orderDesc("$createdAt"),
      ]);
      setScreens(response.documents);
    } catch (error) {
      console.error("Error fetching screens:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoadingUpload(true);
    try {
      const uploadedFile = await storage.createFile(
        BUCKET_ID,
        ID.unique(),
        file,
      );
      const fileUrl =
        ENDPOINT +
        "/storage/buckets/" +
        BUCKET_ID +
        "/files/" +
        uploadedFile.$id +
        "/view?project=" +
        PROJECT_ID;
      setFormData({ ...formData, image_url: fileUrl });
    } catch (error) {
      alert("Gagal unggah gambar: " + error.message);
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
      fetchScreens();
    } catch (error) {
      alert("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Hapus menu ini?")) return;
    try {
      await databases.deleteDocument(DB_ID, COL_ID, id);
      fetchScreens();
    } catch (error) {
      alert("Gagal menghapus: " + error.message);
    }
  };

  const resetForm = () => {
    setFormData({ title: "", text: "", image_url: "" });
    setIsEditing(false);
    setCurrentId(null);
  };

  if (loading && screens.length === 0)
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin text-p1" size={40} />
      </div>
    );

  return (
    <div className="space-y-10">
      <div className="bg-[#0C1838] border border-[#334679] rounded-3xl p-8 shadow-500">
        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
          {isEditing ? <Edit2 size={20} /> : <Plus size={20} />}
          {isEditing ? "Edit Menu Numpak" : "Tambah Menu Numpak Baru"}
        </h3>
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-p5 mb-2">Judul Menu</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="w-full bg-[#05091D] border border-[#334679] rounded-xl px-4 py-3 focus:border-p1 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm text-p5 mb-2">
                Penjelasan Menu
              </label>
              <textarea
                rows="6"
                required
                value={formData.text}
                onChange={(e) =>
                  setFormData({ ...formData, text: e.target.value })
                }
                className="w-full bg-[#05091D] border border-[#334679] rounded-xl px-4 py-3 focus:border-p1 outline-none transition-all"
              />
            </div>
          </div>
          <div className="space-y-6">
            <div>
              <label className="block text-sm text-p5 mb-2">
                Gambar Layar App
              </label>
              <div className="flex flex-col gap-4">
                {formData.image_url && (
                  <div className="flex justify-center bg-black/40 rounded-2xl p-4 border border-[#334679]">
                    <img
                      src={formData.image_url}
                      className="h-60 w-auto object-contain rounded-lg"
                      alt="preview"
                    />
                  </div>
                )}
                <label className="cursor-pointer border-2 border-dashed border-[#334679] rounded-xl p-8 hover:border-p1 transition-all flex flex-col items-center justify-center gap-2">
                  <Upload
                    size={24}
                    className={uploading ? "animate-bounce text-p1" : "text-p5"}
                  />
                  <span className="text-sm text-p5">
                    {uploading
                      ? "Sedang Mengunggah..."
                      : "Klik untuk Upload Screenshot App"}
                  </span>
                  <input
                    type="file"
                    className="hidden"
                    onChange={handleFileUpload}
                    accept="image/*"
                  />
                </label>
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={loading || uploading}
                className="flex-1 bg-p1 text-s1 font-bold py-3 rounded-xl hover:bg-white transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Save size={20} /> {isEditing ? "Perbarui Menu" : "Simpan Menu"}
              </button>
              {isEditing && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 border border-[#334679] rounded-xl hover:bg-red-500/10 hover:text-red-400 transition-all"
                >
                  Batal
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {screens.map((screen) => (
          <div
            key={screen.$id}
            className="bg-[#0C1838] border border-[#334679] rounded-3xl overflow-hidden group hover:border-p1/50 transition-all"
          >
            <div className="relative h-64 bg-black/20 flex justify-center p-4">
              <img
                src={screen.image_url}
                className="h-full w-auto object-contain"
                alt="screen"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                <button
                  onClick={() => {
                    setIsEditing(true);
                    setCurrentId(screen.$id);
                    setFormData({
                      title: screen.title,
                      text: screen.text,
                      image_url: screen.image_url,
                    });
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="p-3 bg-p1 rounded-full text-s1 hover:scale-110 transition-transform"
                >
                  <Edit2 size={18} />
                </button>
                <button
                  onClick={() => handleDelete(screen.$id)}
                  className="p-3 bg-red-500 rounded-full text-white hover:scale-110 transition-transform"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
            <div className="p-6">
              <h4 className="font-bold text-lg mb-2">{screen.title}</h4>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NebengAdmin;
