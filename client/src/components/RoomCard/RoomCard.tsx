import Card from '../Card/Card';

type RoomCardProps = {
  id: string;
  name?: string;
  description?: string;
  images?: string[];
  hotel?: {
    _id: string;
    title: string;
  } | null;
};

export default function RoomCard({
  id,
  name,
  description,
  images,
  hotel,
}: RoomCardProps) {
  const cover = images?.[0]
    ? `http://localhost:3000/${images[0]}`
    : '/no-image.jpg';
  const safeName = name ?? 'Без названия';
  const safeDescription = description ?? 'Описание отсутствует';
  const hotelTitle = hotel?.title ?? 'Неизвестно';

  return (
    <Card
      _id={id}
      hotelId={hotel?._id}
      images={cover}
      title={safeName}
      description={`Отель: ${hotelTitle}. ${safeDescription}`}
    />
  );
}
