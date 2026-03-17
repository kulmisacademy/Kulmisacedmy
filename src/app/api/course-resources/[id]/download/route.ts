import { NextResponse } from "next/server";
import { eq, and } from "drizzle-orm";
import { createReadStream, existsSync } from "fs";
import { Readable } from "stream";
import path from "path";
import { db } from "@/lib/db";
import { courseResources, enrollments } from "@/lib/schema";
import { getSession } from "@/lib/auth";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const resourceId = parseInt(id, 10);
  if (isNaN(resourceId)) {
    return NextResponse.json({ error: "Invalid resource" }, { status: 400 });
  }

  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [resource] = await db
    .select()
    .from(courseResources)
    .where(eq(courseResources.id, resourceId))
    .limit(1);

  if (!resource) {
    return NextResponse.json({ error: "Resource not found" }, { status: 404 });
  }

  const [enrollment] = await db
    .select()
    .from(enrollments)
    .where(
      and(
        eq(enrollments.userId, session.userId),
        eq(enrollments.courseId, resource.courseId)
      )
    )
    .limit(1);

  if (!enrollment) {
    return NextResponse.json(
      { error: "You must be enrolled in this course to download resources." },
      { status: 403 }
    );
  }

  const url = resource.fileUrl.trim();
  // External link: redirect so enrolled user can open it
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return NextResponse.redirect(url, 302);
  }

  // fileUrl is e.g. /uploads/course-resources/res-123.zip
  const filePath = path.join(process.cwd(), "public", url);
  if (!existsSync(filePath)) {
    return NextResponse.json(
      { error: "File not found on server." },
      { status: 404 }
    );
  }

  const ext = path.extname(url).slice(1) || "bin";
  const safeTitle = resource.title.replace(/[^a-zA-Z0-9._-]/g, "_");
  const filename = `${safeTitle}.${ext}`;

  const nodeStream = createReadStream(filePath);
  const webStream = Readable.toWeb(nodeStream) as ReadableStream<Uint8Array>;
  return new Response(webStream, {
    headers: {
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "private, no-cache",
    },
  });
}
