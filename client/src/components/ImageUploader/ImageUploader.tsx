import { useRef, useState } from 'react';
import { CgClose } from 'react-icons/cg';
import './ImageUploader.css';

interface ImageUploaderProps {
  hotelId?: string;
  images: string[];
  onChange: (images: string[]) => void;
  files?: File[];
  onFilesChange?: (files: File[]) => void;
  maxImages?: number;
}

export default function ImageUploader({
  images,
  onChange,
  files = [],
  onFilesChange = () => {},
  maxImages = 3,
}: ImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previews, setPreviews] = useState<string[]>([]);

  const handleImgChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files || []);
    if (selected.length === 0) return;

    if (images.length + selected.length > maxImages) {
      alert(`Можно загрузить максимум ${maxImages} фото`);
      return;
    }

    const newPreviews = selected.map((file) => URL.createObjectURL(file));
    setPreviews((prev) => [...prev, ...newPreviews]);

    onFilesChange([...files, ...selected]);
  };

  const handleClick = () => fileInputRef.current?.click();

  const handleDeletePreview = (index: number) => {
    setPreviews((prev) => prev.filter((_, i) => i !== index));
    onFilesChange(files.filter((_, i) => i !== index));
  };

  const handleDeleteImage = (index: number) => {
    onChange(images.filter((_, i) => i !== index));
  };

  return (
    <div className="img-form">
      {previews.map((src, index) => (
        <div key={`preview-${index}`} className="img-form-wrapper">
          <img
            src={src}
            alt={`Preview ${index + 1}`}
            className="img-form-visible"
          />
          <button
            onClick={() => handleDeletePreview(index)}
            className="remove-btn"
          >
            <CgClose />
          </button>
        </div>
      ))}

      {images.map((src, index) => (
        <div key={`img-${index}`} className="img-form-wrapper">
          <img
            src={src}
            alt={`Image ${index + 1}`}
            className="img-form-visible"
          />
          <button
            onClick={() => handleDeleteImage(index)}
            className="remove-btn"
          >
            <CgClose />
          </button>
        </div>
      ))}

      {images.length + previews.length < maxImages && (
        <div onClick={handleClick} className="img-form-add">
          +
        </div>
      )}

      <input
        type="file"
        multiple
        accept="image/*"
        ref={fileInputRef}
        onChange={handleImgChange}
        style={{ display: 'none' }}
      />
    </div>
  );
}
