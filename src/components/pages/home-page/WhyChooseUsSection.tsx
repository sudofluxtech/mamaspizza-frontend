import { Clock,  Star, Heart, Shield,  CheckCircle } from "lucide-react"
import Link from "next/link"

const WhyChooseUsSection = () => {
    const features = [
        {
            icon: Clock,
            title: "Fast Delivery",
            description: "Get your food delivered in under 30 minutes, guaranteed fresh and hot.",
            color: "bg-orange-100 text-orange-600",
            highlight: "30 min delivery"
        },
        {
            icon: Star,
            title: "Top Quality",
            description: "We partner with the best restaurants to ensure premium quality food.",
            color: "bg-yellow-100 text-yellow-600",
            highlight: "Premium partners"
        },
        {
            icon: Heart,
            title: "Fresh Ingredients",
            description: "All our ingredients are fresh, locally sourced, and carefully selected.",
            color: "bg-red-100 text-red-600",
            highlight: "Locally sourced"
        },
        {
            icon: Shield,
            title: "Safe & Secure",
            description: "Your safety is our priority. Contactless delivery and secure payments.",
            color: "bg-blue-100 text-blue-600",
            highlight: "Contactless delivery"
        },
    ]



    return (
        <section className="bg-gradient-to-br fade-top-mask from-gray-50 to-white py-20">
            <div className="ah-container mx-auto">
                {/* Title & Subtitle */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-xs font-medium mb-3">
                        <span className="w-1.5 h-1.5 bg-orange-500 rounded-full mr-2 animate-pulse"></span>
                        Why Choose Us
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        <span className="text-gray-900">The Perfect</span>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-500"> Choice</span>
                    </h2>
                    <p className="text-gray-600 text-base max-w-xl mx-auto">
                        We&apos;re committed to providing you with the best food delivery experience. 
                        Here&apos;s what makes us different from the rest.
                    </p>
                </div>

      

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 relative overflow-hidden"
                        >
                            {/* Background Pattern */}
                            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-orange-50 to-transparent rounded-full -translate-y-10 translate-x-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            
                            {/* Icon */}
                            <div className={`w-16 h-16 ${feature.color} rounded-2xl flex items-center justify-center mb-6 relative z-10 group-hover:scale-110 transition-transform duration-300`}>
                                <feature.icon className="w-8 h-8" />
                            </div>

                            {/* Content */}
                            <div className="relative z-10">
                                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-orange-600 transition-colors duration-300">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-600 leading-relaxed mb-4">
                                    {feature.description}
                                </p>
                                
                                {/* Highlight Badge */}
                                <div className="inline-flex items-center gap-2 text-sm font-medium text-orange-600">
                                    <CheckCircle size={16} />
                                    {feature.highlight}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Bottom CTA */}
                <div className="text-center">
                    <div className="bg-gradient-to-r from-orange-600 to-red-500 rounded-3xl p-8 text-white relative overflow-hidden">
                        {/* Background Pattern */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
                        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>
                        
                        <div className="relative z-10">
                            <h3 className="text-2xl md:text-3xl font-bold mb-4">
                                Ready to Experience the Difference?
                            </h3>
                            <p className="text-orange-100 mb-6 max-w-2xl mx-auto">
                                Join thousands of satisfied customers who choose us for their daily meals. 
                                Start your journey with us today!
                            </p>
                            <Link href="/menu" className="bg-white text-orange-600 px-8 py-3 rounded-full text-lg font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:-translate-y-1 shadow-lg">
                                Start Ordering Now
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default WhyChooseUsSection
