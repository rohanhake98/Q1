import React from 'react';
import { useParams, Link } from 'react-router-dom';

export default function CompanyDetails() {
  const { slug } = useParams<{ slug: string }>();
  return (
    <div className="max-w-[800px] mx-auto px-6 py-16 text-center">
      <h1 className="text-3xl font-semibold mb-4">Company Profile Page</h1>
      <p className="text-muted-foreground mb-8">Currently displaying profile for company slug: <code>{slug}</code></p>
      <Link to="/" className="text-primary hover:underline">Go to Homepage</Link>
    </div>
  );
}
