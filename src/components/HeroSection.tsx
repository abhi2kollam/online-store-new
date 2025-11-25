import Link from 'next/link';
import Image from 'next/image';

const HeroSection = () => {
    return (
        <div className="w-full mx-auto mt-8">
            <div className="relative w-full h-[600px] rounded-[3rem] overflow-hidden bg-[#8c8c8c]">
                {/* Background Image */}
                <div className="absolute inset-0">
                    <Image
                        src="https://images.unsplash.com/photo-1483985988355-763728e1935b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80"
                        alt="Hero Background"
                        fill
                        className="object-cover object-center opacity-90"
                    />
                    <div className="absolute inset-0 bg-black/20" />
                </div>

                <div className="relative h-full flex flex-col justify-center px-8 md:px-16 max-w-3xl">
                    <div className="bg-white/90 backdrop-blur-sm px-4 py-1 rounded-full w-fit mb-6">
                        <span className="text-xs font-bold tracking-wider text-gray-800 uppercase">Get upto 50% off shop now</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
                        Level Up Your Style With Our New Arrivals
                    </h1>

                    <p className="text-white/90 text-lg mb-8 max-w-xl">
                        Discover the latest trends crafted for your unique style. Elevate your wardrobe with pieces that redefine elegance.
                    </p>

                    <Link href="/shop" className="btn btn-white bg-white text-black hover:bg-gray-100 rounded-full px-8 w-fit flex items-center gap-2 border-none">
                        Shop Now
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                    </Link>
                </div>

                {/* Navigation Arrows (Visual only for now) */}
                <div className="absolute top-8 right-8 flex gap-2">
                    <button className="btn btn-circle btn-sm btn-ghost bg-white/20 hover:bg-white/30 text-white border-none">❮</button>
                    <button className="btn btn-circle btn-sm btn-ghost bg-white text-black hover:bg-gray-100 border-none">❯</button>
                </div>

                {/* Pagination Dots (Visual only for now) */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                    <div className="w-2 h-2 rounded-full bg-white/50"></div>
                </div>
            </div>
        </div>
    );
};

export default HeroSection;
