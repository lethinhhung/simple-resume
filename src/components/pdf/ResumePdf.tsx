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
import { parseRichText } from "@/lib/rich-text";

Font.registerHyphenationCallback((word) => [word]);

const GFONTS = "https://cdn.jsdelivr.net/gh/google/fonts@main/ofl";

Font.register({
  family: "Roboto",
  fonts: [
    { src: `${GFONTS}/roboto/Roboto%5Bwdth%2Cwght%5D.ttf`, fontWeight: "normal" },
    { src: `${GFONTS}/roboto/Roboto%5Bwdth%2Cwght%5D.ttf`, fontWeight: "bold" },
    { src: `${GFONTS}/roboto/Roboto-Italic%5Bwdth%2Cwght%5D.ttf`, fontStyle: "italic" },
    { src: `${GFONTS}/roboto/Roboto-Italic%5Bwdth%2Cwght%5D.ttf`, fontWeight: "bold", fontStyle: "italic" },
  ],
});

Font.register({
  family: "Lato",
  fonts: [
    { src: `${GFONTS}/lato/Lato-Regular.ttf` },
    { src: `${GFONTS}/lato/Lato-Bold.ttf`, fontWeight: "bold" },
    { src: `${GFONTS}/lato/Lato-Italic.ttf`, fontStyle: "italic" },
    { src: `${GFONTS}/lato/Lato-BoldItalic.ttf`, fontWeight: "bold", fontStyle: "italic" },
  ],
});

Font.register({
  family: "EBGaramond",
  fonts: [
    { src: `${GFONTS}/ebgaramond/EBGaramond%5Bwght%5D.ttf` },
    { src: `${GFONTS}/ebgaramond/EBGaramond%5Bwght%5D.ttf`, fontWeight: "bold" },
    { src: `${GFONTS}/ebgaramond/EBGaramond-Italic%5Bwght%5D.ttf`, fontStyle: "italic" },
    { src: `${GFONTS}/ebgaramond/EBGaramond-Italic%5Bwght%5D.ttf`, fontWeight: "bold", fontStyle: "italic" },
  ],
});

Font.register({
  family: "OpenSans",
  fonts: [
    { src: `${GFONTS}/opensans/OpenSans%5Bwdth%2Cwght%5D.ttf` },
    { src: `${GFONTS}/opensans/OpenSans%5Bwdth%2Cwght%5D.ttf`, fontWeight: "bold" },
    { src: `${GFONTS}/opensans/OpenSans-Italic%5Bwdth%2Cwght%5D.ttf`, fontStyle: "italic" },
    { src: `${GFONTS}/opensans/OpenSans-Italic%5Bwdth%2Cwght%5D.ttf`, fontWeight: "bold", fontStyle: "italic" },
  ],
});

Font.register({
  family: "Calibri",
  fonts: [
    { src: `${GFONTS}/carlito/Carlito-Regular.ttf` },
    { src: `${GFONTS}/carlito/Carlito-Bold.ttf`, fontWeight: "bold" },
    { src: `${GFONTS}/carlito/Carlito-Italic.ttf`, fontStyle: "italic" },
    { src: `${GFONTS}/carlito/Carlito-BoldItalic.ttf`, fontWeight: "bold", fontStyle: "italic" },
  ],
});

function buildStyles(ps: PageSettings) {
  const BASE = ps.fontSize;
  return StyleSheet.create({
    page: {
      paddingTop: ps.marginTop * 28.3465,
      paddingBottom: ps.marginBottom * 28.3465,
      paddingLeft: ps.marginLeft * 28.3465,
      paddingRight: ps.marginRight * 28.3465,
      fontFamily: ps.fontFamily,
      fontSize: BASE,
      lineHeight: 1.3,
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
      marginTop: 7,
    },
    sectionTitle: {
      fontSize: BASE,
      fontWeight: "bold",
      textAlign: "center",
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
    italicOnly: {
      fontStyle: "italic",
    },
    text: {
      marginTop: 1,
    },
    entry: {
      marginBottom: 5,
    },
    entryLast: {
      marginBottom: 0,
    },
    bullet: {
      paddingLeft: 10,
    },
    skillsContainer: {
      lineHeight: 1,
      gap: 0,
    },
    skillRow: {
      marginBottom: -1,
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

// Turns inline-emphasis markup into react-pdf nodes: plain runs stay raw strings,
// emphasized runs become nested <Text> with the matching weight/style. The
// literal asterisks are dropped, keeping the PDF ATS-safe.
function renderRuns(value: string, s: S) {
  return parseRichText(value).map((run, i) => {
    if (!run.bold && !run.italic) return run.text;
    const style = run.bold && run.italic ? s.boldItalic : run.bold ? s.bold : s.italicOnly;
    return (
      <Text key={i} style={style}>
        {run.text}
      </Text>
    );
  });
}

function PdfText({ data, styles: s }: { data: TextSection; styles: S }) {
  if (!data.content) return null;
  return <Text style={s.text}>{renderRuns(data.content, s)}</Text>;
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
            <Text style={s.text}>{renderRuns(entry.description, s)}</Text>
          ) : null}
          {entry.bullets.map(
            (bullet, i) =>
              bullet && (
                <Text key={i} style={s.bullet}>
                  - {renderRuns(bullet, s)}
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
            <Text style={s.text}>{renderRuns(entry.description, s)}</Text>
          ) : null}
        </View>
      ))}
    </View>
  );
}

function PdfSkills({ data, styles: s }: { data: SkillsSection; styles: S }) {
  return (
    <View style={s.skillsContainer}>
      {data.categories.map((cat) => (
        <Text key={cat.id} style={s.skillRow}>
          <Text style={s.bold}>{cat.category}:</Text> {renderRuns(cat.values, s)}
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
            {item.detail ? <Text> {renderRuns(item.detail, s)}</Text> : null}
          </Text>
          {item.dates ? (
            <Text style={s.rowRight}>{item.dates}</Text>
          ) : null}
        </View>
      ))}
    </View>
  );
}
