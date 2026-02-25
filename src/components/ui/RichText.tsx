import React from 'react';

interface RichTextProps {
  text: string;
}

const RichText: React.FC<RichTextProps> = ({ text }) => {
  // Regular expression to match markdown-style links: [text](url)
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;

  // Split the text by the regex
  const parts = text.split(linkRegex);
  
  // Find all matches
  const matches = [...text.matchAll(linkRegex)];

  if (matches.length === 0) {
    return <>{text}</>;
  }

  const result = [];
  let lastIndex = 0;

  matches.forEach((match, index) => {
    const [fullMatch, linkText, url] = match;
    const matchIndex = match.index!;

    // Add text before the link
    if (matchIndex > lastIndex) {
      result.push(text.substring(lastIndex, matchIndex));
    }

    // Add the link
    result.push(
      <a
        key={index}
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-red-600 hover:text-red-700 hover:underline font-medium transition-colors"
      >
        {linkText}
      </a>
    );

    lastIndex = matchIndex + fullMatch.length;
  });

  // Add remaining text
  if (lastIndex < text.length) {
    result.push(text.substring(lastIndex));
  }

  return <>{result}</>;
};

export default RichText;
