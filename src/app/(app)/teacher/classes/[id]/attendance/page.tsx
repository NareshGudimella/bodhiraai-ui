import { PageHeader } from "@/components/ui";
import { teacherApi } from "@/lib/teacher-api";
import { AttendanceForm } from "./attendance-form";

export default async function AttendancePage({ params, searchParams }: PageProps<"/teacher/classes/[id]/attendance">) {
  const { id } = await params;
  const date = (await searchParams).date;
  const sheet = await teacherApi.attendance(id, typeof date === "string" ? date : undefined);
  return (
    <>
      <PageHeader
        back={{ href: `/teacher/classes/${id}`, label: `Grade ${sheet.class.grade} - ${sheet.class.section}` }}
        title="Attendance"
      />
      <AttendanceForm key={sheet.date} classId={sheet.class.id} sheet={sheet} />
    </>
  );
}
