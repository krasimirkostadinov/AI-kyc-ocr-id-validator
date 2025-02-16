import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch } from '../../store/store';
import { analyzeImage } from '../../features/ocr/ocrSlice';
import { RootState } from '../../store/store';
import { FormData, uploadSchema } from './types';
import ImagePreview from './ImagePreview';
import { useState } from 'react';

const ImageUploadForm: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { status } = useSelector((state: RootState) => state.ocr);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(uploadSchema),
  });

  const onSubmit = (data: FormData) => {
    const imageFile = data.image[0];
    dispatch(analyzeImage(imageFile));
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setSelectedFile(file);
  };

  return (
    <div className="max-w-lg mx-auto mt-6 p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Upload Document</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="flex flex-col">
          <label className="text-gray-700 font-medium">Select Image</label>
          <input 
            type="file" 
            {...register('image')} 
            onChange={handleFileChange}
            className="border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.image && <p className="text-red-500 text-sm mt-1">{errors.image.message}</p>}
        </div>

        <ImagePreview file={selectedFile} />

        <button 
          type="submit" 
          disabled={status === 'loading'}
          className={`w-full py-2 px-4 font-semibold text-white rounded-lg ${
            status === 'loading' ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'
          }`}
        >
          {status === 'loading' ? 'Uploading...' : 'Upload'}
        </button>
      </form>
    </div>
  );
};

export default ImageUploadForm;
