interface ImagePreviewProps {
  file: File | null;
}

const ImagePreview: React.FC<ImagePreviewProps> = ({ file }) => {
  if (!file) return null;

  const imageUrl = URL.createObjectURL(file);

  return (
    <div className="mt-4 p-4 border rounded-lg bg-gray-50">
      <h3 className="text-lg font-medium text-gray-700 mb-2">Image Preview</h3>
      <div className="relative aspect-[3/2] w-full overflow-hidden rounded-lg">
        <img
          src={imageUrl}
          alt="Document preview"
          className="object-contain w-full h-full"
          onLoad={() => URL.revokeObjectURL(imageUrl)}
        />
      </div>
    </div>
  );
};

export default ImagePreview; 