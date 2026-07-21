// MarkdownCodeBlock.jsx
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

export default function MarkdownCodeBlock({ className, children, ...props }) {
  const match = /language-(\w+)/.exec(className || "");

  // Inline code
  if (!match) {
    return (
      <code
        className="bg-gray-200 dark:bg-gray-800 px-1 py-0.5 rounded text-sm"
        {...props}
      >
        {children}
      </code>
    );
  }

  // Code block
  return (
    <SyntaxHighlighter
      language={match[1]}
      style={oneDark}
      PreTag="div"
      customStyle={{
        borderRadius: "8px",
        padding: "16px",
        margin: "16px 0",
      }}
    >
      {String(children).replace(/\n$/, "")}
    </SyntaxHighlighter>
  );
}