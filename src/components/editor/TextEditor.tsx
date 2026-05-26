import { TextSection } from "@/lib/types";
import { Textarea } from "@/components/ui/textarea";

interface Props {
  data: TextSection;
  onChange: (data: TextSection) => void;
}

export function TextEditor({ data, onChange }: Props) {
  return (
    <Textarea
      value={data.content}
      onChange={(e) => onChange({ ...data, content: e.target.value })}
      placeholder="Enter text content..."
      rows={4}
    />
  );
}
