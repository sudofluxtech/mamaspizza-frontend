'use client'

import React, { useRef } from 'react'
import { Camera } from 'lucide-react';
import Image from 'next/image'

interface ImageUploadProps {
  currentImage?: string | null
  imagePreview?: string | null
  onImageChange: (file: File) => void
  isEditing: boolean
  size?: 'sm' | 'md' | 'lg'
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  currentImage,
  imagePreview,
  onImageChange,
  isEditing,
  size = 'lg'
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      onImageChange(file)
    }
  }

  const getImageUrl = (imagePath: string | null | undefined) => {
    if (!imagePath) return null
    
    // If it's already a complete URL, return it
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath
    }
    
    // If it starts with storage/, add the API URL
    if (imagePath.startsWith('storage/')) {
      return `${process.env.NEXT_PUBLIC_API_URL}/public/${imagePath}`
    }
    
    // If it's a malformed URL like "http://localhost:8000storage/", fix it
    if (imagePath.includes('://') && !imagePath.includes(':///')) {
      return imagePath.replace('://', ':///')
    }
    
    // Handle specific case: "http://localhost:8000storage/" -> "http://localhost:8000/storage/"
    if (imagePath.includes('://') && imagePath.includes('storage/')) {
      return imagePath.replace(/(:\d+)(storage)/, '$1/$2');
    }
    
    // Default: prepend API URL
    return `${process.env.NEXT_PUBLIC_API_URL}/public/${imagePath}`
  }

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'w-16 h-16'
      case 'md':
        return 'w-24 h-24'
      case 'lg':
        return 'w-32 h-32'
      default:
        return 'w-32 h-32'
    }
  }

  return (
    <div className="relative inline-block">
      <div className={`${getSizeClasses()} rounded-full overflow-hidden bg-gray-100 flex items-center justify-center`}>
        {imagePreview ? (
          <Image
            src={imagePreview}
            alt="Profile Preview"
            width={size === 'lg' ? 128 : size === 'md' ? 96 : 64}
            height={size === 'lg' ? 128 : size === 'md' ? 96 : 64}
            className="w-full h-full object-cover"
            onError={(e) => {
              // Fallback to placeholder if image fails to load
              const target = e.target as HTMLImageElement;
              target.src = '/placeholder-avatar.svg';
            }}
          />
        ) : currentImage ? (
          <Image
            src={getImageUrl(currentImage) || '/placeholder-avatar.svg'}
            alt="Profile"
            width={size === 'lg' ? 128 : size === 'md' ? 96 : 64}
            height={size === 'lg' ? 128 : size === 'md' ? 96 : 64}
            className="w-full h-full object-cover"
            onError={(e) => {
              // Fallback to placeholder if image fails to load
              const target = e.target as HTMLImageElement;
              target.src = '/placeholder-avatar.svg';
            }}
          />
        ) : (
          <div className="text-gray-400">
            <Camera size={size === 'lg' ? 48 : size === 'md' ? 36 : 24} />
          </div>
        )}
      </div>
      
      {isEditing && (
        <button
          onClick={() => fileInputRef.current?.click()}
          className="absolute bottom-0 right-0 bg-orange-500 text-white p-2 rounded-full hover:bg-orange-600 transition-colors"
        >
          <Camera size={16} />
        </button>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  )
}

export default ImageUpload
