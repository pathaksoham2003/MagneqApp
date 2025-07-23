import React from "react";
import clsx from "clsx";

const Input = ({ id, name, type = "text",placeholder = "", className = "", ...props }) => (
  <input
    id={id}
    name={name}
    type={type}
    placeholder={ placeholder}
    className={clsx(
      "w-full rounded-lg border border-gray-300 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-700 dark:text-gray-200 shadow-sm",
      "focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500",
      className
    )}
    {...props}
  />
);

export default Input;