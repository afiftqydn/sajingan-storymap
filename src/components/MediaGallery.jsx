export default function MediaGallery({ images }) {
  if (!images || images.length === 0) return null;
  return (
    <div className="media-gallery">
      {images.map((src) => (
        <img key={src} src={src} alt="" loading="lazy" />
      ))}
    </div>
  );
}
