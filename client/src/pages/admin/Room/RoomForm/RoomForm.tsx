import { useState } from 'react';
import ImageUploader from '../../../../components/ImageUploader/ImageUploader';

interface RoomFormProps {
  initialData: {
    id?: string;
    name: string;
    description?: string;
    images: string[];
    hotel: { _id: string; title: string };
  };
  onSubmit: (data: {
    id?: string;
    name: string;
    description?: string;
    images: string[];
    hotel: { _id: string; title: string };
    files?: File[];
  }) => void;
}

export default function RoomForm({ initialData, onSubmit }: RoomFormProps) {
  const [name, setName] = useState(initialData.name);
  const [description, setDescription] = useState(initialData.description);
  const [images, setImages] = useState(initialData.images);
  const [files, setFiles] = useState<File[]>([]);

  const handleSave = () => {
    onSubmit({
      id: initialData.id,
      name,
      description,
      images,
      hotel: initialData.hotel,
      files,
    });
  };

  return (
    <div className="edit-page">
      <ImageUploader
        hotelId={initialData.hotel._id}
        images={images}
        onChange={setImages}
        files={files}
        onFilesChange={setFiles}
      />
      <label>
        <h4>Название комнаты</h4>
        <input
          className="edit-name"
          type="text"
          placeholder="Введите текст"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </label>

      <label>
        <h4>Описание комнаты</h4>
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
