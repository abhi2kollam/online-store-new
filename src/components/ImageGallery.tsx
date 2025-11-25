'use client';

import { useState } from 'react';
import Image from 'next/image';

interface ImageGalleryProps {
    images: string[];
    name: string;
}

const ImageGallery = ({ images, name }: ImageGalleryProps) => {
    const [selectedImage, setSelectedImage] = useState(images[0]);

    return (
        <div className="flex flex-col-reverse md:flex-row gap-4 h-96 md:h-[600px]">
            {/* Thumbnails */}
            <div className="flex md:flex-col gap-4 overflow-x-auto md:overflow-y-auto md:w-24 shrink-0 scrollbar-hide">
                {images.map((img, index) => (
                    <button
                        key={index}
                        onClick={() => setSelectedImage(img)}
                        className={`relative w-20 h-20 shrink-0 rounded-lg overflow-hidden border-2 transition-all ${selectedImage === img ? 'border-primary' : 'border-transparent hover:border-base-300'
                            }`}
                    >
                        <Image
                            src={img}
                            alt={`${name} view ${index + 1}`}
                            fill
                            className="object-cover"
                        />
                    </button>
                ))}
            </div>

            {/* Main Image */}
            <div className="relative flex-1 h-full rounded-lg overflow-hidden bg-base-200">
                <Image
                    src={selectedImage}
                    alt={name}
                    fill
                    className="object-cover"
                    priority
                />
            </div>
        </div>
    );
};

export default ImageGallery;
