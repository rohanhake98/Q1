import React from 'react';
import { Link } from 'react-router-dom';

export default function Contact() {
  return (
    <div className="max-w-[800px] mx-auto px-6 py-16 text-center">
      <h1 className="text-3xl font-semibold mb-4">Contact Us</h1>
      <p className="text-muted-foreground mb-8">Get in touch with the Q1clicks team for support or inquiries.</p>
      <Link to="/" className="text-primary hover:underline">Go to Homepage</Link>
    </div>
  );
}
