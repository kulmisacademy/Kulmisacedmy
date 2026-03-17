import { HeaderWithSession } from "@/components/HeaderWithSession";
import Footer from "@/components/Footer";
import { LessonPlayerClient } from "./LessonPlayerClient";

export const metadata = {
  title: "Lesson – Kulmis Academy",
  description: "Watch lesson.",
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function LessonPlayerPage({
  params,
}: {
  params: Promise<{ id: string; lessonId: string }>;
}) {
  const { id, lessonId } = await params;
  const courseId = parseInt(id, 10);
  const lessonIdNum = parseInt(lessonId, 10);

  return (
    <div className="min-h-screen flex flex-col">
      <HeaderWithSession />
      <main className="flex-1 flex flex-col">
        <LessonPlayerClient courseId={courseId} lessonId={lessonIdNum} />
      </main>
      <Footer />
    </div>
  );
}
