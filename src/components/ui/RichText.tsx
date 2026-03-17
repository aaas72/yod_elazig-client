import React from 'react';

interface RichTextProps {
  text: string;
}

const RichText: React.FC<RichTextProps> = ({ text }) => {
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  const matches = [...text.matchAll(linkRegex)];

  if (matches.length === 0) {
    return <>{text}</>;
  }

  const result: React.ReactNode[] = [];
  let lastIndex = 0;

  matches.forEach((match, index) => {
    const [fullMatch, linkText, url] = match;
    const matchIndex = match.index!;

    if (matchIndex > lastIndex) {
      result.push(text.substring(lastIndex, matchIndex));
    }

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

  if (lastIndex < text.length) {
    result.push(text.substring(lastIndex));
  }

  return <>{result}</>;
};

export default RichText;
