import React from "react";

export default function Button({ children, className = "", ...props }) {
  return (
    <button
      className={`px-4 py-2 rounded bg-primary text-white font-medium hover:bg-primary/90 transition ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
