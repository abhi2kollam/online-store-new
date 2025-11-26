'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';

const slides = [
    {
        id: 1,
        image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80',
        tag: 'Get upto 50% off shop now',
        title: 'Level Up Your Style With Our New Arrivals',
        description: 'Discover the latest trends crafted for your unique style. Elevate your wardrobe with pieces that redefine elegance.',
        buttonText: 'Shop Now',
        link: '/shop'
    },
    {
        id: 2,
        image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80',
        tag: 'New Collection 2025',
        title: 'Experience the Future of Technology',
        description: 'Upgrade your life with our latest gadgets and electronics. Cutting-edge performance meets stunning design.',
        buttonText: 'Explore Gadgets',
        link: '/shop?category=Electronics'
    },
    {
        id: 3,
        image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80',
        tag: 'Home Makeover Sale',
        title: 'Transform Your Living Space Today',
        description: 'Create a home you love with our premium furniture collection. Comfort and style for every room.',
        buttonText: 'View Furniture',
        link: '/shop?category=Home'
    }
];

const HeroSection = () => {
    const [currentSlide, setCurrentSlide] = useState(0);

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
    };

    const goToSlide = (index: number) => {
        setCurrentSlide(index);
    };

    // Auto-slide functionality (optional, can be removed if not desired)
    useEffect(() => {
        const interval = setInterval(() => {
            nextSlide();
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="w-full mx-auto">
            <div className="relative w-full h-[600px] rounded-3xl overflow-hidden bg-[#8c8c8c] group">
                {/* Background Image */}
                <div className="absolute inset-0 transition-opacity duration-700 ease-in-out">
                    <Image
                        key={slides[currentSlide].image} // Force re-render for animation if needed, or just let src change
                        src={slides[currentSlide].image}
                        alt="Hero Background"
                        fill
                        className="object-cover object-center opacity-90 transition-all duration-700"
                        priority
                    />
                    <div className="absolute inset-0 bg-black/30" />
                </div>

                <div className="relative h-full flex flex-col justify-center px-8 md:px-16 max-w-3xl transition-all duration-500">
                    <div className="bg-white/90 backdrop-blur-sm px-4 py-1 rounded-full w-fit mb-6 animate-fadeIn">
                        <span className="text-xs font-bold tracking-wider text-gray-800 uppercase">{slides[currentSlide].tag}</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight animate-slideUp">
                        {slides[currentSlide].title}
                    </h1>

                    <p className="text-white/90 text-lg mb-8 max-w-xl animate-slideUp delay-100">
                        {slides[currentSlide].description}
                    </p>

                    <Link href={slides[currentSlide].link} className="btn btn-white bg-white text-black hover:bg-gray-100 rounded-full px-8 w-fit flex items-center gap-2 border-none animate-slideUp delay-200">
                        {slides[currentSlide].buttonText}
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                    </Link>
                </div>

                {/* Navigation Arrows */}
                <div className="absolute top-8 right-8 flex gap-2 z-10">
                    <button
                        onClick={prevSlide}
                        className="btn btn-circle btn-sm btn-ghost bg-white/20 hover:bg-white/30 text-white border-none backdrop-blur-sm transition-transform hover:scale-110"
                    >
                        ❮
                    </button>
                    <button
                        onClick={nextSlide}
                        className="btn btn-circle btn-sm btn-ghost bg-white text-black hover:bg-gray-100 border-none transition-transform hover:scale-110"
                    >
                        ❯
                    </button>
                </div>

                {/* Pagination Dots */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                    {slides.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => goToSlide(index)}
                            className={`w-2 h-2 rounded-full transition-all duration-300 ${currentSlide === index ? 'bg-accent w-6' : 'bg-white/50 hover:bg-white'
                                }`}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default HeroSection;
