import React from 'react';
import { Link } from 'react-router-dom';

export default function About() {
  return (
    <div className="max-w-[800px] mx-auto px-6 py-16 text-center">
      <h1 className="text-3xl font-semibold mb-4">About Q1clicks</h1>
      <p className="text-muted-foreground mb-8">This is the about page detailing our team, mission, and the technology behind Q1clicks.</p>
      <Link to="/" className="text-primary hover:underline">Go to Homepage</Link>
    </div>
  );
}
