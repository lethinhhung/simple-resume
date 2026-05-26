import { TextSection } from "@/lib/types";

interface Props {
  data: TextSection;
  onChange: (data: TextSection) => void;
}

export function TextEditor({ data, onChange }: Props) {
  return (
    <textarea
      className="editor-textarea"
      value={data.content}
      onChange={(e) => onChange({ ...data, content: e.target.value })}
      placeholder="Enter text content..."
      rows={4}
    />
  );
}
