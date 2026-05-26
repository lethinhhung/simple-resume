"use client";

import { useResumeStore } from "@/store/resume-store";
import { ContactItem } from "@/lib/types";
import { generateId } from "@/lib/id";

export function HeaderEditor() {
  const header = useResumeStore((s) => s.resume.header);
  const updateHeader = useResumeStore((s) => s.updateHeader);

  const updateContact = (id: string, value: string) => {
    updateHeader({
      contacts: header.contacts.map((c) =>
        c.id === id ? { ...c, value } : c
      ),
    });
  };

  const addContact = () => {
    updateHeader({
      contacts: [...header.contacts, { id: generateId(), value: "" }],
    });
  };

  const removeContact = (id: string) => {
    updateHeader({
      contacts: header.contacts.filter((c) => c.id !== id),
    });
  };

  return (
    <div className="editor-section">
      <h3 className="editor-section-title">Header</h3>

      <label className="editor-label">
        Name
        <input
          className="editor-input"
          value={header.name}
          onChange={(e) => updateHeader({ name: e.target.value })}
          placeholder="Full Name"
        />
      </label>

      <label className="editor-label">
        Subtitle
        <input
          className="editor-input"
          value={header.subtitle}
          onChange={(e) => updateHeader({ subtitle: e.target.value })}
          placeholder="Job title or tagline"
        />
      </label>

      <div className="editor-label">
        Contact Info
        {header.contacts.map((contact) => (
          <ContactRow
            key={contact.id}
            contact={contact}
            onChange={updateContact}
            onRemove={removeContact}
          />
        ))}
        <button className="editor-btn-add" onClick={addContact}>
          + Add Contact
        </button>
      </div>
    </div>
  );
}

function ContactRow({
  contact,
  onChange,
  onRemove,
}: {
  contact: ContactItem;
  onChange: (id: string, value: string) => void;
  onRemove: (id: string) => void;
}) {
  return (
    <div className="editor-row">
      <input
        className="editor-input flex-1"
        value={contact.value}
        onChange={(e) => onChange(contact.id, e.target.value)}
        placeholder="Email, phone, location, or link"
      />
      <button
        className="editor-btn-remove"
        onClick={() => onRemove(contact.id)}
        title="Remove"
      >
        &times;
      </button>
    </div>
  );
}
