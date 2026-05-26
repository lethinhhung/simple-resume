import {
  SectionData,
  TextSection,
  EntrySection,
  EducationSection,
  SkillsSection,
  ListSection,
} from "@/lib/types";

export function SectionRenderer({ data }: { data: SectionData }) {
  switch (data.type) {
    case "text":
      return <TextRenderer data={data} />;
    case "entry":
      return <EntryRenderer data={data} />;
    case "education":
      return <EducationRenderer data={data} />;
    case "skills":
      return <SkillsRenderer data={data} />;
    case "list":
      return <ListRenderer data={data} />;
  }
}

function TextRenderer({ data }: { data: TextSection }) {
  if (!data.content) return null;
  return <p className="resume-text">{data.content}</p>;
}

function EntryRenderer({ data }: { data: EntrySection }) {
  return (
    <div className="resume-entries">
      {data.entries.map((entry) => (
        <div key={entry.id} className="resume-entry">
          <div className="resume-row">
            <span className="resume-entry-title">{entry.title}</span>
            {entry.location ? (
              <span className="resume-entry-right">{entry.location}</span>
            ) : (
              entry.dates && (
                <span className="resume-entry-right">{entry.dates}</span>
              )
            )}
          </div>
          {entry.location
            ? (entry.subtitle || entry.dates) && (
                <div className="resume-row">
                  <span className="resume-entry-subtitle">
                    {entry.subtitle}
                  </span>
                  {entry.dates && (
                    <span className="resume-entry-right">{entry.dates}</span>
                  )}
                </div>
              )
            : entry.subtitle && (
                <div className="resume-row">
                  <span className="resume-entry-subtitle">
                    {entry.subtitle}
                  </span>
                </div>
              )}
          {entry.description && (
            <p className="resume-text">{entry.description}</p>
          )}
          {entry.bullets.length > 0 && (
            <ul className="resume-bullets">
              {entry.bullets.map(
                (bullet, i) =>
                  bullet && (
                    <li key={i} className="resume-bullet">
                      {bullet}
                    </li>
                  )
              )}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
}

function EducationRenderer({ data }: { data: EducationSection }) {
  return (
    <div className="resume-entries">
      {data.entries.map((entry) => (
        <div key={entry.id} className="resume-entry">
          <div className="resume-row">
            <span className="resume-entry-title">
              {entry.institution.toUpperCase()}
            </span>
            {entry.location && (
              <span className="resume-entry-right">{entry.location}</span>
            )}
          </div>
          <div className="resume-row">
            <span>
              {entry.degree}
              {entry.gpa ? `, GPA: ${entry.gpa}` : ""}
            </span>
            {entry.dates && (
              <span className="resume-entry-right">{entry.dates}</span>
            )}
          </div>
          {entry.description && (
            <p className="resume-text">{entry.description}</p>
          )}
        </div>
      ))}
    </div>
  );
}

function SkillsRenderer({ data }: { data: SkillsSection }) {
  return (
    <div className="resume-skills">
      {data.categories.map((cat) => (
        <div key={cat.id} className="resume-skill-row">
          <span className="resume-skill-label">{cat.category}:</span>{" "}
          {cat.values}
        </div>
      ))}
    </div>
  );
}

function ListRenderer({ data }: { data: ListSection }) {
  return (
    <div className="resume-entries">
      {data.items.map((item) => (
        <div key={item.id} className="resume-row">
          <span>
            <strong>{item.name}</strong>
            {item.detail && ` ${item.detail}`}
          </span>
          {item.dates && (
            <span className="resume-entry-right">{item.dates}</span>
          )}
        </div>
      ))}
    </div>
  );
}
