import React from 'react';
import { getCMSData } from '@/lib/cms-store';
import TypeOneClientPage from '@/components/TypeOneClientPage';

export const dynamic = 'force-dynamic';

export default function HomePage() {
  const cmsData = getCMSData();
  return <TypeOneClientPage initialData={cmsData} />;
}
