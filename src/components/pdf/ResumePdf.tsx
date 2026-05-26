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
  PageSettings,
} from "@/lib/types";

Font.registerHyphenationCallback((word) => [word]);

function buildStyles(ps: PageSettings) {
  const BASE = ps.fontSize;
  return StyleSheet.create({
    page: {
      paddingTop: ps.marginTop * 72,
      paddingBottom: ps.marginBottom * 72,
      paddingLeft: ps.marginLeft * 72,
      paddingRight: ps.marginRight * 72,
      fontFamily: "Times-Roman",
      fontSize: BASE,
      lineHeight: 1.2,
      color: "#000",
    },
    header: {
      alignItems: "center",
      marginBottom: 2,
    },
    name: {
      fontSize: BASE * 1.45,
      fontWeight: "bold",
      letterSpacing: 0.5,
      lineHeight: 1.2,
    },
    subtitle: {
      fontSize: BASE,
      fontWeight: "bold",
      marginTop: 1,
    },
    contacts: {
      fontSize: BASE * 0.92,
      marginTop: 1,
    },
    section: {
      marginTop: 4,
    },
    sectionTitle: {
      fontSize: BASE,
      fontWeight: "bold",
      textAlign: "center",
      textDecoration: "underline",
      marginBottom: 2,
    },
    row: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-end",
    },
    rowRight: {
      textAlign: "right",
      flexShrink: 0,
      marginLeft: 8,
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
      marginBottom: 2,
    },
    entryLast: {
      marginBottom: 0,
    },
    bullet: {
      paddingLeft: 10,
    },
    skillRow: {
      lineHeight: 1.15,
    },
  });
}

export function ResumePdf({ resume }: { resume: ResumeData }) {
  const enabledSections = resume.sections.filter((sec) => sec.enabled);
  const s = buildStyles(resume.pageSettings);

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
          <SectionBlock key={section.id} section={section} styles={s} />
        ))}
      </Page>
    </Document>
  );
}

function SectionBlock({
  section,
  styles: s,
}: {
  section: Section;
  styles: ReturnType<typeof buildStyles>;
}) {
  return (
    <View style={s.section}>
      <Text style={s.sectionTitle}>{section.label}</Text>
      <SectionContent data={section.data} styles={s} />
    </View>
  );
}

function SectionContent({
  data,
  styles: s,
}: {
  data: SectionData;
  styles: ReturnType<typeof buildStyles>;
}) {
  switch (data.type) {
    case "text":
      return <PdfText data={data} styles={s} />;
    case "entry":
      return <PdfEntry data={data} styles={s} />;
    case "education":
      return <PdfEducation data={data} styles={s} />;
    case "skills":
      return <PdfSkills data={data} styles={s} />;
    case "list":
      return <PdfList data={data} styles={s} />;
  }
}

type S = ReturnType<typeof buildStyles>;

function PdfText({ data, styles: s }: { data: TextSection; styles: S }) {
  if (!data.content) return null;
  return <Text style={s.text}>{data.content}</Text>;
}

function PdfEntry({ data, styles: s }: { data: EntrySection; styles: S }) {
  return (
    <View>
      {data.entries.map((entry, idx) => (
        <View
          key={entry.id}
          style={idx < data.entries.length - 1 ? s.entry : s.entryLast}
        >
          <View style={s.row}>
            <Text style={s.bold}>{entry.title}</Text>
            {entry.location ? (
              <Text style={s.rowRight}>{entry.location}</Text>
            ) : entry.dates ? (
              <Text style={s.rowRight}>{entry.dates}</Text>
            ) : null}
          </View>
          {entry.location ? (
            entry.subtitle || entry.dates ? (
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

function PdfEducation({
  data,
  styles: s,
}: {
  data: EducationSection;
  styles: S;
}) {
  return (
    <View>
      {data.entries.map((entry, idx) => (
        <View
          key={entry.id}
          style={idx < data.entries.length - 1 ? s.entry : s.entryLast}
        >
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

function PdfSkills({ data, styles: s }: { data: SkillsSection; styles: S }) {
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

function PdfList({ data, styles: s }: { data: ListSection; styles: S }) {
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
