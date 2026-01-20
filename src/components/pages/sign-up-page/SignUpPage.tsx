'use client'

import React, { useState, useEffect } from 'react'
import { Mail, Lock, Eye, EyeOff, UserPlus, User } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import Logo from '@/components/core/Logo'
import { useAuth } from '@/lib/stores/useAuth'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { REGISTER_API } from '@/app/api'

const SignUpPage = () => {
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        password_confirmation: ''
    })
    const { setLoading, loading, user, isAuthenticated } = useAuth()
    const router = useRouter()

    // Redirect if already authenticated
    useEffect(() => {
        if (isAuthenticated && user) {
            if (user.role === 'admin' || user.role === 'staff') {
                router.replace('/admin')
            } else {
                router.replace('/')
            }
        }
    }, [isAuthenticated, user, router])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (formData.password !== formData.password_confirmation) {
            toast.error("Passwords do not match", {
                style: { background: "#ef4444", color: "#fff" },
            });
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(REGISTER_API, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                    password_confirmation: formData.password_confirmation
                })
            });

            const result = await response.json();

            if (response.ok && result.success) {
                toast.success("Account created successfully! Redirecting...", {
                    style: { background: "#10b981", color: "#fff" },
                });

                // Redirect to login page after successful registration
                setTimeout(() => {
                    router.push('/login');
                }, 2000);
            } else {
                toast.error(result.message || "Registration failed", {
                    style: { background: "#ef4444", color: "#fff" },
                });
            }
        } catch (error) {
            console.error("An error occurred during registration", error);
            toast.error("An error occurred during registration", {
                style: { background: "#ef4444", color: "#fff" },
            });
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen flex">
            {/* Left Side - Food Image */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
                <div className="absolute inset-0 bg-black/40 z-10" />
                <Image
                    src="/hero.jpg"
                    alt="Delicious Food"
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 z-20 flex items-center justify-center">
                    <div className="text-center flex flex-col items-center text-white p-6">
                        <Link href="/" className="hover:opacity-80 transition-opacity duration-300">
                            <Logo />
                        </Link>
                        <h2 className="text-3xl font-bold mb-3">Join Us Today!</h2>
                        <p className="text-lg text-white/90 max-w-md">
                            Create your account and start your culinary journey with us
                        </p>
                    </div>
                </div>
            </div>

            {/* Right Side - Sign Up Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-4 lg:p-6 bg-gradient-to-br from-gray-50 to-white">
                <div className="w-full max-w-md">
                    {/* Mobile Logo */}
                    <div className="lg:hidden text-center mb-6">
                        <Link href="/" className="inline-block hover:opacity-80 transition-opacity duration-300">
                            <div className="w-12 h-12 bg-gradient-to-r from-orange-600 to-red-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                                <UserPlus size={24} className="text-white" />
                            </div>
                        </Link>
                        <h1 className="text-xl font-bold text-gray-900">Create Account</h1>
                        <p className="text-sm text-gray-600">Sign up to get started</p>
                    </div>

                    {/* Desktop Header */}
                    <div className="hidden lg:block mb-6">
                        <h1 className="text-2xl font-bold text-gray-900 mb-1">
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-500">
                                Create Account
                            </span>
                        </h1>
                        <p className="text-sm text-gray-600">
                            Join us and start your culinary journey
                        </p>
                    </div>

                    {/* Sign Up Form */}
                    <div>
                        <form onSubmit={handleSubmit} className="space-y-4">
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

                            {/* Password Field */}
                            <div>
                                <label htmlFor="password" className="block text-xs font-semibold text-gray-700 mb-1">
                                    Password *
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock size={16} className="text-gray-400" />
                                    </div>
                                    <input
                                        id="password"
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        required
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        placeholder="Create a password"
                                        className="w-full rounded-xl border-2 border-gray-200 bg-white pl-10 pr-10 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                    >
                                        {showPassword ? (
                                            <EyeOff size={16} className="text-gray-400 hover:text-gray-600" />
                                        ) : (
                                            <Eye size={16} className="text-gray-400 hover:text-gray-600" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Confirm Password Field */}
                            <div>
                                <label htmlFor="password_confirmation" className="block text-xs font-semibold text-gray-700 mb-1">
                                    Confirm Password *
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock size={16} className="text-gray-400" />
                                    </div>
                                    <input
                                        id="password_confirmation"
                                        name="password_confirmation"
                                        type={showConfirmPassword ? "text" : "password"}
                                        required
                                        value={formData.password_confirmation}
                                        onChange={handleInputChange}
                                        placeholder="Confirm your password"
                                        className="w-full rounded-xl border-2 border-gray-200 bg-white pl-10 pr-10 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                    >
                                        {showConfirmPassword ? (
                                            <EyeOff size={16} className="text-gray-400 hover:text-gray-600" />
                                        ) : (
                                            <Eye size={16} className="text-gray-400 hover:text-gray-600" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Terms and Conditions */}
                            <div className="flex items-start">
                                <input
                                    type="checkbox"
                                    required
                                    className="w-3.5 h-3.5 accent-orange-500 text-white mt-0.5"
                                />
                                <label className="ml-2 text-xs text-gray-600">
                                    I agree to the{' '}
                                    <a href="/terms-condition" className="text-orange-600 hover:text-orange-700 font-medium">
                                        Terms and Conditions
                                    </a>{' '}
                                    and{' '}
                                    <a href="/privacy-policy" className="text-orange-600 hover:text-orange-700 font-medium">
                                        Privacy Policy
                                    </a>
                                </label>
                            </div>

                            {/* Submit Button */}
                            <div className="pt-2">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="group w-full bg-gradient-to-r from-orange-600 to-red-500 disabled:opacity-60 disabled:cursor-not-allowed text-white px-6 py-2.5 rounded-xl text-sm font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2"
                                >
                                    <UserPlus size={16} className="group-hover:translate-x-1 transition-transform duration-300" />
                                    {loading ? 'Creating Account...' : 'Create Account'}
                                </button>
                            </div>

                            {/* Sign In Link */}
                            <div className="text-center pt-2">
                                <p className="text-xs text-gray-500">
                                    Already have an account?{' '}
                                    <a
                                        href="/login"
                                        className="text-orange-600 hover:text-orange-700 font-medium"
                                    >
                                        Sign in here
                                    </a>
                                </p>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SignUpPage
