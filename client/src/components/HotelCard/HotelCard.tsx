import Card from '../Card/Card';

type HotelCardProps = {
  id: string;
  images: string[];
  name: string;
  shortDescription?: string;
  maxImages?: number;
};

export default function HotelCard({
  id,
  images,
  name,
  shortDescription,
  maxImages = 1,
}: HotelCardProps) {
  return (
    <Card
      hotelId={id}
      _id={id}
      images={images}
      title={name}
      description={shortDescription}
      maxImages={maxImages}
    />
  );
}
