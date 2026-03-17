import { notFound } from "next/navigation";
import { HeaderWithSession } from "@/components/HeaderWithSession";
import Footer from "@/components/Footer";
import { CourseContentClient } from "./CourseContentClient";

export const metadata = {
  title: "Course – Kulmis Academy",
  description: "Course details and curriculum.",
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const courseId = parseInt(id, 10);
  if (isNaN(courseId)) notFound();

  return (
    <div className="min-h-screen flex flex-col">
      <HeaderWithSession />
      <main className="flex-1">
        <CourseContentClient courseId={courseId} />
      </main>
      <Footer />
    </div>
  );
}
