// Lightweight PDF report generator using browser print-to-PDF via a hidden window.
// Avoids extra deps and works offline.

interface SgpaReport {
  studentName: string;
  semester: string;
  courses: { name: string; credits: number; grade: string; point: number }[];
  sgpa: number;
  totalCredits: number;
}

interface CgpaReport {
  studentName: string;
  semesters: { label: string; sgpa: number; credits: number }[];
  repeats?: {
    course: string;
    credits: number;
    oldGrade: string;
    newGrade: string;
    delta: number;
  }[];
  baseCgpa?: number;
  cgpa: number;
  totalCredits: number;
}

const baseStyles = `
  * { box-sizing: border-box; }
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color: #111; padding: 40px; }
  h1 { margin: 0 0 4px; font-size: 24px; }
  .sub { color: #666; margin-bottom: 24px; font-size: 13px; }
  .meta { display: flex; gap: 24px; margin-bottom: 24px; font-size: 14px; }
  .meta div span { color: #666; }
  table { width: 100%; border-collapse: collapse; margin-bottom: 24px; font-size: 14px; }
  th, td { padding: 10px 12px; border-bottom: 1px solid #e5e5e5; text-align: left; }
  th { background: #f7f7f7; font-weight: 600; }
  .result { background: linear-gradient(135deg, #1e40af, #3b82f6); color: white; padding: 24px; border-radius: 12px; display: flex; gap: 32px; }
  .result .big { font-size: 36px; font-weight: 700; }
  .result .lbl { font-size: 11px; text-transform: uppercase; opacity: .85; letter-spacing: .05em; }
  footer { margin-top: 32px; color: #888; font-size: 11px; text-align: center; }
`;

function openAndPrint(html: string) {
  const w = window.open("", "_blank", "width=800,height=900");
  if (!w) return;
  w.document.write(html);
  w.document.close();
  w.focus();
  setTimeout(() => {
    w.print();
  }, 300);
}

export function downloadSgpaReport(r: SgpaReport) {
  const rows = r.courses
    .map(
      (c) =>
        `<tr><td>${escape(c.name)}</td><td>${c.credits}</td><td>${escape(c.grade)}</td><td>${c.point.toFixed(2)}</td><td>${(c.credits * c.point).toFixed(2)}</td></tr>`,
    )
    .join("");
  const html = `<!doctype html><html><head><title>SGPA Report</title><style>${baseStyles}</style></head><body>
    <h1>SGPA Report</h1>
    <div class="sub">Generated ${new Date().toLocaleDateString()}</div>
    <div class="meta">
      ${r.studentName ? `<div><span>Student:</span> <strong>${escape(r.studentName)}</strong></div>` : ""}
      ${r.semester ? `<div><span>Semester:</span> <strong>${escape(r.semester)}</strong></div>` : ""}
    </div>
    <table>
      <thead><tr><th>Course</th><th>Credits</th><th>Grade</th><th>Grade Point</th><th>Quality Points</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>
    <div class="result">
      <div><div class="lbl">SGPA</div><div class="big">${r.sgpa.toFixed(2)}</div></div>
      <div><div class="lbl">Total Credits</div><div class="big">${r.totalCredits}</div></div>
      <div><div class="lbl">Courses</div><div class="big">${r.courses.length}</div></div>
    </div>
    <footer>Superior University GPA Calculator</footer>
  </body></html>`;
  openAndPrint(html);
}

export function downloadCgpaReport(r: CgpaReport) {
  const rows = r.semesters
    .map(
      (s) =>
        `<tr><td>${escape(s.label)}</td><td>${s.sgpa.toFixed(2)}</td><td>${s.credits}</td><td>${(s.sgpa * s.credits).toFixed(2)}</td></tr>`,
    )
    .join("");
  const html = `<!doctype html><html><head><title>CGPA Report</title><style>${baseStyles}</style></head><body>
    <h1>CGPA Report</h1>
    <div class="sub">Generated ${new Date().toLocaleDateString()}</div>
    ${r.studentName ? `<div class="meta"><div><span>Student:</span> <strong>${escape(r.studentName)}</strong></div></div>` : ""}
    <table>
      <thead><tr><th>Semester</th><th>SGPA</th><th>Credits</th><th>Quality Points</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>
    <div class="result">
      <div><div class="lbl">CGPA</div><div class="big">${r.cgpa.toFixed(2)}</div></div>
      <div><div class="lbl">Total Credits</div><div class="big">${r.totalCredits}</div></div>
      <div><div class="lbl">Semesters</div><div class="big">${r.semesters.length}</div></div>
    </div>
    <footer>Superior University GPA Calculator</footer>
  </body></html>`;
  openAndPrint(html);
}

function escape(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
}
