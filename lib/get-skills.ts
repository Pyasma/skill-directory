export type Section = {
  level: number;
  title: string;
  content: string;
};

// Clean 3-color professional palette
const colors = [
  "bg-[#ea580c]", // Warm Orange
  "bg-emerald-500", // Emerald
  "bg-indigo-500", // Indigo
];

export function colorFor(title: string) {
  let hash = 0;
  for (const c of title) {
    hash = (hash * 31 + c.charCodeAt(0)) >>> 0;
  }
  return colors[hash % colors.length];
}

export function getSections(markdown: string): Section[] {
  const sections: Section[] = [];
  let current: Section | null = null;

  for (const line of markdown.split("\n")) {
    const match = line.match(/^(#{1,6})\s+(.+)$/);

    if (match) {
      if (current) {
        current.content = current.content.trim();
        sections.push(current);
      }

      current = {
        level: match[1].length,
        title: match[2],
        content: "",
      };
    } else if (current) {
      current.content += line + "\n";
    }
  }

  if (current) {
    current.content = current.content.trim();
    sections.push(current);
  }

  return sections;
}