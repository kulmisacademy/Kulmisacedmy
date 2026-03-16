import Link from "next/link";

type Props = {
  title: string;
  value: string | number;
  growth?: string;
  growthPositive?: boolean;
  subtitle?: string;
  href?: string;
  icon: React.ReactNode;
};

export function StatCard({ title, value, growth, growthPositive, subtitle, href, icon }: Props) {
  const growthClass = growthPositive !== false ? "text-green-600" : "text-red-600";
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-800">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
          {growth != null && <p className={`mt-1 text-sm font-medium ${growthClass}`}>{growth}</p>}
          <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">{value}</p>
          {subtitle != null && <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{subtitle}</p>}
          {href != null && (
            <Link href={href} className="mt-3 inline-block text-sm font-medium text-primary-600 hover:underline">
              View →
            </Link>
          )}
        </div>
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400">
          {icon}
        </div>
      </div>
    </div>
  );
}
