import { useState } from 'react';
import ImageUploader from '../../../../components/ImageUploader/ImageUploader';
import './HotelForm.css';

interface HotelFormProps {
  initialData: {
    id?: string;
    title: string;
    description?: string;
    images: string[];
  };
  onSubmit: (data: {
    title: string;
    description?: string;
    images: string[];
    files?: File[];
  }) => void;
}

export default function HotelForm({ initialData, onSubmit }: HotelFormProps) {
  const [title, setTitle] = useState(initialData.title);
  const [description, setDescription] = useState(initialData.description);
  const [images, setImages] = useState(initialData.images);
  const [files, setFiles] = useState<File[]>([]);

  const handleSave = () => {
    onSubmit({ title, description, images, files });
  };

  return (
    <div className="edit-page card-common">
      <ImageUploader
        hotelId={initialData.id}
        images={images}
        onChange={setImages}
        files={files}
        onFilesChange={setFiles}
      />

      <label>
        <h4>Название отеля</h4>
        <input
          className="edit-name"
          type="text"
          placeholder="Введите текст"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </label>

      <label>
        <h4>Описание отеля</h4>
        <textarea
          className="edit-desc"
          placeholder="Введите текст"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </label>

      <button onClick={handleSave}>Сохранить</button>
    </div>
  );
}
