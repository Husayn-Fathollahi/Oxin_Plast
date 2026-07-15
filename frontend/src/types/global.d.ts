// Allow TypeScript to resolve CSS side-effect imports (e.g. import './globals.css').
// Next.js processes these at build time; this declaration satisfies the type checker.
declare module '*.css' {
  const content: Record<string, string>;
  export default content;
}
