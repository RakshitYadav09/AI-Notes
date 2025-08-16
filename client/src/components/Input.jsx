import React from "react";

export default function Input({ label, ...props }) {
  return (
    <div className="mb-4">
      {label && <label className="block mb-1 text-sm font-medium">{label}</label>}
      <input
        className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-primary bg-zinc-50 dark:bg-zinc-800"
        {...props}
      />
    </div>
  );
}
