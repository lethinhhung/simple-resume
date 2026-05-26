"use client";

import { X } from "lucide-react";
import { useResumeStore } from "@/store/resume-store";
import { ContactItem } from "@/lib/types";
import { generateId } from "@/lib/id";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

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
    <Card size="sm">
      <CardContent className="space-y-3">
        <h3 className="text-sm font-semibold">Header</h3>

        <div className="space-y-1.5">
          <Label className="text-xs">Name</Label>
          <Input
            value={header.name}
            onChange={(e) => updateHeader({ name: e.target.value })}
            placeholder="Full Name"
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs">Subtitle</Label>
          <Input
            value={header.subtitle}
            onChange={(e) => updateHeader({ subtitle: e.target.value })}
            placeholder="Job title or tagline"
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs">Contact Info</Label>
          {header.contacts.map((contact) => (
            <div key={contact.id} className="flex items-center gap-1.5">
              <Input
                value={contact.value}
                onChange={(e) => updateContact(contact.id, e.target.value)}
                placeholder="Email, phone, location, or link"
                className="flex-1"
              />
              <Button
                variant="ghost"
                size="icon-xs"
                className="text-muted-foreground hover:text-destructive shrink-0"
                onClick={() => removeContact(contact.id)}
              >
                <X className="size-3.5" />
              </Button>
            </div>
          ))}
          <Button
            variant="outline"
            size="xs"
            className="border-dashed"
            onClick={addContact}
          >
            + Add Contact
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
