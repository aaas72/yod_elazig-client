import React, { useEffect, useState, useCallback, useRef } from 'react';
import { galleryService, type GalleryAlbum } from '@/services/galleryService';
import { uploadService } from '@/services/uploadService';
import { BASE_URL } from '@/lib/api';
import AdminModal from '@/components/admin/AdminModal';
import { Edit, Trash2, Plus, Image, X, Eye, Upload, Loader2 } from 'lucide-react';
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
  const [uploading, setUploading] = useState(false);
  const [photoUploading, setPhotoUploading] = useState(false);
  const [newPhotoUrl, setNewPhotoUrl] = useState('');
  const [newPhotoCaption, setNewPhotoCaption] = useState('');
  
  const coverImageInputRef = useRef<HTMLInputElement>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    titleAr: '', titleEn: '', titleTr: '',
    descAr: '', descEn: '', descTr: '',
    coverImage: '',
    isPublished: false,
    order: '0'
  });

  const loadData = useCallback(async () => {
    try { setLoading(true); const data = await galleryService.getAll(); setAlbums(Array.isArray(data?.albums) ? data.albums : Array.isArray(data) ? data : []); } catch { toast.error('فشل التحميل'); } finally { setLoading(false); }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const openCreate = () => {
    setEditingItem(null);
    setFormData({ titleAr: '', titleEn: '', titleTr: '', descAr: '', descEn: '', descTr: '', coverImage: '', isPublished: true, order: String(albums.length) });
    setModalOpen(true);
  };

  const openEdit = (item: AlbumItem) => {
    setEditingItem(item);
    setFormData({
      titleAr: item.title.ar, titleEn: item.title.en, titleTr: item.title.tr,
      descAr: item.description?.ar || '', descEn: item.description?.en || '', descTr: item.description?.tr || '',
      coverImage: item.coverImage || '',
      isPublished: item.isPublished || false,
      order: String(item.order || 0)
    });
    setModalOpen(true);
  };

  const openPhotos = (album: AlbumItem) => {
    setSelectedAlbum(album);
    setPhotosModalOpen(true);
  };

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploading(true);
      const result = await uploadService.uploadImage(file, { folder: 'gallery/covers' });
      setFormData(prev => ({ ...prev, coverImage: result.url }));
      toast.success('تم رفع الغلاف');
    } catch (error: any) { toast.error(error.message || 'فشل الرفع'); } 
    finally { setUploading(false); if (coverImageInputRef.current) coverImageInputRef.current.value = ''; }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    if (files.length > 5) {
      toast.error('يمكنك رفع 5 صور كحد أقصى في المرة الواحدة');
      return;
    }

    try {
      setPhotoUploading(true);
      // Convert FileList to Array
      const fileList = Array.from(files);
      
      // Upload all images in parallel
      const results = await uploadService.uploadImages(fileList, { folder: 'gallery/photos' });
      
      // Add photos to album immediately
      if (selectedAlbum) {
        const newPhotos = results.map(res => ({
          url: res.url,
          caption: { ar: '', en: '', tr: '' } // Empty caption by default
        }));
        
        // We need to call an API to add these photos to the album
        // Since we don't have a specific bulk add endpoint, we'll update the album
        // Or if your addPhoto endpoint supports bulk, use that. 
        // For now, let's assume we loop through or the backend handles it.
        // Actually, let's call addPhoto for each one or update the album structure.
        
        // Better approach: Call addPhoto sequentially or parallel
        // Assuming galleryService.addPhoto adds one photo
        
        const addPromises = newPhotos.map(photo => 
          galleryService.addPhoto(selectedAlbum._id, photo)
        );
        
        await Promise.all(addPromises);
        
        toast.success('تم رفع الصور وإضافتها للألبوم');
        
        // Refresh data
        const updatedData = await galleryService.getAll();
        const updatedAlbums = Array.isArray(updatedData?.albums) ? updatedData.albums : Array.isArray(updatedData) ? updatedData : [];
        setAlbums(updatedAlbums);
        
        // Update selected album view
        const updatedAlbum = updatedAlbums.find((a: AlbumItem) => a._id === selectedAlbum._id);
        if (updatedAlbum) setSelectedAlbum(updatedAlbum);
      }
    } catch (error: any) { 
      toast.error(error.message || 'فشل الرفع'); 
    } finally { 
      setPhotoUploading(false); 
      if (photoInputRef.current) photoInputRef.current.value = ''; 
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const payload = {
        title: { ar: formData.titleAr, en: formData.titleEn, tr: formData.titleTr },
        description: { ar: formData.descAr, en: formData.descEn, tr: formData.descTr },
        coverImage: formData.coverImage,
        isPublished: formData.isPublished,
        order: Number(formData.order)
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
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">صورة الغلاف</label>
            {formData.coverImage && (
              <div className="relative mb-3 rounded-xl overflow-hidden border border-gray-200 w-fit group">
                <img 
                  src={formData.coverImage.startsWith('http') ? formData.coverImage : `${BASE_URL}${formData.coverImage.startsWith('/') ? '' : '/'}${formData.coverImage}`} 
                  alt="معاينة" 
                  className="h-32 w-auto object-cover" 
                />
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, coverImage: '' }))}
                  className="absolute top-1 right-1 bg-red-600 text-white rounded-full hover:bg-red-700 w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X size={14} />
                </button>
              </div>
            )}
            <div className="flex gap-2">
              <input value={formData.coverImage} onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })} placeholder="رابط الصورة أو المسار" className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none" dir="ltr" />
              <input ref={coverImageInputRef} type="file" accept="image/*" onChange={handleCoverUpload} className="hidden" />
              <button
                type="button"
                onClick={() => coverImageInputRef.current?.click()}
                disabled={uploading}
                className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-sm transition-colors disabled:opacity-50"
              >
                {uploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
                رفع
              </button>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={formData.isPublished} onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })} className="w-4 h-4 text-red-600 rounded" /><span className="text-sm text-gray-700">منشور</span></label>
            <div className="flex-1"><label className="text-sm font-medium text-gray-700 mr-2">الترتيب:</label><input type="number" value={formData.order} onChange={(e) => setFormData({ ...formData, order: e.target.value })} className="w-20 px-3 py-1.5 border border-gray-200 rounded-lg text-sm outline-none" dir="ltr" /></div>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t"><button onClick={() => setModalOpen(false)} className="px-5 py-2.5 text-sm text-gray-600 hover:bg-gray-100 rounded-xl">إلغاء</button><button onClick={handleSave} disabled={saving} className="px-5 py-2.5 text-sm bg-red-600 text-white rounded-xl hover:bg-red-700 disabled:opacity-50">{saving ? 'جاري الحفظ...' : editingItem ? 'تحديث' : 'إنشاء'}</button></div>
        </div>
      </AdminModal>

      {/* Photos Management Modal */}
      <AdminModal isOpen={photosModalOpen} onClose={() => setPhotosModalOpen(false)} title={`إدارة الصور - ${selectedAlbum?.title?.ar || selectedAlbum?.title?.en}`} size="xl">
        <div className="space-y-6">
          <div className="flex gap-2 items-end bg-gray-50 p-4 rounded-xl border border-gray-100">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">رفع صور جديدة (يمكنك اختيار حتى 5 صور)</label>
              <div className="flex gap-2 items-center">
                <input 
                  ref={photoInputRef} 
                  type="file" 
                  accept="image/*" 
                  multiple 
                  onChange={handlePhotoUpload} 
                  className="hidden" 
                />
                <button
                  onClick={() => photoInputRef.current?.click()}
                  disabled={photoUploading}
                  className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 disabled:opacity-50 transition-colors w-full justify-center"
                >
                  {photoUploading ? <Loader2 size={20} className="animate-spin" /> : <Upload size={20} />}
                  <span>اختر الصور من جهازك</span>
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2">سيتم رفع الصور وإضافتها للألبوم تلقائياً.</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-h-[400px] overflow-y-auto pr-2">
            {selectedAlbum?.photos?.map((photo) => (
              <div key={photo._id} className="relative group aspect-square bg-gray-100 rounded-xl overflow-hidden border border-gray-200">
                <img src={photo.url.startsWith('http') ? photo.url : `${BASE_URL}${photo.url.startsWith('/') ? '' : '/'}${photo.url}`} alt="" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <a href={photo.url.startsWith('http') ? photo.url : `${BASE_URL}${photo.url.startsWith('/') ? '' : '/'}${photo.url}`} target="_blank" rel="noreferrer" className="p-2 bg-white/20 backdrop-blur-sm text-white rounded-lg hover:bg-white/30"><Eye size={16} /></a>
                  <button onClick={() => handleRemovePhoto(photo._id)} className="p-2 bg-red-500/80 backdrop-blur-sm text-white rounded-lg hover:bg-red-600"><Trash2 size={16} /></button>
                </div>
                {photo.caption?.ar && <div className="absolute bottom-0 inset-x-0 bg-black/60 p-2 text-white text-xs truncate text-center">{photo.caption.ar}</div>}
              </div>
            ))}
            {(!selectedAlbum?.photos || selectedAlbum.photos.length === 0) && (
              <div className="col-span-full py-10 text-center text-gray-400">لا توجد صور في هذا الألبوم</div>
            )}
          </div>
        </div>
      </AdminModal>
    </div>
  );
}
