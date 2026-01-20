import { MapPin, Phone, Mail, Clock } from "lucide-react"

const MapSection = () => {
    return (
        <section className="bg-white fade-top-mask py-20">
            <div className="ah-container mx-auto">
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    {/* Left - Map */}
                    <div className="relative">
                        <div className="bg-gray-100 rounded-3xl overflow-hidden shadow-lg h-[500px] relative">
                            {/* Google Maps Iframe */}
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3651.902442430136!2d90.3653!3d23.7937!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755c0b1c6c8c8c8%3A0x8c8c8c8c8c8c8c8!2sMirpur%2010%2C%20Dhaka%2C%20Bangladesh!5e0!3m2!1sen!2sbd!4v1234567890"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                title="Mirpur 10 Service Area"
                                className="rounded-3xl"
                            ></iframe>

                            {/* Map Overlay Elements */}
                            <div className="absolute top-6 left-6 bg-white rounded-2xl p-4 shadow-lg">
                                <div className="flex items-center gap-3">
                                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                                    <span className="text-sm font-medium text-gray-700">Service Available</span>
                                </div>
                            </div>

                            <div className="absolute bottom-6 right-6 bg-white rounded-2xl p-4 shadow-lg">
                                <div className="flex items-center gap-3">
                                    <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                                    <span className="text-sm font-medium text-gray-700">Coming Soon</span>
                                </div>
                            </div>
                        </div>

                        {/* Floating Card */}
                        <div className="absolute -bottom-6 -right-6 bg-white rounded-2xl p-6 shadow-xl border border-gray-100">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                                    <span className="text-orange-600 font-bold text-lg">⭐</span>
                                </div>
                                <div>
                                    <div className="font-semibold text-gray-900">15+</div>
                                    <div className="text-sm text-gray-600">Areas Served</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Content */}
                    <div className="space-y-8">
                        {/* Title & Description */}
                        <div className="space-y-4">
                            <div className="inline-flex items-center bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-xs font-medium">
                                <span className="w-1.5 h-1.5 bg-orange-500 rounded-full mr-2 animate-pulse"></span>
                                Service Areas
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold">
                                <span className="text-gray-900">Areas We</span>
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-500"> Serve</span>
                            </h2>
                            <p className="text-gray-600 text-base max-w-lg">
                                We deliver delicious food to multiple neighborhoods across the city. 
                                Check if we serve your area and enjoy our fast, reliable delivery service.
                            </p>
                        </div>

                        {/* Service Areas Information */}
                        <div className="space-y-4">
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
                                    <MapPin size={20} className="text-orange-600" />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-900 mb-1">Primary Service Areas</h4>
                                    <p className="text-gray-600 text-sm">
                                        Mirpur 10, Mirpur 11, Mirpur 12,<br />
                                        Pallabi, Kalshi, ECB Chottor
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                                    <Clock size={20} className="text-green-600" />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-900 mb-1">Delivery Time</h4>
                                    <p className="text-gray-600 text-sm">20-30 minutes average delivery time</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                                    <Phone size={20} className="text-blue-600" />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-900 mb-1">Service Hours</h4>
                                    <p className="text-gray-600 text-sm">
                                        Daily: 10:00 AM - 11:00 PM<br />
                                        Extended hours on weekends
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                                    <Mail size={20} className="text-purple-600" />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-900 mb-1">Coverage Status</h4>
                                    <p className="text-gray-600 text-sm">
                                        Currently serving 15+ neighborhoods<br />
                                        Expanding to new areas monthly
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default MapSection
