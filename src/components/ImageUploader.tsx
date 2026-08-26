import { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

interface ImageUploaderProps {
  images: string[];
  onChange: (images: string[]) => void;
  maxImages?: number;
  maxSizeMB?: number;
}

export function ImageUploader({
  images,
  onChange,
  maxImages = 10,
  maxSizeMB = 5,
}: ImageUploaderProps) {
  const [error, setError] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (files: FileList | File[]) => {
    setError('');
    const newImages: string[] = [];

    Array.from(files).forEach((file) => {
      if (images.length + newImages.length >= maxImages) {
        setError(`حداکثر ${maxImages} تصویر مجاز است`);
        return;
      }

      if (file.size > maxSizeMB * 1024 * 1024) {
        setError(`حجم تصویر نباید بیشتر از ${maxSizeMB} مگابایت باشد`);
        return;
      }

      if (!file.type.startsWith('image/')) {
        setError('فقط فایل‌های تصویری مجاز هستند');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        newImages.push(result);
        if (newImages.length === Math.min(files.length, maxImages - images.length)) {
          onChange([...images, ...newImages]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const removeImage = (index: number) => {
    onChange(images.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`
          relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer
          transition-all duration-300
          ${isDragging
            ? 'border-secondary bg-secondary/5 scale-[1.02]'
            : 'border-border hover:border-secondary/50 hover:bg-surface-alt'
          }
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
          className="hidden"
        />
        <div className="flex flex-col items-center gap-3">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors ${isDragging ? 'bg-secondary/10' : 'bg-surface-alt'}`}>
            <Upload className={`w-6 h-6 ${isDragging ? 'text-secondary' : 'text-gray-400'}`} />
          </div>
          <div>
            <p className="font-medium text-primary">
              {isDragging ? 'تصویر را رها کنید' : 'کلیک کنید یا تصویر را بکشید'}
            </p>
            <p className="text-sm text-text mt-1">
              PNG, JPG, WEBP (حداکثر {maxSizeMB}MB)
            </p>
          </div>
        </div>
      </div>

      {error && (
        <p className="text-sm text-error flex items-center gap-1.5">
          {error}
        </p>
      )}

      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {images.map((img, index) => (
            <div key={index} className="relative group aspect-square rounded-xl overflow-hidden border border-border-light">
              <img src={img} alt={`تصویر ${index + 1}`} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors" />
              <button
                onClick={() => removeImage(index)}
                className="absolute top-2 left-2 w-7 h-7 bg-error text-white rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                <p className="text-white text-xs truncate">{index + 1} / {images.length}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {images.length > 0 && (
        <p className="text-sm text-text">{images.length} تصویر انتخاب شده</p>
      )}
    </div>
  );
}
