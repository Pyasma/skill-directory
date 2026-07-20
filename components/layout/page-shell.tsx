/**
 * Provides a centered, width-constrained container for page content.
 *
 * @param children - Content to render inside the container.
 * @returns A container element containing the provided content.
 */
export function PageShell({ children }: { children: React.ReactNode }) {
  return <div className="mx-auto w-full max-w-7xl px-6">{children}</div>;
}
