"use client";

import { useFormState } from "react-dom";
import { updateSettings } from "./actions";

type Props = { initial: Record<string, string> };

export function SettingsForm({ initial }: Props) {
  const [, formAction] = useFormState(updateSettings, null);

  return (
    <form action={formAction} className="mt-6 max-w-2xl space-y-8">
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Platform</h2>
        <div className="mt-4 space-y-4">
          <div>
            <label htmlFor="platformName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Platform Name</label>
            <input
              id="platformName"
              name="platformName"
              type="text"
              defaultValue={initial.platform_name ?? "Kulmis Academy"}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-900 dark:text-white"
            />
          </div>
          <div>
            <label htmlFor="logoUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Logo URL</label>
            <input
              id="logoUrl"
              name="logoUrl"
              type="url"
              defaultValue={initial.logo_url ?? ""}
              placeholder="https://..."
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-900 dark:text-white"
            />
            <p className="mt-1 text-xs text-gray-500">Optional. Leave empty to use the default logo.</p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Email configuration</h2>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          SMTP is configured via environment variables: SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, EMAIL_FROM. Edit your .env file to change them.
        </p>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Payment phone numbers</h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">These appear on the checkout page for students.</p>
        <div className="mt-4 space-y-4">
          <div>
            <label htmlFor="evcPhone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">EVC PLUS number</label>
            <input
              id="evcPhone"
              name="evcPhone"
              type="tel"
              defaultValue={initial.evc_phone ?? ""}
              placeholder="+252613609678"
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-900 dark:text-white"
            />
          </div>
          <div>
            <label htmlFor="dahabshiilPhone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">DAHABSHIIL number</label>
            <input
              id="dahabshiilPhone"
              name="dahabshiilPhone"
              type="tel"
              defaultValue={initial.dahabshiil_phone ?? ""}
              placeholder="623609678"
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-900 dark:text-white"
            />
          </div>
        </div>
      </div>

      <button
        type="submit"
        className="rounded-lg bg-primary-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-700"
      >
        Save settings
      </button>
    </form>
  );
}
