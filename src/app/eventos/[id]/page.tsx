"use client";
import EventPageClient from '@/components/EventPageClient';

export default function Page({ params }: { params: { id: string } }) {
  return <EventPageClient params={params} />;
}
