"use client";

import { useFormState } from "react-dom";
import { submitPaymentRequest } from "../actions";
import { CONTACT_PHONE, WHATSAPP_URL } from "@/lib/constants";

type Props = {
  courseId: number;
  courseTitle: string;
  userName: string;
};

export function CheckoutForm({ courseId, courseTitle, userName }: Props) {
  const [state, formAction] = useFormState(submitPaymentRequest, null);

  if (state?.success) {
    return (
      <div className="mt-6 rounded-xl border border-green-200 bg-green-50 p-6">
        <p className="font-medium text-green-800">
          Your payment request has been sent successfully. Please contact us to confirm your enrollment.
        </p>
        <p className="mt-4 text-sm font-medium text-gray-700">WhatsApp or Call: {CONTACT_PHONE}</p>
        <div className="mt-4 flex flex-wrap gap-3">
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
      </div>
    );
  }

  return (
    <form action={formAction} className="mt-6 space-y-4">
      <input type="hidden" name="courseId" value={String(courseId)} />
      {state?.error && (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{state.error}</p>
      )}
      <div>
        <label htmlFor="checkout-name" className="block text-sm font-medium text-gray-700">Full Name *</label>
        <input
          id="checkout-name"
          name="name"
          type="text"
          required
          defaultValue={userName}
          className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
        />
      </div>
      <div>
        <label htmlFor="checkout-phone" className="block text-sm font-medium text-gray-700">Phone Number *</label>
        <input
          id="checkout-phone"
          name="phone"
          type="tel"
          required
          className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
        />
      </div>
      <div>
        <label htmlFor="checkout-course" className="block text-sm font-medium text-gray-700">Course Name</label>
        <input
          id="checkout-course"
          name="courseName"
          type="text"
          readOnly
          value={courseTitle}
          className="mt-1 block w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-gray-600"
        />
      </div>
      <button
        type="submit"
        className="w-full rounded-lg bg-primary-600 px-4 py-3 text-sm font-medium text-white shadow-sm hover:bg-primary-700"
      >
        Submit Payment Request
      </button>
    </form>
  );
}
