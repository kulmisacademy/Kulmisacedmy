import { getSettings } from "./actions";
import { SettingsForm } from "./SettingsForm";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminSettingsPage() {
  const initial = await getSettings();

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
      <p className="mt-1 text-gray-600 dark:text-gray-400">
        Platform name, logo, email, and payment numbers.
      </p>
      <SettingsForm initial={initial} />
    </div>
  );
}
