import { NextResponse } from "next/server";

export function GET(request: Request) {
  const url = new URL(request.url);
  const base = `${url.protocol}//${url.host}`;
  return NextResponse.redirect(`${base}/forgot-password`, 302);
}
