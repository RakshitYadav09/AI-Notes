import React from "react";

export default function Section({ title, children, className = "" }) {
  return (
    <section className={`mb-8 ${className}`}>
      {title && <h2 className="text-xl font-semibold mb-4">{title}</h2>}
      {children}
    </section>
  );
}
