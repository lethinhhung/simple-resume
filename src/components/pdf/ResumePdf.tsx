"use client";

import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";
import {
  ResumeData,
  Section,
  SectionData,
  TextSection,
  EntrySection,
  EducationSection,
  SkillsSection,
  ListSection,
} from "@/lib/types";

Font.register({
  family: "Times-Roman",
  fonts: [
    { src: "Times-Roman" },
    { src: "Times-Bold", fontWeight: "bold" },
    { src: "Times-Italic", fontStyle: "italic" },
    { src: "Times-BoldItalic", fontWeight: "bold", fontStyle: "italic" },
  ],
});

const BASE_FONT_SIZE = 10.5;

const s = StyleSheet.create({
  page: {
    paddingTop: 36,
    paddingBottom: 36,
    paddingHorizontal: 36,
    fontFamily: "Times-Roman",
    fontSize: BASE_FONT_SIZE,
    lineHeight: 1.3,
    color: "#000",
  },
  header: {
    alignItems: "center",
    marginBottom: 4,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: BASE_FONT_SIZE,
    fontWeight: "bold",
    marginTop: 1,
  },
  contacts: {
    fontSize: 10,
    marginTop: 1,
  },
  section: {
    marginTop: 6,
  },
  sectionTitle: {
    fontSize: BASE_FONT_SIZE,
    fontWeight: "bold",
    textAlign: "center",
    textDecoration: "underline",
    marginBottom: 3,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  rowLeft: {
    flex: 1,
  },
  rowRight: {
    textAlign: "right",
    flexShrink: 0,
  },
  bold: {
    fontWeight: "bold",
  },
  boldItalic: {
    fontWeight: "bold",
    fontStyle: "italic",
  },
  text: {
    marginTop: 1,
  },
  entry: {
    marginBottom: 4,
  },
  bullet: {
    paddingLeft: 12,
    marginTop: 0,
  },
  skillRow: {
    lineHeight: 1.4,
  },
});

export function ResumePdf({ resume }: { resume: ResumeData }) {
  const enabledSections = resume.sections.filter((sec) => sec.enabled);

  return (
    <Document>
      <Page size="LETTER" style={s.page}>
        <View style={s.header}>
          <Text style={s.name}>{resume.header.name.toUpperCase()}</Text>
          {resume.header.subtitle ? (
            <Text style={s.subtitle}>{resume.header.subtitle}</Text>
          ) : null}
          {resume.header.contacts.length > 0 ? (
            <Text style={s.contacts}>
              {resume.header.contacts
                .map((c) => c.value)
                .filter(Boolean)
                .join(" - ")}
            </Text>
          ) : null}
        </View>

        {enabledSections.map((section) => (
          <SectionBlock key={section.id} section={section} />
        ))}
      </Page>
    </Document>
  );
}

function SectionBlock({ section }: { section: Section }) {
  return (
    <View style={s.section}>
      <Text style={s.sectionTitle}>{section.label}</Text>
      <SectionContent data={section.data} />
    </View>
  );
}

function SectionContent({ data }: { data: SectionData }) {
  switch (data.type) {
    case "text":
      return <PdfText data={data} />;
    case "entry":
      return <PdfEntry data={data} />;
    case "education":
      return <PdfEducation data={data} />;
    case "skills":
      return <PdfSkills data={data} />;
    case "list":
      return <PdfList data={data} />;
  }
}

function PdfText({ data }: { data: TextSection }) {
  if (!data.content) return null;
  return <Text style={s.text}>{data.content}</Text>;
}

function PdfEntry({ data }: { data: EntrySection }) {
  return (
    <View>
      {data.entries.map((entry) => (
        <View key={entry.id} style={s.entry}>
          <View style={s.row}>
            <Text style={s.bold}>{entry.title}</Text>
            {entry.location ? (
              <Text style={s.rowRight}>{entry.location}</Text>
            ) : entry.dates ? (
              <Text style={s.rowRight}>{entry.dates}</Text>
            ) : null}
          </View>
          {entry.location ? (
            (entry.subtitle || entry.dates) ? (
              <View style={s.row}>
                <Text style={s.boldItalic}>{entry.subtitle}</Text>
                {entry.dates ? (
                  <Text style={s.rowRight}>{entry.dates}</Text>
                ) : null}
              </View>
            ) : null
          ) : entry.subtitle ? (
            <View style={s.row}>
              <Text style={s.boldItalic}>{entry.subtitle}</Text>
            </View>
          ) : null}
          {entry.description ? (
            <Text style={s.text}>{entry.description}</Text>
          ) : null}
          {entry.bullets.map(
            (bullet, i) =>
              bullet && (
                <Text key={i} style={s.bullet}>
                  - {bullet}
                </Text>
              )
          )}
        </View>
      ))}
    </View>
  );
}

function PdfEducation({ data }: { data: EducationSection }) {
  return (
    <View>
      {data.entries.map((entry) => (
        <View key={entry.id} style={s.entry}>
          <View style={s.row}>
            <Text style={s.bold}>{entry.institution.toUpperCase()}</Text>
            {entry.location ? (
              <Text style={s.rowRight}>{entry.location}</Text>
            ) : null}
          </View>
          <View style={s.row}>
            <Text>
              {entry.degree}
              {entry.gpa ? `, GPA: ${entry.gpa}` : ""}
            </Text>
            {entry.dates ? (
              <Text style={s.rowRight}>{entry.dates}</Text>
            ) : null}
          </View>
          {entry.description ? (
            <Text style={s.text}>{entry.description}</Text>
          ) : null}
        </View>
      ))}
    </View>
  );
}

function PdfSkills({ data }: { data: SkillsSection }) {
  return (
    <View>
      {data.categories.map((cat) => (
        <Text key={cat.id} style={s.skillRow}>
          <Text style={s.bold}>{cat.category}:</Text> {cat.values}
        </Text>
      ))}
    </View>
  );
}

function PdfList({ data }: { data: ListSection }) {
  return (
    <View>
      {data.items.map((item) => (
        <View key={item.id} style={s.row}>
          <Text>
            <Text style={s.bold}>{item.name}</Text>
            {item.detail ? ` ${item.detail}` : ""}
          </Text>
          {item.dates ? (
            <Text style={s.rowRight}>{item.dates}</Text>
          ) : null}
        </View>
      ))}
    </View>
  );
}
