import { Search, MessageCircle, Package, Clock } from "lucide-react"

const ProcessSection = () => {
    const steps = [
        {
            id: 1,
            number: "01",
            icon: Search,
            title: "BROWSE OUR MENU",
            description: "Explore our extensive menu featuring local favorites and international cuisine. Find exactly what you're craving with our easy-to-navigate categories.",
            highlight: "Find your perfect meal"
        },
        {
            id: 2,
            number: "02",
            icon: MessageCircle,
            title: "PLACE YOUR ORDER",
            description: "Add items to your cart, customize your order, and checkout securely. Our streamlined process makes ordering quick and hassle-free.",
            highlight: "Quick & secure checkout"
        },
        {
            id: 3,
            number: "03",
            icon: Package,
            title: "WE PREPARE YOUR FOOD",
            description: "Our partner restaurants prepare your food fresh to order. We ensure quality and freshness while maintaining our fast delivery promise.",
            highlight: "Fresh to order"
        },
        {
            id: 4,
            number: "04",
            icon: Clock,
            title: "ENJOY DELIVERY",
            description: "Track your order in real-time and receive your food at your doorstep in under 30 minutes. Hot, fresh, and ready to enjoy.",
            highlight: "30-minute delivery"
        }
    ]

    return (
        <section className="bg-white fade-top-mask z-20 py-20">
            <div className="ah-container  relative">

                                                                 {/* Title */}
                 <div className="text-center mb-12">
                     <div className="inline-flex items-center bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-medium mb-3">
                         <span className="w-1.5 h-1.5 bg-orange-500 rounded-full mr-2 animate-pulse"></span>
                         Simple & Fast
                     </div>
                     <h2 className="text-3xl md:text-4xl font-bold mb-4">
                         <span className="text-gray-900">How It</span>
                         <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-500"> Works</span>
                     </h2>
                     <p className="text-gray-600 text-base max-w-xl mx-auto">
                         Getting your favorite food delivered has never been easier. 
                         Follow these simple steps and enjoy delicious meals in minutes.
                     </p>
                 </div>

                {/* Process Steps Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
                    {steps.map((step, index) => (
                        <div key={index} className={`flex items-start space-x-6 ${step.id % 2 === 1 ? 'md:-mt-20' : ''}`}>
                            {/* Number and Line */}
                            <div className="flex flex-col items-center">
                                <div className="text-4xl md:text-5xl font-bold text-orange-600 leading-none mb-2">
                                    {step.number}
                                </div>
                                <div className="w-0.5 h-16 bg-orange-600"></div>
                            </div>

                            {/* Content */}
                            <div className="flex-1">
                                {/* Icon */}
                                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-4">
                                    <step.icon className="w-6 h-6 text-orange-600" />
                                </div>

                                {/* Title */}
                                <h3 className="text-xl font-bold text-gray-900 mb-3 uppercase tracking-wide">
                                    {step.title}
                                </h3>

                                {/* Description */}
                                <p className="text-gray-600 leading-relaxed">
                                    {step.description}
                                    <span className="text-orange-600 font-medium ml-1">
                                        {step.highlight}
                                    </span>
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Bottom CTA */}
                {/* <div className="text-center mt-16">
                    <div className="bg-gradient-to-r from-orange-600 to-red-500 rounded-3xl p-8 text-white">
                        <h3 className="text-2xl md:text-3xl font-bold mb-4">
                            Ready to Get Started?
                        </h3>
                        <p className="text-orange-100 mb-6 max-w-2xl mx-auto">
                            Join thousands of customers who trust us for their daily meals.
                            Start your first order today and experience the difference!
                        </p>
                        <button className="bg-white text-orange-600 px-8 py-3 rounded-full text-lg font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:-translate-y-1">
                            Start Ordering
                        </button>
                    </div>
                </div> */}
            </div>
        </section>
    )
}

export default ProcessSection
