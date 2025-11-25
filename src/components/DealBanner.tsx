import Link from 'next/link';
import Image from 'next/image';

const DealBanner = () => {
    return (
        <div className="w-full max-w-7xl mx-auto px-4 mt-16">
            <div className="relative w-full h-[500px] rounded-[3rem] overflow-hidden bg-[#d9d9d9]">
                {/* Background Image */}
                <div className="absolute inset-0">
                    <Image
                        src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80"
                        alt="Deal Banner Background"
                        fill
                        className="object-cover object-top opacity-90"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#d9d9d9] via-[#d9d9d9]/80 to-transparent" />
                </div>

                <div className="relative h-full flex flex-col justify-center px-8 md:px-16 max-w-2xl">
                    <div className="bg-white/80 backdrop-blur-sm px-4 py-1 rounded-full w-fit mb-6">
                        <span className="text-sm font-bold tracking-wider text-gray-800">LIMITED TIME OFFER</span>
                    </div>

                    <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                        50% Off On All Trending Collections
                    </h2>

                    <p className="text-red-500 font-bold tracking-widest text-sm mb-4 uppercase">HURRY UP! OFFER ENDS IN</p>

                    <div className="flex gap-4 mb-8">
                        <div className="flex flex-col items-center bg-white/50 backdrop-blur-sm border border-gray-300 rounded-lg p-3 w-16">
                            <span className="text-xl font-bold text-gray-900">34</span>
                            <span className="text-[10px] text-gray-600 uppercase">Days</span>
                        </div>
                        <div className="flex flex-col items-center bg-white/50 backdrop-blur-sm border border-gray-300 rounded-lg p-3 w-16">
                            <span className="text-xl font-bold text-gray-900">04</span>
                            <span className="text-[10px] text-gray-600 uppercase">Hours</span>
                        </div>
                        <div className="flex flex-col items-center bg-white/50 backdrop-blur-sm border border-gray-300 rounded-lg p-3 w-16">
                            <span className="text-xl font-bold text-gray-900">07</span>
                            <span className="text-[10px] text-gray-600 uppercase">Min</span>
                        </div>
                        <div className="flex flex-col items-center bg-white/50 backdrop-blur-sm border border-gray-300 rounded-lg p-3 w-16">
                            <span className="text-xl font-bold text-gray-900">32</span>
                            <span className="text-[10px] text-gray-600 uppercase">Sec</span>
                        </div>
                    </div>

                    <Link href="/shop" className="btn btn-neutral rounded-full px-8 text-white w-fit flex items-center gap-2">
                        Shop Now
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                        </svg>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default DealBanner;
