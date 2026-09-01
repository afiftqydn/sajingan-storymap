export default function MediaGallery({ images, altPrefix = 'Foto lapangan' }) {
  if (!images || images.length === 0) return null;
  return (
    <div className="media-gallery">
      {images.map((src) => (
        <img
          key={src}
          src={src}
          alt={altPrefix}
          loading="lazy"
          onError={(e) => {
            // Sebagian foto masih belum diupload (lihat BACKLOG-DATA.md) —
            // sembunyikan gracefully daripada nampilin ikon gambar rusak,
            // sama seperti pola yang sudah dipakai di PhotoGrid Dashboard.
            e.target.style.display = 'none';
          }}
        />
      ))}
    </div>
  );
}
