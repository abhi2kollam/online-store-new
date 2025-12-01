'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Maximize2, X, ChevronLeft, ChevronRight } from 'lucide-react';

interface ImageGalleryProps {
    images: string[];
    name: string;
}

const ImageGallery = ({ images, name }: ImageGalleryProps) => {
    const [selectedImage, setSelectedImage] = useState(images[0]);

    const [isZoomOpen, setIsZoomOpen] = useState(false);

    useEffect(() => {
        if (images.length > 0) {
            setSelectedImage(images[0]);
        }
    }, [images]);

    const [touchStart, setTouchStart] = useState<number | null>(null);
    const [touchEnd, setTouchEnd] = useState<number | null>(null);

    const minSwipeDistance = 50;

    const onTouchStart = (e: React.TouchEvent) => {
        setTouchEnd(null);
        setTouchStart(e.targetTouches[0].clientX);
    };

    const onTouchMove = (e: React.TouchEvent) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const onTouchEnd = () => {
        if (!touchStart || !touchEnd) return;
        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > minSwipeDistance;
        const isRightSwipe = distance < -minSwipeDistance;

        if (isLeftSwipe) {
            handleNext();
        }
        if (isRightSwipe) {
            handlePrev();
        }
    };

    const handlePrev = () => {
        const currentIndex = images.indexOf(selectedImage);
        const prevIndex = currentIndex === 0 ? images.length - 1 : currentIndex - 1;
        setSelectedImage(images[prevIndex]);
    };

    const handleNext = () => {
        const currentIndex = images.indexOf(selectedImage);
        const nextIndex = currentIndex === images.length - 1 ? 0 : currentIndex + 1;
        setSelectedImage(images[nextIndex]);
    };

    return (
        <>
            <div className="flex flex-col-reverse md:flex-row gap-4 h-96 md:h-[600px] max-w-full">
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
                                sizes="(max-width: 768px) 20vw, 10vw"
                            />
                        </button>
                    ))}
                </div>

                {/* Main Image */}
                <div className="relative flex-1 h-full rounded-lg overflow-hidden bg-base-200 group">
                    <Image
                        src={selectedImage}
                        alt={name}
                        fill
                        className="object-cover cursor-zoom-in"
                        priority
                        sizes="(max-width: 768px) 100vw, 50vw"
                        onClick={() => setIsZoomOpen(true)}
                    />
                    <button
                        className="absolute top-4 right-4 p-2 bg-white/80 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
                        onClick={() => setIsZoomOpen(true)}
                        aria-label="Zoom image"
                    >
                        <Maximize2 className="w-5 h-5 text-gray-800" />
                    </button>
                </div>
            </div>

            {/* Zoom Modal */}
            {isZoomOpen && (
                <div
                    className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4"
                    onTouchStart={onTouchStart}
                    onTouchMove={onTouchMove}
                    onTouchEnd={onTouchEnd}
                >
                    <button
                        className="absolute top-6 right-6 p-2 text-white hover:text-gray-300 transition-colors z-50"
                        onClick={() => setIsZoomOpen(false)}
                    >
                        <X className="w-8 h-8" />
                    </button>

                    <button
                        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 text-white hover:text-gray-300 transition-colors z-50 bg-black/50 rounded-full hidden md:block"
                        onClick={(e) => {
                            e.stopPropagation();
                            handlePrev();
                        }}
                    >
                        <ChevronLeft className="w-8 h-8" />
                    </button>

                    <button
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-white hover:text-gray-300 transition-colors z-50 bg-black/50 rounded-full hidden md:block"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleNext();
                        }}
                    >
                        <ChevronRight className="w-8 h-8" />
                    </button>

                    <div className="relative w-full h-full max-w-7xl max-h-[90vh]">
                        <Image
                            src={selectedImage}
                            alt={name}
                            fill
                            className="object-contain"
                            quality={100}
                            priority
                        />
                    </div>
                </div>
            )}
        </>
    );
};

export default ImageGallery;
