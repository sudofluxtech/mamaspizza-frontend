"use client";

import { useState } from 'react';
import { 
  GUEST_STRIPE_CREATE_SESSION_API, 
  GUEST_STRIPE_VERIFY_PAYMENT_API, 
  GUEST_STRIPE_SESSION_STATUS_API 
} from '@/app/api';

export interface GuestStripeCheckoutSession {
  session_id: string;
  session_url: string;
  order_id: number;
  order_number: string;
  total_amount: string;
  currency: string;
}

export interface GuestPaymentData {
  order_id: number;
  guest_id: string;
}

// CREATE guest Stripe checkout session
export function useCreateGuestStripeSession() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createSession = async (paymentData: GuestPaymentData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(GUEST_STRIPE_CREATE_SESSION_API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(paymentData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create guest payment session');
      }

      const result = await response.json();
      return result.data;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    createSession,
    loading,
    error,
  };
}

// VERIFY guest payment
export function useVerifyGuestPayment() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const verifyPayment = async (sessionId: string, guestId: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(GUEST_STRIPE_VERIFY_PAYMENT_API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ session_id: sessionId, guest_id: guestId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to verify guest payment');
      }

      const result = await response.json();
      return result.data;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    verifyPayment,
    loading,
    error,
  };
}

// GET guest payment session status
export function useGuestPaymentSessionStatus() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getSessionStatus = async (sessionId: string, guestId: string) => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        session_id: sessionId,
        guest_id: guestId,
      });

      const response = await fetch(`${GUEST_STRIPE_SESSION_STATUS_API}?${params.toString()}`, {
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to get guest payment session status');
      }

      const result = await response.json();
      return result.data;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    getSessionStatus,
    loading,
    error,
  };
}

// COMPLETE guest payment workflow
export function useGuestPaymentWorkflow() {
  const { createSession, loading: createLoading, error: createError } = useCreateGuestStripeSession();
  const { verifyPayment, loading: verifyLoading, error: verifyError } = useVerifyGuestPayment();
  const { getSessionStatus, loading: statusLoading, error: statusError } = useGuestPaymentSessionStatus();

  const [currentStep, setCurrentStep] = useState<'idle' | 'creating' | 'redirecting' | 'verifying' | 'completed' | 'failed'>('idle');
  const [sessionData, setSessionData] = useState<GuestStripeCheckoutSession | null>(null);

  const startPayment = async (paymentData: GuestPaymentData) => {
    try {
      setCurrentStep('creating');
      const session = await createSession(paymentData);
      setSessionData(session);
      setCurrentStep('redirecting');
      
      // Redirect to Stripe checkout
      window.location.href = session.url;
    } catch (error) {
      setCurrentStep('failed');
      throw error;
    }
  };

  const completePayment = async (sessionId: string, guestId: string) => {
    try {
      setCurrentStep('verifying');
      const result = await verifyPayment(sessionId, guestId);
      setCurrentStep('completed');
      return result;
    } catch (error) {
      setCurrentStep('failed');
      throw error;
    }
  };

  const checkPaymentStatus = async (sessionId: string, guestId: string) => {
    try {
      const status = await getSessionStatus(sessionId, guestId);
      return status;
    } catch (error) {
      throw error;
    }
  };

  return {
    startPayment,
    completePayment,
    checkPaymentStatus,
    currentStep,
    sessionData,
    loading: createLoading || verifyLoading || statusLoading,
    error: createError || verifyError || statusError,
  };
}
