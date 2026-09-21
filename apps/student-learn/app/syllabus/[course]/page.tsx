import fs from 'node:fs';
import path from 'node:path';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { SyllabusMap } from '@/components/syllabus-map';
import { COURSES } from '@/lib/syllabus';

interface CoursePageProps {
  params: Promise<{ course: string }>;
}

export function generateStaticParams() {
  return COURSES.map((course) => ({ course: course.code }));
}

export async function generateMetadata({ params }: CoursePageProps): Promise<Metadata> {
  const { course: courseCode } = await params;
  const course = COURSES.find((candidate) => candidate.code === courseCode);

  return {
    title: course ? `${course.title} — syllabus` : 'Syllabus not found',
  };
}

export default async function CourseSyllabusPage({ params }: CoursePageProps) {
  const { course: courseCode } = await params;
  const course = COURSES.find((candidate) => candidate.code === courseCode);
  if (!course) notFound();

  const hasIllustration = fs.existsSync(
    path.join(process.cwd(), 'public', 'illustrations', 'empty-progress.png')
  );

  return <SyllabusMap course={course} hasIllustration={hasIllustration} />;
}
