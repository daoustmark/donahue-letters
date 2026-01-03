import type { MDXComponents } from 'mdx/types'

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    // Custom styling for letter content
    h1: ({ children }) => (
      <h1 className="font-display text-3xl text-olive-800 mb-4">{children}</h1>
    ),
    h2: ({ children }) => (
      <h2 className="font-display text-2xl text-olive-700 mb-3 mt-8">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="font-display text-xl text-olive-600 mb-2 mt-6">{children}</h3>
    ),
    p: ({ children }) => (
      <p className="font-serif text-gray-700 leading-relaxed my-4 indent-8 first:indent-0">
        {children}
      </p>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-sepia-300 pl-4 italic text-gray-600 my-6">
        {children}
      </blockquote>
    ),
    strong: ({ children }) => (
      <strong className="font-semibold text-gray-800">{children}</strong>
    ),
    em: ({ children }) => (
      <em className="italic">{children}</em>
    ),
    ul: ({ children }) => (
      <ul className="list-disc list-inside my-4 space-y-1">{children}</ul>
    ),
    ol: ({ children }) => (
      <ol className="list-decimal list-inside my-4 space-y-1">{children}</ol>
    ),
    ...components,
  }
}
