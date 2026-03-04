import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";

/**
 * Shared markdown rendering config.
 *
 * Includes GFM features: tables, task lists, strikethrough, autolinks.
 * Note: We intentionally do NOT enable raw HTML rendering for safety.
 */
export const mdRemarkPlugins = [remarkGfm];

export const mdComponents: Components = {
  h1: ({ children }) => (
    <h1 className="text-2xl md:text-3xl font-bold mt-3 mb-2">{children}</h1>
  ),
  h2: ({ children }) => (
    <h2 className="text-xl md:text-2xl font-bold mt-3 mb-2">{children}</h2>
  ),
  h3: ({ children }) => (
    <h3 className="text-lg md:text-xl font-semibold mt-3 mb-1">{children}</h3>
  ),
  h4: ({ children }) => (
    <h4 className="text-base md:text-lg font-semibold mt-3 mb-1">{children}</h4>
  ),
  p: ({ children }) => <p className="mb-2 leading-relaxed">{children}</p>,
  a: ({ children, href }) => (
    <a
      className="text-blue-400 underline underline-offset-4"
      href={href}
      target="_blank"
      rel="noreferrer"
    >
      {children}
    </a>
  ),
  ul: ({ children }) => <ul className="list-disc pl-5 mb-2">{children}</ul>,
  ol: ({ children }) => <ol className="list-decimal pl-5 mb-2">{children}</ol>,
  li: ({ children }) => <li className="my-1">{children}</li>,
  blockquote: ({ children }) => (
    <blockquote className="border-l-2 border-white/20 pl-3 my-3 text-white/80">
      {children}
    </blockquote>
  ),
  hr: () => <hr className="my-4 border-white/10" />,
  strong: ({ children }) => <strong className="font-bold">{children}</strong>,
  em: ({ children }) => <em className="italic">{children}</em>,
  code: ({ children, className }) => {
    const isBlock = typeof className === "string" && className.includes("language-");
    if (isBlock) {
      return (
        <code className="block rounded-md bg-black/40 border border-white/10 p-3 overflow-auto text-xs md:text-sm">
          {children}
        </code>
      );
    }
    return (
      <code className="rounded bg-black/30 border border-white/10 px-1 py-0.5 text-xs">
        {children}
      </code>
    );
  },
  pre: ({ children }) => <pre className="my-3">{children}</pre>,
  table: ({ children }) => (
    <div className="overflow-auto my-3">
      <table className="w-full border-collapse text-sm">{children}</table>
    </div>
  ),
  thead: ({ children }) => <thead className="bg-white/5">{children}</thead>,
  th: ({ children }) => (
    <th className="border border-white/10 px-3 py-2 text-left font-semibold">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="border border-white/10 px-3 py-2 align-top">{children}</td>
  ),
};

export function Markdown({
  children,
  className,
}: {
  children: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <ReactMarkdown remarkPlugins={mdRemarkPlugins} components={mdComponents}>
        {children}
      </ReactMarkdown>
    </div>
  );
}
