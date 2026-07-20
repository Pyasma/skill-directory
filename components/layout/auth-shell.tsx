/**
 * Wraps content in a full-screen authentication layout container.
 *
 * @param children - The content to render inside the container
 */
export function AuthShell({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen w-full bg-[#fdf8fa]">{children}</div>;
}

