import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ProductDetailLayout } from "@/components/product/detail-layout";
import { courses, getCourse } from "@/lib/data/courses";
import { IMG } from "@/lib/images";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return courses.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const course = getCourse(slug);
  if (!course) return { title: "Course not found" };
  return { title: course.title, description: course.description };
}

export default async function CourseDetailPage({ params }: Props) {
  const { slug } = await params;
  const course = getCourse(slug);
  if (!course) notFound();

  return (
    <ProductDetailLayout
      id={course.slug}
      type="course"
      title={course.title}
      images={[course.image, IMG.courseAlt, IMG.course]}
      price={course.price}
      rating={course.rating}
      reviews={course.reviews}
      duration={course.duration}
      description={course.description}
      highlights={[...course.highlights, ...course.curriculum.map((c) => `Module: ${c}`)]}
      cta="Enroll Now"
      bestseller={course.bestseller}
      tabs={{
        faq: [
          { q: "Is this beginner friendly?", a: "Foundational modules cover prerequisites; advanced tracks are clearly marked." },
          { q: "Do I get a certificate?", a: "Yes — upon capstone completion and assessment pass." },
          { q: "Payment plans?", a: "EMI options available at checkout for select programs." },
        ],
      }}
    />
  );
}
