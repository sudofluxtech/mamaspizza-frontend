'use client'

import React, { useState } from 'react'
import { Mail, Phone, MapPin, Clock, Send, MessageCircle, Users, Star, User } from 'lucide-react'
import { toast } from 'sonner'
import { useRestaurants } from '@/hooks/restaurant.hook'
import { CONTACTS_API } from '@/app/api'

const ContactPage = () => {
  const { restaurants } = useRestaurants()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  })
  const [loading, setLoading] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch(CONTACTS_API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          message: formData.message
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to send message')
      }

       await response.json()
      
      toast.success("Message sent successfully! We'll get back to you within 24 hours.", {
        style: { background: "#10b981", color: "#fff" },
      })
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        message: ''
      })
    } catch (error: any) {
      console.error('Contact form submission error:', error)
      toast.error(error.message || "Failed to send message. Please try again.", {
        style: { background: "#ef4444", color: "#fff" },
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className=" min-h-screen py-5 md:py-20">
      {/* Header Section */}
      <section className="ah-container mx-auto text-center mb-20">
        <div className="inline-flex items-center bg-orange-100 text-orange-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
          <span className="w-2 h-2 bg-orange-500 rounded-full mr-2 animate-pulse" />
          Get in Touch
        </div>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-500">
            Let&apos;s Connect
          </span>
        </h1>
        <p className="text-gray-600 text-lg max-w-3xl mx-auto leading-relaxed">
          Have questions, feedback, or want to partner with us? We&apos;d love to hear from you. 
          Our team is here to help and will get back to you within 24 hours.
        </p>
      </section>

      <div className="ah-container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Information */}
          <div className="lg:col-span-1 space-y-8">
            {/* Contact Methods */}
            <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Contact Information</h3>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Phone size={24} className="text-orange-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Phone</h4>
                    <p className="text-gray-600">07424 295393</p>
                    <p className="text-sm text-gray-500">Mon-Sun: 9:00 AM - 10:00 PM</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Mail size={24} className="text-orange-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Email</h4>
                    <p className="text-gray-600">order@mamaspizzalondon.com</p>
                    <p className="text-sm text-gray-500">We reply within 24 hours</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <MapPin size={24} className="text-orange-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Address</h4>
                    <div 
                      className="text-gray-600"
                      dangerouslySetInnerHTML={{
                        __html: restaurants[0]?.shop_address || "Loading address..."
                      }}
                    />
                    <p className="text-sm text-gray-500">United Kingdom</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-gradient-to-br from-orange-600 to-red-500 rounded-3xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-6">Quick Stats</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Users size={20} />
                    <span className="text-orange-100">Happy Customers</span>
                  </div>
                  <span className="font-bold text-2xl">50K+</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Star size={20} />
                    <span className="text-orange-100">Average Rating</span>
                  </div>
                  <span className="font-bold text-2xl">4.9★</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Clock size={20} />
                    <span className="text-orange-100">Response Time</span>
                  </div>
                  <span className="font-bold text-2xl">24h</span>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 md:p-12">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                  <MessageCircle size={24} className="text-orange-600" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-gray-900">Send us a Message</h2>
                  <p className="text-gray-600">We&apos;d love to hear from you!</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name Field */}
                <div>
                  <label htmlFor="name" className="block text-xs font-semibold text-gray-700 mb-1">
                    Full Name *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User size={16} className="text-gray-400" />
                    </div>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter your full name"
                      className="w-full rounded-xl border-2 border-gray-200 bg-white pl-10 pr-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300"
                    />
                  </div>
                </div>

                {/* Email Field */}
                <div>
                  <label htmlFor="email" className="block text-xs font-semibold text-gray-700 mb-1">
                    Email Address *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail size={16} className="text-gray-400" />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Enter your email"
                      className="w-full rounded-xl border-2 border-gray-200 bg-white pl-10 pr-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300"
                    />
                  </div>
                </div>

                {/* Phone Field */}
                <div>
                  <label htmlFor="phone" className="block text-xs font-semibold text-gray-700 mb-1">
                    Phone Number *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Phone size={16} className="text-gray-400" />
                    </div>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="Enter your phone number"
                      className="w-full rounded-xl border-2 border-gray-200 bg-white pl-10 pr-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300"
                    />
                  </div>
                </div>

                {/* Message Field */}
                <div>
                  <label htmlFor="message" className="block text-xs font-semibold text-gray-700 mb-1">
                    Message *
                  </label>
                  <div className="relative">
                    <div className="absolute top-3 left-3 flex items-start pointer-events-none">
                      <MessageCircle size={16} className="text-gray-400" />
                    </div>
                    <textarea
                      id="message"
                      name="message"
                      rows={6}
                      required
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Tell us more about your inquiry..."
                      className="w-full rounded-xl border-2 border-gray-200 bg-white pl-10 pr-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300 resize-none"
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="group w-full bg-gradient-to-r from-orange-600 to-red-500 disabled:opacity-60 disabled:cursor-not-allowed text-white px-6 py-2.5 rounded-xl text-sm font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    <Send size={16} className="group-hover:translate-x-1 transition-transform duration-300" />
                    {loading ? 'Sending Message...' : 'Send Message'}
                  </button>
                </div>

                <div className="text-center pt-2">
                  <p className="text-xs text-gray-500">
                    <span className="text-orange-600 font-medium">*</span> Required fields. 
                    We typically respond within 24 hours.
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Additional Info Section */}
        <section className="mt-20">
          <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8 md:p-12">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Why Choose Our Support?
              </h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                We&apos;re committed to providing exceptional customer service and support for all your needs.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Clock size={32} className="text-orange-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">24/7 Support</h3>
                <p className="text-gray-600">Round-the-clock assistance for urgent matters</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Users size={32} className="text-orange-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Expert Team</h3>
                <p className="text-gray-600">Experienced professionals ready to help</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Star size={32} className="text-orange-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Quality Service</h3>
                <p className="text-gray-600">We prioritize your satisfaction above all</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}

export default ContactPage
