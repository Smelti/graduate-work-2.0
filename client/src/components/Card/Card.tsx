import { Link } from 'react-router-dom';
import './Card.css';

type CardProps = {
  _id: string;
  hotelId?: string;
  images?: string | string[]; // Изменено на string | string[]
  title: string;
  description?: string;
  showHotelLink?: boolean;
  maxImages?: number;
  index?: number;
  onDelete?: (id: string) => void;
  showDelete?: boolean;
  hotelName?: string;
};

export default function Card({
  _id,
  hotelId,
  images,
  title,
  description,
  showHotelLink = true,
  maxImages = 1,
  index,
  onDelete,
  showDelete = false,
  hotelName,
}: CardProps) {
  const imageArray = Array.isArray(images) ? images : images ? [images] : [];
  const displayImages = imageArray.slice(0, maxImages);

  return (
    <div className="card">
      {index && <div className="card-index">#{index}</div>}
      {displayImages.length > 0 && (
        <div className="card-images">
          {displayImages.map((img, index) => (
            <img
              key={index}
              className="card-img"
              src={
                img.startsWith('http') ? img : `http://localhost:3000/${img}`
              }
              alt={`${title} ${index + 1}`}
            />
          ))}
        </div>
      )}
      <div className="card-content">
        <div className="card-info">
          <h3 className="card-name">{title}</h3>
          {hotelName && <p className="card-hotel">Отель: {hotelName}</p>}
          {description && <p className="card-desc">{description}</p>}
        </div>
        {showDelete && onDelete && (
          <button onClick={() => onDelete(_id)} className="card-delete-btn">
            Удалить
          </button>
        )}
        {showHotelLink && hotelId && (
          <Link to={`/hotels/${hotelId}`}>
            <button className="card-btn">Подробнее</button>
          </Link>
        )}
      </div>
    </div>
  );
}
