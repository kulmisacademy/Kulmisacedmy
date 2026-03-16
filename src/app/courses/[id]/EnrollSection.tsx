"use client";

import { useState } from "react";
import Link from "next/link";
import { useFormState } from "react-dom";
import { enrollFreeCourse, submitPaymentRequest } from "./actions";
import { CONTACT_PHONE, WHATSAPP_URL } from "@/lib/constants";

const PAYMENT_INSTRUCTIONS = `Please send the course payment using one of the following mobile payment methods.

EVC PLUS: +252613609678
DAHABSHIIL: 623609678

After sending the payment, fill in your details below and submit the request.`;

type Props = {
  courseId: number;
  courseTitle: string;
  price: number | null;
  isEnrolled: boolean;
  isLoggedIn: boolean;
  userName?: string;
  userPhone?: string | null;
  hasPendingPayment?: boolean;
};

export function EnrollSection({
  courseId,
  courseTitle,
  price,
  isEnrolled,
  isLoggedIn,
  userName = "",
  userPhone = "",
  hasPendingPayment = false,
}: Props) {
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const isPaid = price != null && price > 0;

  const [paymentState, paymentFormAction] = useFormState(submitPaymentRequest, null);

  function handleEnrollClick() {
    if (isEnrolled) return;
    if (!isLoggedIn) {
      window.location.href = `/register?returnTo=${encodeURIComponent(`/courses/${courseId}`)}`;
    }
  }


  if (isEnrolled) {
    return (
      <p className="mt-4 rounded-lg bg-primary-50 px-4 py-3 text-sm font-medium text-primary-800">
        You are enrolled. View lessons below.
      </p>
    );
  }

  if (paymentState?.success) {
    return (
      <div className="mt-4 space-y-4 rounded-lg border border-green-200 bg-green-50 p-4">
        <p className="font-medium text-green-800">
          Your payment request has been sent successfully. Please contact us to confirm your enrollment.
        </p>
        <p className="text-sm text-green-700">Contact options:</p>
        <div className="flex flex-wrap gap-3">
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-green-700"
          >
            Contact on WhatsApp
          </a>
          <a
            href={`tel:${CONTACT_PHONE}`}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Call Now
          </a>
        </div>
        <p className="text-sm text-gray-600">WhatsApp or Call: {CONTACT_PHONE}</p>
      </div>
    );
  }

  if (showPaymentForm && isPaid) {
    return (
      <div className="mt-4 space-y-4 rounded-lg border border-gray-200 bg-gray-50 p-4">
        <h3 className="font-semibold text-gray-900">Payment instructions</h3>
        <pre className="whitespace-pre-wrap text-sm text-gray-700 font-sans">{PAYMENT_INSTRUCTIONS}</pre>
        <form action={paymentFormAction} className="space-y-3">
          <input type="hidden" name="courseId" value={String(courseId)} />
          {paymentState?.error && (
            <p className="rounded bg-red-50 px-3 py-2 text-sm text-red-700">{paymentState.error}</p>
          )}
          <div>
            <label htmlFor="pr-name" className="block text-sm font-medium text-gray-700">Full Name *</label>
            <input
              id="pr-name"
              name="name"
              type="text"
              required
              defaultValue={userName}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label htmlFor="pr-phone" className="block text-sm font-medium text-gray-700">Phone Number *</label>
            <input
              id="pr-phone"
              name="phone"
              type="tel"
              required
              defaultValue={userPhone ?? ""}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label htmlFor="pr-course" className="block text-sm font-medium text-gray-700">Course Name</label>
            <input
              id="pr-course"
              name="courseName"
              type="text"
              readOnly
              value={courseTitle}
              className="mt-1 block w-full rounded-lg border border-gray-200 bg-gray-100 px-3 py-2 text-sm text-gray-600"
            />
          </div>
          <div>
            <label htmlFor="pr-note" className="block text-sm font-medium text-gray-700">Optional note</label>
            <textarea
              id="pr-note"
              name="note"
              rows={2}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            />
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
            >
              Submit request
            </button>
            <button
              type="button"
              onClick={() => setShowPaymentForm(false)}
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    );
  }

  if (isPaid && isLoggedIn && hasPendingPayment) {
    return (
      <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-800 dark:bg-amber-900/20 dark:text-amber-200">
        Your request is pending admin approval. Please wait or contact support.
      </div>
    );
  }

  if (isPaid && isLoggedIn) {
    return (
      <Link
        href={`/courses/${courseId}/checkout`}
        className="mt-4 block w-full rounded-lg bg-primary-600 px-4 py-3 text-center text-sm font-medium text-white hover:bg-primary-700 transition-colors"
      >
        Proceed to Checkout
      </Link>
    );
  }

  if (!isLoggedIn) {
    return (
      <button
        type="button"
        onClick={() => handleEnrollClick()}
        className="mt-4 w-full rounded-lg bg-primary-600 px-4 py-3 text-sm font-medium text-white hover:bg-primary-700 transition-colors"
      >
        Enroll now (sign in required)
      </button>
    );
  }
  return (
    <form action={enrollFreeCourse.bind(null, courseId)}>
      <button
        type="submit"
        className="mt-4 w-full rounded-lg bg-primary-600 px-4 py-3 text-sm font-medium text-white hover:bg-primary-700 transition-colors"
      >
        Enroll now (free)
      </button>
    </form>
  );
}
