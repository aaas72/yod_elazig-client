import React, { useEffect, useState, useCallback, useRef } from 'react';
import { galleryService, type GalleryAlbum } from '@/services/galleryService';
import { uploadService } from '@/services/uploadService';
import { BASE_URL } from '@/lib/api';
import { resolveImage } from '@/utils/resolveImage';
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
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  
  const coverImageInputRef = useRef<HTMLInputElement>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const albumPhotosInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    titleAr: '', titleEn: '', titleTr: '',
    descAr: '', descEn: '', descTr: '',
    coverImage: '',
    isPublished: false,
    order: '0'
  });

  const loadData = useCallback(async () => {
    try { 
      setLoading(true); 
      const data = await galleryService.getAll(); 
      // If data is already the array (handled by service), use it.
      // If it's { data: [], pagination: {} }, try to extract data.data
      let albumsList: AlbumItem[] = [];
      if (Array.isArray(data)) {
        albumsList = data;
      } else if (data && Array.isArray(data.data)) {
        albumsList = data.data;
      } else if (data && Array.isArray(data.albums)) {
        albumsList = data.albums;
      }
      setAlbums(albumsList);
    } catch { toast.error('فشل التحميل'); } finally { setLoading(false); }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const openCreate = () => {
    setEditingItem(null);
    setFormData({ titleAr: '', titleEn: '', titleTr: '', descAr: '', descEn: '', descTr: '', coverImage: '', isPublished: true, order: String(albums.length) });
    setSelectedFiles([]);
    setModalOpen(true);
  };

  const openEdit = (item: AlbumItem) => {
    setEditingItem(item);
    setFormData({
      titleAr: item.title.ar || '', titleEn: item.title.en || '', titleTr: item.title.tr || '',
      descAr: item.description?.ar || '', descEn: item.description?.en || '', descTr: item.description?.tr || '',
      coverImage: item.coverImage || '',
      isPublished: item.isPublished || false,
      order: String(item.order || 0)
    });
    setSelectedFiles([]);
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

  const handleAlbumPhotosSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    // Add new files to existing selection
    const newFiles = Array.from(files);
    if (selectedFiles.length + newFiles.length > 10) {
      toast.error('يمكنك رفع 10 صور كحد أقصى في المرة الواحدة');
      return;
    }
    
    setSelectedFiles(prev => [...prev, ...newFiles]);
    if (albumPhotosInputRef.current) albumPhotosInputRef.current.value = '';
  };

  const removeSelectedFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
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
          galleryService.addPhotos(selectedAlbum._id, [photo])
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
      
      // Upload selected photos first if any
      let uploadedPhotoUrls: string[] = [];
      if (selectedFiles.length > 0) {
        try {
          const results = await uploadService.uploadImages(selectedFiles, { folder: 'gallery/photos' });
          uploadedPhotoUrls = results.map(res => res.url);
        } catch (error) {
          toast.error('فشل رفع بعض الصور');
          return;
        }
      }

      // Album Title defaults to empty to let backend generate it with date
      const titleAr = formData.titleAr || '';
      const titleEn = formData.titleEn || '';
      const titleTr = formData.titleTr || '';

      // If no cover image set but we uploaded photos, use the first one as cover
      let finalCoverImage = formData.coverImage;
      if (!finalCoverImage && uploadedPhotoUrls.length > 0) {
        finalCoverImage = uploadedPhotoUrls[0];
      }

      const photosPayload = uploadedPhotoUrls.map(url => ({
        url,
        caption: { ar: '', en: '', tr: '' },
        order: 0
      }));

      const payload = {
        title: { ar: titleAr, en: titleEn, tr: titleTr },
        description: { ar: formData.descAr, en: formData.descEn, tr: formData.descTr },
        coverImage: finalCoverImage,
        isPublished: true, // Always published by default
        order: Number(formData.order) || 0,
        photos: photosPayload
      };

      if (editingItem) { 
        // For update, we might want to append photos, but standard update replaces usually.
        // If the backend updateAlbum replaces photos, we need to be careful.
        // However, usually we use addPhotos for adding.
        // Let's create the album/update the basic info first.
        await galleryService.updateAlbum(editingItem._id, { 
          ...payload, 
          photos: undefined // Don't overwrite existing photos array on update, unless we want to.
                            // Better to use addPhotos for the new ones.
        }); 
        
        if (photosPayload.length > 0) {
          await galleryService.addPhotos(editingItem._id, photosPayload);
        }
        
        toast.success('تم التحديث'); 
      }
      else { 
        // Create new album with photos
        // Create album without photos first, then add photos separately
        const album = await galleryService.createAlbum({
          title: { ar: titleAr, en: titleEn, tr: titleTr },
          description: { ar: formData.descAr, en: formData.descEn, tr: formData.descTr },
          coverImage: finalCoverImage,
          isPublished: formData.isPublished,
          order: Number(formData.order)
        });

        // Add photos separately if any
        if (photosPayload.length > 0) {
          await galleryService.addPhotos(album._id, photosPayload);
        }
        toast.success('تم الإنشاء'); 
      }
      
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

  // build image URL using resolveImage to include folder and base URL correctly
  const getImageUrl = (url?: string) => {
    if (!url) return '';
    return resolveImage(url, 'gallery/photos');
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
                  <img src={getImageUrl(album.coverImage)} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300"><Image size={48} /></div>
                )}
                <div className="absolute top-3 left-3 px-2.5 py-1 bg-black/60 text-white rounded-full text-xs">{album.photos?.length || 0} صورة</div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-800 mb-1">
                  {/* Show localized date title properly */}
                  {album.title.ar || album.title.en || 'بدون عنوان'}
                </h3>
                <div className="flex items-center gap-2 mt-3">
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
      <AdminModal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingItem ? 'تعديل الألبوم' : 'إضافة ألبوم جديد'} size="lg">
        <div className="space-y-5">
          {/* Inputs removed as per user request to simplify UI */}
          
          {/* Bulk Photo Upload Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">صور الألبوم (اختر صور متعددة)</label>
            <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:bg-gray-50 transition-colors cursor-pointer flex flex-col items-center justify-center gap-4" onClick={() => albumPhotosInputRef.current?.click()}>
              <input 
                ref={albumPhotosInputRef} 
                type="file" 
                accept="image/*" 
                multiple 
                onChange={handleAlbumPhotosSelect} 
                className="hidden" 
              />
              <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mb-2">
                <Image size={32} />
              </div>
              <div className="flex flex-col items-center gap-1">
                <span className="font-medium text-gray-900">اضغط لاختيار الصور</span>
                <span className="text-sm text-gray-500">يمكنك اختيار حتى 10 صور في المرة الواحدة</span>
              </div>
            </div>
            
            {/* Preview of selected files */}
            {selectedFiles.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">الصور المختارة ({selectedFiles.length})</h4>
                <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
                  {selectedFiles.map((file, idx) => (
                    <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-gray-200 group shadow-sm">
                      <img src={URL.createObjectURL(file)} alt="preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); removeSelectedFile(idx); }}
                        className="absolute top-1 right-1 bg-white/90 text-red-600 rounded-full p-1 shadow-sm opacity-0 group-hover:opacity-100 transition-all hover:bg-red-50"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t mt-4">
            <button onClick={() => setModalOpen(false)} className="px-5 py-2.5 text-sm text-gray-600 hover:bg-gray-100 rounded-xl font-medium">إلغاء</button>
            <button 
              onClick={handleSave} 
              disabled={saving || (selectedFiles.length === 0 && !editingItem)} 
              className="px-6 py-2.5 text-sm bg-red-600 text-white rounded-xl hover:bg-red-700 disabled:opacity-50 font-medium shadow-sm shadow-red-200"
            >
              {saving ? 'جاري الحفظ...' : editingItem ? 'حفظ التغييرات' : 'إنشاء الألبوم'}
            </button>
          </div>
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
                <img src={getImageUrl(photo.url)} alt="" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <a href={getImageUrl(photo.url)} target="_blank" rel="noreferrer" className="p-2 bg-white/20 backdrop-blur-sm text-white rounded-lg hover:bg-white/30"><Eye size={16} /></a>
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
