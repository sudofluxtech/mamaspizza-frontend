"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import {
  CheckCircle,
  Clock,
  Eye,
  EyeOff,
  Sparkles,
  Award,
  CheckCircle2,
  Copy,
  Shield,
  Zap,
  Star,
  Truck,
  Gift,
  Heart,
  ArrowRight,
  Calendar,
  CreditCard,
  Mail,
  ExternalLink,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";
import { useGuest } from "@/lib/guest/GuestProvider";
import { useAuth } from "@/lib/stores/useAuth";
import { toast } from "sonner";
import {
  GUEST_STRIPE_VERIFY_PAYMENT_API,
  STRIPE_VERIFY_PAYMENT_API,
  REGISTER_API,
} from "@/app/api";
// import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'; // No longer needed

interface PaymentVerificationResult {
  success: boolean;
  message: string;
  data?: {
    order_id: number;
    order_number: string;
    payment_status: string;
    session_id: string;
    payment_intent_id: string;
    stripe_session_id: string;
    amount_total: string;
    customer_email: string;
    paid_at: string;
    payment_method: string;
    order_tracking_url: string;
    webhook_updated: string;
  };
}

interface SignupFormData {
  password: string;
}

interface SignupFormErrors {
  password?: string;
}

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { guestId } = useGuest();
  const { isAuthenticated, token } = useAuth();

  const [verificationResult, setVerificationResult] =
    useState<PaymentVerificationResult | null>(null);
  const [isVerifying, setIsVerifying] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Signup form state
  const [signupFormData, setSignupFormData] = useState<SignupFormData>({
    password: "",
  });
  const [signupFormErrors, setSignupFormErrors] = useState<SignupFormErrors>(
    {}
  );
  const [showPassword, setShowPassword] = useState(false);
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  // const [showWelcomeDialog, setShowWelcomeDialog] = useState(false); // No longer needed
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const sessionId = searchParams.get("session");

  // Welcome dialog disabled - no longer showing
  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     setShowWelcomeDialog(true);
  //   }, 1000);

  //   return () => clearTimeout(timer);
  // }, []);

  useEffect(() => {
    const verifyPayment = async () => {
      if (!sessionId) {
        setError("Missing session ID");
        setIsVerifying(false);
        return;
      }

      // For guest users, wait a bit for guestId to be available
      if (!isAuthenticated && !guestId) {
        // Wait a bit for guest ID to be loaded
        setTimeout(() => {
          if (!guestId) {
            setError(
              "Missing guest ID. Please refresh the page and try again."
            );
            setIsVerifying(false);
          }
        }, 2000);
        return;
      }

      try {
        let response;

        if (isAuthenticated) {
          // Authenticated user verification
          response = await fetch(STRIPE_VERIFY_PAYMENT_API, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
            body: JSON.stringify({ session_id: sessionId }),
          });
        } else {
          // Guest user verification

          response = await fetch(GUEST_STRIPE_VERIFY_PAYMENT_API, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            body: JSON.stringify({
              session_id: sessionId,
              guest_id: guestId,
            }),
          });
        }

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to verify payment");
        }

        const result = await response.json();
        setVerificationResult(result);

        if (result.success) {
          toast.success("Payment verified successfully!");
        } else {
          toast.error(result.message || "Payment verification failed");
        }
      } catch (err: any) {
        console.error("Payment verification error:", err);
        setError(err.message || "Payment verification failed");
        toast.error("Payment verification failed");
      } finally {
        setIsVerifying(false);
      }
    };

    // Only run verification if we have the required data
    if (sessionId && (isAuthenticated || guestId)) {
      verifyPayment();
    } else if (sessionId && !isAuthenticated && !guestId) {
      // For guest users, wait a bit for guest ID to be available
      const timer = setTimeout(() => {
        if (guestId) {
          verifyPayment();
        } else {
          setError(
            "Guest ID not available. Please refresh the page and try again."
          );
          setIsVerifying(false);
        }
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [sessionId, guestId, isAuthenticated, token]);

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      toast.success("Copied to clipboard!");
      setTimeout(() => setCopiedField(null), 2000);
    } catch {
      toast.error("Failed to copy to clipboard");
    }
  };

  const handleSignupInputChange = (
    field: keyof SignupFormData,
    value: string
  ) => {
    setSignupFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (signupFormErrors[field]) {
      setSignupFormErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  const validateSignupForm = (): boolean => {
    const newErrors: SignupFormErrors = {};

    if (!signupFormData.password.trim()) {
      newErrors.password = "Password is required";
    } else if (signupFormData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setSignupFormErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignup = async () => {
    if (!validateSignupForm()) {
      toast.error("Please enter a password");
      return;
    }

    if (!guestId) {
      toast.error("Guest ID not found. Please refresh and try again.");
      return;
    }

    if (!verificationResult?.data?.customer_email) {
      toast.error("Customer email not found. Please refresh and try again.");
      return;
    }

    setIsSigningUp(true);
    try {
      const response = await fetch(REGISTER_API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          name: guestId,
          email: verificationResult.data.customer_email,
          password: signupFormData.password,
          password_confirmation: signupFormData.password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Registration failed");
      }

      const result = await response.json();
      if (result.success) {
        toast.success("Account created successfully!");
        setShowSuccessDialog(true);
        setTimeout(() => {
          router.push("/");
        }, 2000);
      }
    } catch (error: any) {
      console.error("Registration error:", error);
      toast.error(
        error.message || "Failed to create account. Please try again."
      );
    } finally {
      setIsSigningUp(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <main className="min-h-screen ">
      <div className="ah-container px-4 sm:px-6 lg:px-8 py-8 sm:py-16 lg:py-24 mt-[200px]">
        <div className="max-w-4xl mx-auto">
          {isVerifying ? (
            <div className="text-center space-y-8">
              <div className="relative">
                <div className="w-20 h-20 mx-auto bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <RefreshCw className="w-10 h-10 text-white animate-spin" />
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white animate-pulse" />
                </div>
              </div>
              <div className="space-y-4">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  {!isAuthenticated && !guestId
                    ? "Loading Guest Information..."
                    : "Verifying Your Payment"}
                </h2>
                <p className="text-lg text-gray-600 max-w-md mx-auto">
                  {!isAuthenticated && !guestId
                    ? "We're loading your guest information to verify your payment. This will just take a moment."
                    : "We're confirming your payment and preparing your order. This will just take a moment."}
                </p>
                {!isAuthenticated && !guestId && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md mx-auto">
                    <div className="flex items-center gap-2 text-blue-700">
                      <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                      <span className="text-sm font-medium">
                        Waiting for guest ID...
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : error ? (
            <div className="text-center space-y-8">
              <div className="w-20 h-20 mx-auto bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center">
                <Clock className="w-10 h-10 text-white" />
              </div>
              <div className="space-y-4">
                <h2 className="text-3xl font-bold text-red-600">
                  Payment Verification Failed
                </h2>
                <p className="text-lg text-gray-600 max-w-md mx-auto">
                  {error}
                </p>
                <button
                  onClick={() => window.location.reload()}
                  className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-3 rounded-xl font-semibold hover:from-orange-600 hover:to-red-600 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  Try Again
                </button>
              </div>
            </div>
          ) : verificationResult?.success && verificationResult.data ? (
            <div className="space-y-8">
              {/* Success Header */}
              <div className="text-center space-y-6">
                <div className="space-y-3">
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                    Payment Successful!
                  </h2>
                </div>
              </div>

              {/* Order Details Card */}
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                <div className="bg-gradient-to-r from-orange-500 to-red-500 px-6 py-4">
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <Award className="w-6 h-6" />
                    Order Details
                  </h3>
                </div>
                <div className="p-6 space-y-6">
                  {/* Order Info Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-600">
                          Order ID
                        </span>
                        <button
                          onClick={() =>
                            copyToClipboard(
                              verificationResult.data?.order_id.toString() ||
                                "",
                              "order_id"
                            )
                          }
                          className="p-1 hover:bg-gray-200 rounded transition-colors"
                        >
                          {copiedField === "order_id" ? (
                            <CheckCircle2 className="w-4 h-4 text-green-600" />
                          ) : (
                            <Copy className="w-4 h-4 text-gray-400" />
                          )}
                        </button>
                      </div>
                      <p className="font-bold text-lg text-gray-900">
                        #{verificationResult.data.order_id}
                      </p>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-600">
                          Order Number
                        </span>
                        <button
                          onClick={() =>
                            copyToClipboard(
                              verificationResult.data?.order_number || "",
                              "order_number"
                            )
                          }
                          className="p-1 hover:bg-gray-200 rounded transition-colors"
                        >
                          {copiedField === "order_number" ? (
                            <CheckCircle2 className="w-4 h-4 text-green-600" />
                          ) : (
                            <Copy className="w-4 h-4 text-gray-400" />
                          )}
                        </button>
                      </div>
                      <p className="font-bold text-lg text-gray-900">
                        {verificationResult.data.order_number}
                      </p>
                    </div>
                  </div>

                  {/* Payment Info Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                      <div className="flex items-center gap-2 mb-2">
                        <Shield className="w-5 h-5 text-green-600" />
                        <span className="text-sm font-medium text-green-700">
                          Payment Status
                        </span>
                      </div>
                      <p className="font-bold text-lg text-green-800 capitalize">
                        {verificationResult.data.payment_status}
                      </p>
                    </div>

                    <div className="bg-orange-50 rounded-xl p-4 border border-orange-200">
                      <div className="flex items-center gap-2 mb-2">
                        <Zap className="w-5 h-5 text-orange-600" />
                        <span className="text-sm font-medium text-orange-700">
                          Total Amount
                        </span>
                      </div>
                      <p className="font-bold text-2xl text-orange-800">
                        ${verificationResult.data.amount_total}
                      </p>
                    </div>
                  </div>

                  {/* Additional Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {verificationResult.data.customer_email && (
                      <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                        <div className="flex items-center gap-2 mb-2">
                          <Mail className="w-5 h-5 text-blue-600" />
                          <span className="text-sm font-medium text-blue-700">
                            Customer Email
                          </span>
                        </div>
                        <p className="font-medium text-blue-800">
                          {verificationResult.data.customer_email}
                        </p>
                      </div>
                    )}

                    <div className="bg-purple-50 rounded-xl p-4 border border-purple-200">
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar className="w-5 h-5 text-purple-600" />
                        <span className="text-sm font-medium text-purple-700">
                          Paid At
                        </span>
                      </div>
                      <p className="font-medium text-purple-800">
                        {formatDate(verificationResult.data.paid_at)}
                      </p>
                    </div>
                  </div>

                  {/* Payment Method */}
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                    <div className="flex items-center gap-2 mb-2">
                      <CreditCard className="w-5 h-5 text-gray-600" />
                      <span className="text-sm font-medium text-gray-700">
                        Payment Method
                      </span>
                    </div>
                    <p className="font-medium text-gray-800 capitalize">
                      {verificationResult.data.payment_method}
                    </p>
                  </div>

                  {/* Order Tracking */}
                  {verificationResult.data.order_tracking_url && (
                    <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-4 border border-orange-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Truck className="w-5 h-5 text-orange-600" />
                          <span className="text-sm font-medium text-orange-700">
                            Track Your Order
                          </span>
                        </div>
                        <a
                          href={verificationResult.data.order_tracking_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-orange-600 hover:text-orange-700 font-medium transition-colors"
                        >
                          <span>Track Order</span>
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Signup Section - Only for guest users */}
              {!isAuthenticated && (
                <div className="bg-gradient-to-br from-orange-50 via-white to-red-50 rounded-2xl shadow-xl border border-orange-200 overflow-hidden">
                  <div className="bg-gradient-to-r from-orange-500 to-red-500 px-6 py-4">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                      <Star className="w-6 h-6" />
                      Join Our Family & Unlock Amazing Benefits!
                    </h3>
                  </div>

                  <div className="p-6">
                    <div className="text-center mb-8">
                      <p className="text-lg text-gray-700 mb-6">
                        Create your account now and enjoy exclusive perks on
                        every order!
                      </p>

                      {/* Benefits Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
                          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Truck className="w-6 h-6 text-blue-600" />
                          </div>
                          <h4 className="font-bold text-gray-900 mb-2">
                            Track Orders
                          </h4>
                          <p className="text-sm text-gray-600">
                            Real-time order tracking from kitchen to your door
                          </p>
                        </div>

                        <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
                          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Gift className="w-6 h-6 text-green-600" />
                          </div>
                          <h4 className="font-bold text-gray-900 mb-2">
                            Exclusive Deals
                          </h4>
                          <p className="text-sm text-gray-600">
                            Special offers and discounts just for members
                          </p>
                        </div>

                        <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
                          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Heart className="w-6 h-6 text-red-600" />
                          </div>
                          <h4 className="font-bold text-gray-900 mb-2">
                            Save Favorites
                          </h4>
                          <p className="text-sm text-gray-600">
                            Quick reorder your favorite items anytime
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Signup Form */}
                    <div className="max-w-md mx-auto">
                      <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
                        <h4 className="text-lg font-bold text-gray-900 mb-4 text-center">
                          Create Your Account
                        </h4>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Create Password *
                            </label>
                            <div className="relative">
                              <input
                                type={showPassword ? "text" : "password"}
                                value={signupFormData.password}
                                onChange={(e) =>
                                  handleSignupInputChange(
                                    "password",
                                    e.target.value
                                  )
                                }
                                className={`w-full px-4 py-3 pr-12 border rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all text-sm ${
                                  signupFormErrors.password
                                    ? "border-red-500"
                                    : "border-gray-300"
                                }`}
                                placeholder="Enter your password"
                              />
                              <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                              >
                                {showPassword ? (
                                  <EyeOff className="w-5 h-5" />
                                ) : (
                                  <Eye className="w-5 h-5" />
                                )}
                              </button>
                            </div>
                            {signupFormErrors.password && (
                              <p className="text-red-500 text-sm mt-2">
                                {signupFormErrors.password}
                              </p>
                            )}
                          </div>

                          <button
                            onClick={handleSignup}
                            disabled={isSigningUp}
                            className="w-full bg-orange-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm sm:text-base"
                          >
                            {isSigningUp ? (
                              <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                Creating...
                              </>
                            ) : (
                              "Create Account"
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/"
                  className="bg-white border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-xl font-semibold hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                >
                  <ArrowRight className="w-5 h-5" />
                  Explore More Menu
                </Link>
                {verificationResult.data.order_tracking_url && (
                  <a
                    href={verificationResult.data.order_tracking_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-4 rounded-xl font-semibold hover:from-orange-600 hover:to-red-600 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                  >
                    <Truck className="w-5 h-5" />
                    Track Order
                  </a>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center space-y-8">
              <div className="w-20 h-20 mx-auto bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                <Clock className="w-10 h-10 text-white animate-spin" />
              </div>
              <div className="space-y-4">
                <h2 className="text-3xl font-bold text-gray-900">
                  Verifying Your Order
                </h2>
                <p className="text-lg text-gray-600 max-w-md mx-auto">
                  We are confirming your payment. This may take a few moments.
                </p>
              </div>
              <Link
                href="/"
                className="inline-block bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-4 rounded-xl font-semibold hover:from-orange-600 hover:to-red-600 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Back to Home
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Success Dialog */}
      {showSuccessDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-2xl border border-gray-100 animate-in zoom-in-95 duration-300">
            <div className="relative inline-block mb-6">
              <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg">
                <CheckCircle className="w-10 h-10 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center animate-bounce">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
            </div>

            <h2 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-3">
              Welcome to Our Family!
            </h2>

            <p className="text-gray-600 mb-8 leading-relaxed">
              Your account has been created successfully! You can now track your
              orders, save your favorites, and enjoy exclusive deals on every
              order.
            </p>

            <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-4 border border-orange-200">
              <div className="flex items-center justify-center gap-3 text-orange-600">
                <div className="w-5 h-5 border-2 border-orange-600 border-t-transparent rounded-full animate-spin" />
                <span className="font-medium">
                  Redirecting to explore more menu...
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Welcome Dialog - Disabled */}
      {/* <Dialog open={showWelcomeDialog} onOpenChange={setShowWelcomeDialog}>
        <DialogContent className="max-w-md mx-auto" showCloseButton={false}>
          <DialogHeader className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              Welcome to Mama&apos;s Pizza! 🎉
            </DialogTitle>
            <DialogDescription className="text-gray-600 text-base">
              Your payment has been processed successfully! We&apos;re preparing your delicious order with love and care.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 pt-4">
            <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-lg p-4 border border-orange-200">
              <div className="flex items-center gap-3 text-orange-700">
                <Truck className="w-5 h-5" />
                <span className="font-medium">Your order is being prepared</span>
              </div>
            </div>
            
            <div className="text-center">
              <button
                onClick={() => setShowWelcomeDialog(false)}
                className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-3 rounded-lg font-semibold hover:from-orange-600 hover:to-red-600 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Continue
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog> */}
    </main>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
          <div className="relative h-[500px] flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 z-0">
              <Image
                src="https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?q=80&w=1164&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="Payment success background"
                fill
                className="object-cover"
                priority
                sizes="100vw"
              />
              <div className="absolute inset-0 bg-black/50"></div>
            </div>

            <div className="relative z-10 text-center px-4">
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white mb-4">
                PAYMENT SUCCESS
              </h1>
              <div className="w-24 h-1 bg-gradient-to-r from-orange-400 to-red-500 mx-auto rounded-full"></div>
              <p className="text-lg sm:text-xl text-gray-200 mt-6 max-w-2xl mx-auto">
                Your order has been placed successfully and payment is confirmed
              </p>
            </div>
          </div>

          <div className="ah-container px-4 sm:px-6 lg:px-8 py-8 sm:py-16 lg:py-24">
            <div className="max-w-md mx-auto text-center">
              <RefreshCw className="w-16 h-16 text-blue-500 animate-spin mx-auto mb-6" />
              <h2 className="text-2xl font-bold text-gray-900">
                Verifying Payment
              </h2>
              <p className="text-gray-600">Loading...</p>
            </div>
          </div>
        </main>
      }
    >
      <PaymentSuccessContent />
    </Suspense>
  );
}
