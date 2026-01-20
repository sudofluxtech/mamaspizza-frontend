import Image from "next/image"
import { Star, ArrowRight,  ThumbsUp } from "lucide-react"

const ReviewSection = () => {
    return (
        <section className="bg-gradient-to-br fade-top-mask from-gray-50 to-white py-12 sm:py-16 lg:py-20">
            <div className="ah-container mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center">
                    {/* Left - Image */}
                    <div className="relative order-first lg:order-last">
                        <div className="bg-gray-100 rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg h-[300px] sm:h-[400px] lg:h-[500px] relative">
                             {/* Real Image */}
                             <Image
                                 src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                                 alt="Happy customers enjoying food"
                                 fill
                                 className="object-cover"
                             />

                            {/* Floating Review Cards */}
                            <div className="absolute top-4 left-4 sm:top-8 sm:left-8 bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-lg max-w-[160px] sm:max-w-[200px]">
                                <div className="flex items-center gap-1 sm:gap-2 mb-2">
                                    <div className="flex">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} size={12} className="sm:w-3.5 sm:h-3.5 text-yellow-400 fill-current" />
                                        ))}
                                    </div>
                                </div>
                                <p className="text-xs sm:text-sm text-gray-700 mb-2">&ldquo;Amazing food and fast delivery!&rdquo;</p>
                                <div className="flex items-center gap-2">
                                    <div className="w-5 h-5 sm:w-6 sm:h-6 bg-orange-100 rounded-full flex items-center justify-center">
                                        <span className="text-xs font-bold text-orange-600">S</span>
                                    </div>
                                    <span className="text-xs text-gray-600">Sarah M.</span>
                                </div>
                            </div>

                           
                        </div>

                        {/* Floating Stats Card */}
                        <div className="absolute -bottom-4 -right-4 sm:-bottom-6 sm:-right-6 bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-xl border border-gray-100">
                            <div className="flex items-center gap-2 sm:gap-3">
                                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-100 rounded-lg sm:rounded-xl flex items-center justify-center">
                                    <ThumbsUp size={20} className="sm:w-6 sm:h-6 text-orange-600" />
                                </div>
                                <div>
                                    <div className="font-semibold text-gray-900 text-sm sm:text-base">98%</div>
                                    <div className="text-xs sm:text-sm text-gray-600">Satisfaction Rate</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Content */}
                    <div className="space-y-6 sm:space-y-8 text-center lg:text-left">
                        {/* Title & Description */}
                        <div className="space-y-3 sm:space-y-4">
                            <div className="inline-flex items-center bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-xs font-medium">
                                <span className="w-1.5 h-1.5 bg-orange-500 rounded-full mr-2 animate-pulse"></span>
                                Customer Reviews
                            </div>
                            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold">
                                <span className="text-gray-900">What Our</span>
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-500"> Customers Say</span>
                            </h2>
                            <p className="text-gray-600 text-sm sm:text-base max-w-lg mx-auto lg:mx-0">
                                Don&apos;t just take our word for it. Hear from thousands of satisfied customers
                                who love our food and service. Join the community of happy food lovers!
                            </p>
                        </div>

                        {/* Rating Badge */}
                        <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-100">
                            <div className="flex items-center justify-between mb-4 sm:mb-6">
                                <div className="flex items-center gap-2 sm:gap-3">
                                    <div className="flex">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} size={18} className="sm:w-5 sm:h-5 text-yellow-400 fill-current" />
                                        ))}
                                    </div>
                                    <div>
                                        <div className="font-bold text-xl sm:text-2xl text-gray-900">4.9</div>
                                        <div className="text-xs sm:text-sm text-gray-600">out of 5</div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="font-bold text-xl sm:text-2xl text-gray-900">50K+</div>
                                    <div className="text-xs sm:text-sm text-gray-600">Reviews</div>
                                </div>
                            </div>

                            {/* Group Badge */}
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-0">
                                <div className="flex items-center gap-2 sm:gap-3">
                                    <div className="flex -space-x-1 sm:-space-x-2">
                                        {[
                                            { name: "Sarah", color: "bg-orange-500" },
                                            { name: "John", color: "bg-blue-500" },
                                            { name: "Emma", color: "bg-green-500" },
                                            { name: "Mike", color: "bg-purple-500" },
                                            { name: "Lisa", color: "bg-pink-500" }
                                        ].map((person, index) => (
                                            <div
                                                key={index}
                                                className={`w-8 h-8 sm:w-10 sm:h-10 ${person.color} rounded-full border-2 border-white flex items-center justify-center text-white font-semibold text-xs sm:text-sm shadow-md hover:scale-110 transition-transform duration-200`}
                                                title={person.name}
                                            >
                                                {person.name.charAt(0)}
                                            </div>
                                        ))}
                                    </div>
                                    <div>
                                        <div className="font-semibold text-gray-900 text-sm sm:text-base">5 Happy Customers</div>
                                        <div className="text-xs sm:text-sm text-gray-600">Recent reviews</div>
                                    </div>
                                </div>
                                <div className="text-center sm:text-right">
                                    <div className="flex items-center gap-1 text-yellow-400 justify-center sm:justify-end">
                                        <Star size={14} className="sm:w-4 sm:h-4 fill-current" />
                                        <span className="text-xs sm:text-sm font-medium text-gray-700">All 5★</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* CTA Button */}
                        <div className="pt-4 flex items-center justify-center md:justify-start">
                            <button className="group bg-gradient-to-r from-orange-600 to-red-500 text-white px-8 py-4 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex items-center gap-3">
                                Write a Review
                                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform duration-300" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default ReviewSection
