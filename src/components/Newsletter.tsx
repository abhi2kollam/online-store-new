import Image from 'next/image';

const Newsletter = () => {
    return (
        <div className="w-full mx-auto mt-16">
            <div className="relative w-full h-[400px] rounded-3xl overflow-hidden bg-[#a69d93]">
                {/* Background Image - using a similar shopping image from Unsplash */}
                <div className="absolute inset-0">
                    <Image
                        src="https://images.unsplash.com/photo-1483985988355-763728e1935b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80"
                        alt="Newsletter Background"
                        fill
                        className="object-cover object-right opacity-90"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#8b8076] via-[#8b8076]/80 to-transparent" />
                </div>

                <div className="relative h-full flex flex-col justify-center px-8 md:px-16 max-w-2xl">
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
                        Subscribe to our newsletter to get Everyday discounts
                    </h2>
                    <p className="text-white/90 text-lg mb-8">
                        Stay in the loop with our latest deals, offers. No spam, we promise!
                    </p>

                    <div className="flex flex-col sm:flex-row w-full max-w-md gap-3 sm:gap-0 sm:bg-white sm:rounded-full sm:p-1.5">
                        <div className="flex items-center w-full sm:w-auto flex-1 bg-white sm:bg-transparent rounded-full px-4 py-3 sm:p-0">
                            <div className="text-gray-400 mr-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <input
                                type="email"
                                placeholder="Email"
                                className="flex-1 bg-transparent border-none focus:ring-0 text-gray-800 placeholder-gray-400 outline-none min-w-0"
                            />
                        </div>
                        <button className="btn btn-neutral rounded-full w-full sm:w-auto px-8 text-white shadow-lg sm:shadow-none">
                            Subscribe
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Newsletter;
