"use client";

const MONTHS = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
const W = 700;
const H = 220;
const PAD = { top: 20, right: 20, bottom: 36, left: 48 };

type Props = {
  revenueData: number[];
  enrollmentData: number[];
};

function buildSmoothPath(values: number[], maxVal: number): string {
  const n = values.length;
  if (n === 0) return "";
  const x = (i: number) => PAD.left + (i / Math.max(n - 1, 1)) * (W - PAD.left - PAD.right);
  const y = (v: number) => PAD.top + (H - PAD.top - PAD.bottom) * (1 - v / maxVal);
  const pts = values.map((v, i) => `${x(i)},${y(v)}`);
  if (pts.length === 1) return `M ${pts[0]} L ${pts[0]}`;
  let path = `M ${pts[0]}`;
  for (let i = 1; i < pts.length; i++) {
    const [x0, y0] = pts[i - 1].split(",").map(Number);
    const [x1, y1] = pts[i].split(",").map(Number);
    const cx = (x0 + x1) / 2;
    path += ` Q ${cx},${y0} ${cx},${(y0 + y1) / 2} Q ${cx},${y1} ${x1},${y1}`;
  }
  return path;
}

export function RevenueChart({ revenueData, enrollmentData }: Props) {
  const maxVal = Math.max(...revenueData, ...enrollmentData, 1);
  const revPath = buildSmoothPath(revenueData, maxVal);
  const enrollPath = buildSmoothPath(enrollmentData, maxVal);
  const chartRight = W - PAD.right;
  const baselineY = H - PAD.bottom;
  const revArea = revPath + ` L ${chartRight},${baselineY} L ${PAD.left},${baselineY} Z`;
  const enrollArea = enrollPath + ` L ${chartRight},${baselineY} L ${PAD.left},${baselineY} Z`;

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Revenue Growth</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Monthly financial summary</p>
        </div>
        <div className="flex gap-2 rounded-lg bg-gray-100 p-1 dark:bg-gray-700">
          <button type="button" className="rounded-md bg-white px-3 py-1.5 text-xs font-medium shadow dark:bg-gray-600">
            12M
          </button>
          <button type="button" className="rounded-md px-3 py-1.5 text-xs font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400">
            6M
          </button>
          <button type="button" className="rounded-md px-3 py-1.5 text-xs font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400">
            30D
          </button>
        </div>
      </div>
      <div className="mt-6 overflow-x-auto">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full min-w-[280px]" preserveAspectRatio="xMidYMid meet">
          <defs>
            <linearGradient id="revGrad" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="rgb(59, 130, 246)" stopOpacity="0.4" />
              <stop offset="100%" stopColor="rgb(59, 130, 246)" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="enrollGrad" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="rgb(236, 72, 153)" stopOpacity="0.4" />
              <stop offset="100%" stopColor="rgb(236, 72, 153)" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={revArea} fill="url(#revGrad)" />
          <path d={enrollArea} fill="url(#enrollGrad)" />
          <path d={revPath} fill="none" stroke="rgb(59, 130, 246)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d={enrollPath} fill="none" stroke="rgb(236, 72, 153)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          {MONTHS.map((m, i) => {
            const x = PAD.left + (i / 11) * (W - PAD.left - PAD.right);
            return (
              <text key={m} x={x} y={H - 8} textAnchor="middle" className="fill-gray-500 text-[10px] dark:fill-gray-400">{m}</text>
            );
          })}
        </svg>
      </div>
      <div className="mt-4 flex gap-6 border-t border-gray-100 pt-4 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-primary-500" />
          <span className="text-sm text-gray-600 dark:text-gray-300">Revenue</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-pink-500" />
          <span className="text-sm text-gray-600 dark:text-gray-300">Enrollments</span>
        </div>
      </div>
    </div>
  );
}
