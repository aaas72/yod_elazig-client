import React, { useEffect, useState, useCallback } from 'react';
import { galleryService, type GalleryAlbum } from '@/services/galleryService';
import AdminModal from '@/components/admin/AdminModal';
import { Edit, Trash2, Plus, Image, X, Eye } from 'lucide-react';
import toast from 'react-hot-toast';

type AlbumItem = GalleryAlbum;

export default function AdminGalleryPage() {
  const [albums, setAlbums] = useState<AlbumItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [photosModalOpen, setPhotosModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<AlbumItem | null>(null);
  const [selectedAlbum, setSelectedAlbum] = useState<AlbumItem | null>(null);
  const [saving, setSaving] = useState(false);
  const [newPhotoUrl, setNewPhotoUrl] = useState('');
  const [newPhotoCaption, setNewPhotoCaption] = useState('');
  const [formData, setFormData] = useState({
    titleAr: '', titleEn: '', titleTr: '',
    descAr: '', descEn: '', descTr: '',
    coverImage: '',
  });

  const loadData = useCallback(async () => {
    try { setLoading(true); const data = await galleryService.getAll(); setAlbums(Array.isArray(data?.albums) ? data.albums : Array.isArray(data) ? data : []); } catch { toast.error('فشل التحميل'); } finally { setLoading(false); }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const openCreate = () => {
    setEditingItem(null);
    setFormData({ titleAr: '', titleEn: '', titleTr: '', descAr: '', descEn: '', descTr: '', coverImage: '' });
    setModalOpen(true);
  };

  const openEdit = (item: AlbumItem) => {
    setEditingItem(item);
    setFormData({
      titleAr: item.title.ar, titleEn: item.title.en, titleTr: item.title.tr,
      descAr: item.description?.ar || '', descEn: item.description?.en || '', descTr: item.description?.tr || '',
      coverImage: item.coverImage || '',
    });
    setModalOpen(true);
  };

  const openPhotos = (album: AlbumItem) => {
    setSelectedAlbum(album);
    setPhotosModalOpen(true);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const payload = {
        title: { ar: formData.titleAr, en: formData.titleEn, tr: formData.titleTr },
        description: { ar: formData.descAr, en: formData.descEn, tr: formData.descTr },
        coverImage: formData.coverImage,
      };
      if (editingItem) { await galleryService.updateAlbum(editingItem._id, payload); toast.success('تم التحديث'); }
      else { await galleryService.createAlbum(payload); toast.success('تم الإنشاء'); }
      setModalOpen(false); loadData();
    } catch (err: any) { toast.error(err.response?.data?.message || 'فشلت العملية'); } finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا الألبوم؟')) return;
    try { await galleryService.deleteAlbum(id); toast.success('تم الحذف'); loadData(); } catch { toast.error('فشل الحذف'); }
  };

  const handleAddPhoto = async () => {
    if (!selectedAlbum || !newPhotoUrl) return;
    try {
      await galleryService.addPhotos(selectedAlbum._id, [{ url: newPhotoUrl, caption: { ar: newPhotoCaption, en: newPhotoCaption, tr: newPhotoCaption } }]);
      toast.success('تم إضافة الصورة');
      setNewPhotoUrl(''); setNewPhotoCaption('');
      const updated = await galleryService.getById(selectedAlbum._id);
      setSelectedAlbum(updated);
      loadData();
    } catch { toast.error('فشل إضافة الصورة'); }
  };

  const handleRemovePhoto = async (photoId: string) => {
    if (!selectedAlbum) return;
    try {
      await galleryService.removePhoto(selectedAlbum._id, photoId);
      toast.success('تم حذف الصورة');
      const updated = await galleryService.getById(selectedAlbum._id);
      setSelectedAlbum(updated);
      loadData();
    } catch { toast.error('فشل حذف الصورة'); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">معرض الصور</h1>
          <p className="text-sm text-gray-500 mt-1">إدارة الألبومات والصور</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 px-5 py-2.5 bg-red-600 text-white rounded-xl text-sm font-medium hover:bg-red-700 transition-colors">
          <Plus size={16} />ألبوم جديد
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-red-200 border-t-red-600 rounded-full animate-spin" /></div>
      ) : albums.length === 0 ? (
        <div className="text-center py-20 text-gray-400"><Image size={48} className="mx-auto mb-4 opacity-50" /><p>لا توجد ألبومات بعد</p></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {albums.map((album) => (
            <div key={album._id} className="bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-lg transition-all group">
              <div className="relative h-48 bg-gray-100">
                {album.coverImage ? (
                  <img src={album.coverImage} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300"><Image size={48} /></div>
                )}
                <div className="absolute top-3 left-3 px-2.5 py-1 bg-black/60 text-white rounded-full text-xs">{album.photos?.length || 0} صورة</div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-800 mb-1">{album.title.ar || album.title.en}</h3>
                {album.description?.ar && <p className="text-sm text-gray-500 line-clamp-2 mb-3">{album.description.ar}</p>}
                <div className="flex items-center gap-2">
                  <button onClick={() => openPhotos(album)} className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-gray-50 hover:bg-blue-50 text-gray-600 hover:text-blue-600 rounded-lg text-sm transition-colors"><Eye size={14} />الصور</button>
                  <button onClick={() => openEdit(album)} className="p-2 hover:bg-gray-100 rounded-lg"><Edit size={15} className="text-blue-600" /></button>
                  <button onClick={() => handleDelete(album._id)} className="p-2 hover:bg-red-50 rounded-lg"><Trash2 size={15} className="text-red-500" /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Album Form Modal */}
      <AdminModal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingItem ? 'تعديل الألبوم' : 'إضافة ألبوم'} size="lg">
        <div className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div><label className="block text-sm font-medium text-gray-700 mb-1.5">العنوان (عربي) *</label><input value={formData.titleAr} onChange={(e) => setFormData({ ...formData, titleAr: e.target.value })} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-red-500" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1.5">العنوان (إنجليزي)</label><input value={formData.titleEn} onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-red-500" dir="ltr" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1.5">العنوان (تركي)</label><input value={formData.titleTr} onChange={(e) => setFormData({ ...formData, titleTr: e.target.value })} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-red-500" dir="ltr" /></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div><label className="block text-sm font-medium text-gray-700 mb-1.5">الوصف (عربي)</label><textarea value={formData.descAr} onChange={(e) => setFormData({ ...formData, descAr: e.target.value })} rows={3} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-red-500" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1.5">الوصف (إنجليزي)</label><textarea value={formData.descEn} onChange={(e) => setFormData({ ...formData, descEn: e.target.value })} rows={3} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-red-500" dir="ltr" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1.5">الوصف (تركي)</label><textarea value={formData.descTr} onChange={(e) => setFormData({ ...formData, descTr: e.target.value })} rows={3} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-red-500" dir="ltr" /></div>
          </div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1.5">صورة الغلاف</label><input value={formData.coverImage} onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none" dir="ltr" /></div>
          <div className="flex justify-end gap-3 pt-4 border-t"><button onClick={() => setModalOpen(false)} className="px-5 py-2.5 text-sm text-gray-600 hover:bg-gray-100 rounded-xl">إلغاء</button><button onClick={handleSave} disabled={saving} className="px-5 py-2.5 text-sm bg-red-600 text-white rounded-xl hover:bg-red-700 disabled:opacity-50">{saving ? 'جاري الحفظ...' : editingItem ? 'تحديث' : 'إنشاء'}</button></div>
        </div>
      </AdminModal>

      {/* Photos Management Modal */}
      <AdminModal isOpen={photosModalOpen} onClose={() => setPhotosModalOpen(false)} title={`صور: ${selectedAlbum?.title.ar || ''}`} size="xl">
        <div className="space-y-5">
          {/* Add Photo */}
          <div className="flex items-end gap-3 p-4 bg-gray-50 rounded-xl">
            <div className="flex-1"><label className="block text-xs font-medium text-gray-600 mb-1">رابط الصورة *</label><input value={newPhotoUrl} onChange={(e) => setNewPhotoUrl(e.target.value)} placeholder="https://..." className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none" dir="ltr" /></div>
            <div className="flex-1"><label className="block text-xs font-medium text-gray-600 mb-1">وصف</label><input value={newPhotoCaption} onChange={(e) => setNewPhotoCaption(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none" /></div>
            <button onClick={handleAddPhoto} disabled={!newPhotoUrl} className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 disabled:opacity-50"><Plus size={16} /></button>
          </div>

          {/* Photos Grid */}
          {selectedAlbum?.photos && selectedAlbum.photos.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {selectedAlbum.photos.map((photo: any) => (
                <div key={photo._id} className="relative group rounded-lg overflow-hidden bg-gray-100 aspect-square">
                  <img src={photo.url} alt={photo.caption || ''} className="w-full h-full object-cover" />
                  <button onClick={() => handleRemovePhoto(photo._id)} className="absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"><X size={12} /></button>
                  {photo.caption && <div className="absolute bottom-0 inset-x-0 bg-black/60 text-white text-xs p-2 opacity-0 group-hover:opacity-100 transition-opacity">{photo.caption}</div>}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 text-gray-400"><Image size={32} className="mx-auto mb-2 opacity-50" /><p className="text-sm">لا توجد صور في هذا الألبوم</p></div>
          )}
        </div>
      </AdminModal>
    </div>
  );
}
