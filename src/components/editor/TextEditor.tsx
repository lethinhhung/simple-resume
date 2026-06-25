import { TextSection } from "@/lib/types";
import { RichTextInput } from "@/components/editor/RichTextInput";

interface Props {
  data: TextSection;
  onChange: (data: TextSection) => void;
}

export function TextEditor({ data, onChange }: Props) {
  return (
    <RichTextInput
      multiline
      value={data.content}
      onChange={(content) => onChange({ ...data, content })}
      placeholder="Enter text content..."
      rows={4}
    />
  );
}
