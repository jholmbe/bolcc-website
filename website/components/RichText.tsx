import {
  PortableText,
  type PortableTextBlock,
  type PortableTextComponents,
} from "@portabletext/react";

const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => <p className="leading-relaxed">{children}</p>,
  },
  list: {
    bullet: ({ children }) => (
      <ul className="list-disc space-y-2 pl-5">{children}</ul>
    ),
    number: ({ children }) => (
      <ol className="list-decimal space-y-2 pl-5">{children}</ol>
    ),
  },
  marks: {
    link: ({ children, value }) => (
      <a
        href={value?.href}
        target="_blank"
        rel="noopener noreferrer"
        className="underline underline-offset-4 transition hover:text-primary-green"
      >
        {children}
      </a>
    ),
  },
};

export default function RichText({ value }: { value: PortableTextBlock[] }) {
  return (
    <div className="space-y-4 text-primary-text">
      <PortableText value={value} components={components} />
    </div>
  );
}
