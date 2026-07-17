import React from 'react';
import { useParams, Link } from 'react-router-dom';

export default function JobDetails() {
  const { slug } = useParams<{ slug: string }>();
  return (
    <div className="max-w-[800px] mx-auto px-6 py-16 text-center">
      <h1 className="text-3xl font-semibold mb-4">Job Details Page</h1>
      <p className="text-muted-foreground mb-8">Currently displaying details for job slug: <code>{slug}</code></p>
      <Link to="/jobs" className="text-primary hover:underline">Back to Job Board</Link>
    </div>
  );
}
