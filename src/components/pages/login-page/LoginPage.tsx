'use client'

import React, { useState, useEffect } from 'react'
import { Mail, Lock, Eye, EyeOff, LogIn, ChefHat } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { toast } from 'sonner'

import Logo from '@/components/core/Logo'
import { useAuth } from '@/lib/stores/useAuth'
import { authAPI } from '@/lib/api/auth.api'
import { useRouter } from 'next/navigation'

const LoginPage = () => {
    const [showPassword, setShowPassword] = useState(false)
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    })
    const { setUser, setLoading, loading, user, isAuthenticated } = useAuth()
    const router = useRouter()

    // Load email from localStorage on component mount
    useEffect(() => {
        const savedEmail = localStorage.getItem('loginEmail');
        if (savedEmail) {
            setFormData(prev => ({
                ...prev,
                email: savedEmail
            }));
            // Clear the saved email after using it
            localStorage.removeItem('loginEmail');
        }
    }, []);

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
        e.preventDefault()
        setLoading(true)

        const result = await authAPI.login(formData.email, formData.password)

        if (result.success && result.user && result.token) {
            setUser(result.user, result.token)
            toast.success("Login successful!", {
                style: { background: "#10b981", color: "#fff" },
            });
            // Navigation will be handled by useEffect
        } else {
            // Show toast if error using sonner
            toast.error(result.message || "Login failed", {
                style: { background: "#ef4444", color: "#fff" },
            });
        }

        setLoading(false)
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
                        <h2 className="text-3xl font-bold mb-3">Welcome Back!</h2>
                        <p className="text-lg text-white/90 max-w-md">
                            Sign in to continue your culinary journey with us
                        </p>
                    </div>
                </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-4 lg:p-6 bg-gradient-to-br from-gray-50 to-white">
                <div className="w-full max-w-md">
                    {/* Mobile Logo */}
                    <div className="lg:hidden text-center mb-6">
                        <Link href="/" className="inline-block hover:opacity-80 transition-opacity duration-300">
                            <div className="w-12 h-12 bg-gradient-to-r from-orange-600 to-red-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                                <ChefHat size={24} className="text-white" />
                            </div>
                        </Link>
                        <h1 className="text-xl font-bold text-gray-900">Welcome Back</h1>
                        <p className="text-sm text-gray-600">Sign in to your account</p>
                    </div>

                    {/* Desktop Header */}
                    <div className="hidden lg:block mb-6">
                        <h1 className="text-2xl font-bold text-gray-900 mb-1">
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-500">
                                Welcome Back
                            </span>
                        </h1>
                        <p className="text-sm text-gray-600">
                            Sign in to continue your culinary journey
                        </p>
                    </div>

                    {/* Login Form */}
                    <div>
                        <form onSubmit={handleSubmit} className="space-y-4">
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
                                        placeholder={formData.email ? "" : "Enter your email"}
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
                                        placeholder="Enter your password"
                                        className="w-full rounded-xl border-2 border-gray-200 bg-white pl-10 pr-10 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                                    >
                                        {showPassword ? (
                                            <EyeOff size={16} className="text-gray-400 hover:text-gray-600" />
                                        ) : (
                                            <Eye size={16} className="text-gray-400 hover:text-gray-600" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <div className="pt-2">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="group w-full bg-gradient-to-r from-orange-600 to-red-500 disabled:opacity-60 disabled:cursor-not-allowed text-white px-6 py-2.5 rounded-xl text-sm font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2"
                                >
                                    <LogIn size={16} className="group-hover:translate-x-1 transition-transform duration-300" />
                                    {loading ? 'Signing In...' : 'Sign In'}
                                </button>
                            </div>

                            {/* Sign Up Link */}
                            <div className="text-center pt-2">
                                <p className="text-xs text-gray-500">
                                    Don&apos;t have an account?{' '}
                                    <a
                                        href="/sign-up"
                                        className="text-orange-600 hover:text-orange-700 font-medium"
                                    >
                                        Sign up here
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

export default LoginPage