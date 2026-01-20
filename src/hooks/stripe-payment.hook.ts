"use client";

import { useState, useCallback } from 'react';
import { useAuth } from '@/lib/stores/useAuth';
import { 
  STRIPE_CREATE_SESSION_API, 
  STRIPE_VERIFY_PAYMENT_API, 
  STRIPE_SESSION_STATUS_API 
} from '@/app/api';

export interface StripeCheckoutSession {
  session_id: string;
  session_url: string;
  order_id: number;
  order_number: string;
  amount_total: number;
  currency: string;
}

export interface PaymentVerification {
  payment_status: 'paid' | 'pending' | 'failed';
  payment_intent_id?: string;
  charge_id?: string;
  amount_total: number;
  currency: string;
}

export interface SessionStatus {
  session_id: string;
  payment_status: 'paid' | 'pending' | 'failed' | 'expired';
  payment_intent_id?: string;
  amount_total: number;
  currency: string;
}

// CREATE Stripe checkout session
export function useCreateStripeSession() {
  const { token, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createSession = async (orderId: number) => {
    if (!isAuthenticated || !token) {
      throw new Error('User not authenticated');
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(STRIPE_CREATE_SESSION_API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
        body: JSON.stringify({ order_id: orderId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create Stripe session');
      }

      const result = await response.json();
      return result.data as StripeCheckoutSession;
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

// VERIFY payment session
export function useVerifyPayment() {
  const { token, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const verifyPayment = async (sessionId: string) => {
    if (!isAuthenticated || !token) {
      throw new Error('User not authenticated');
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(STRIPE_VERIFY_PAYMENT_API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
        body: JSON.stringify({ session_id: sessionId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to verify payment');
      }

      const result = await response.json();
      return result.data as PaymentVerification;
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

// GET session status
export function useSessionStatus() {
  const { token, isAuthenticated } = useAuth();
  const [sessionStatus, setSessionStatus] = useState<SessionStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getSessionStatus = useCallback(async (sessionId: string) => {
    if (!isAuthenticated || !token) {
      setError('User not authenticated');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const searchParams = new URLSearchParams();
      searchParams.append('session_id', sessionId);
      
      const url = `${STRIPE_SESSION_STATUS_API}?${searchParams.toString()}`;
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to get session status');
      }

      const result = await response.json();
      setSessionStatus(result.data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, token]);

  return {
    sessionStatus,
    loading,
    error,
    getSessionStatus,
  };
}

// COMPLETE payment workflow
export function usePaymentWorkflow() {
  const { createSession, loading: createLoading, error: createError } = useCreateStripeSession();
  const { verifyPayment, loading: verifyLoading, error: verifyError } = useVerifyPayment();
  const { getSessionStatus, loading: statusLoading, error: statusError } = useSessionStatus();

  const [currentStep, setCurrentStep] = useState<'idle' | 'creating' | 'redirecting' | 'verifying' | 'completed' | 'failed'>('idle');
  const [sessionData, setSessionData] = useState<StripeCheckoutSession | null>(null);

  const startPayment = async (orderId: number) => {
    try {
      setCurrentStep('creating');
      const session = await createSession(orderId);
      setSessionData(session);
      setCurrentStep('redirecting');
      
      // Redirect to Stripe checkout
      window.location.href = session.session_url;
      
      return session;
    } catch (error) {
      setCurrentStep('failed');
      throw error;
    }
  };

  const handleReturnFromStripe = async (sessionId: string) => {
    try {
      setCurrentStep('verifying');
      const verification = await verifyPayment(sessionId);
      setCurrentStep('completed');
      return verification;
    } catch (error) {
      setCurrentStep('failed');
      throw error;
    }
  };

  const checkPaymentStatus = async (sessionId: string) => {
    await getSessionStatus(sessionId);
  };

  return {
    // State
    currentStep,
    sessionData,
    loading: createLoading || verifyLoading || statusLoading,
    error: createError || verifyError || statusError,
    
    // Actions
    startPayment,
    handleReturnFromStripe,
    checkPaymentStatus,
    
    // Individual hooks
    createSession,
    verifyPayment,
    getSessionStatus,
  };
}
