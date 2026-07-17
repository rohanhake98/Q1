import React from 'react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  return (
    <div className="max-w-[800px] mx-auto px-6 py-16 text-center">
      <h1 className="text-3xl font-semibold mb-4">Admin Dashboard</h1>
      <p className="text-muted-foreground mb-8">Management portal for jobs, companies, blogs, and resources.</p>
      <Link to="/" className="text-primary hover:underline">Back to Main Site</Link>
    </div>
  );
}
