export type Post = {
  slug: string
  title: string
  date: string
  description?: string
}

// Add your posts here (newest first).
// For each post, create a matching page at src/app/post/<slug>/page.tsx
//
// Example:
// {
//   slug: 'gpu-memory-calculator',
//   title: 'GPU Memory Calculator',
//   date: 'January 1, 2026',
//   description: 'An interactive tool for estimating GPU memory requirements.',
// },
export const posts: Post[] = [
  {
    slug: 'hello-world',
    title: 'Hello World',
    date: 'March 20, 2026',
    description: 'First post.',
  },
]
