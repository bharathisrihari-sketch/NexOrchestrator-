import JSZip from 'jszip';

// Dynamically capture all source files and root configs using Vite's raw glob import
const rawFiles = import.meta.glob(
  [
    '/src/**/*.{ts,tsx,css}',
    '/index.html',
    '/package.json',
    '/tsconfig.json',
    '/vite.config.ts',
    '/metadata.json'
  ],
  { query: '?raw', import: 'default', eager: true }
) as Record<string, string>;

export interface ExportCodeOptions {
  appName?: string;
  workflows?: any[];
  currentWorkflowId?: string;
}

export function generateClaudeMarkdownBundle(options?: ExportCodeOptions): string {
  const appName = options?.appName || 'NxtGenOrchestrator';
  const fileEntries = Object.entries(rawFiles).sort(([a], [b]) => a.localeCompare(b));

  let md = `# ${appName} – Complete Project Codebase for Claude\n\n`;
  md += `**Export Generated:** ${new Date().toISOString()}\n`;
  md += `**Target System:** Low-Code / No-Code AI-Powered ETL & Data Integration Platform Blueprint\n`;
  md += `**Total Files Included:** ${fileEntries.length}\n\n`;

  md += `## Project Overview & Context\n`;
  md += `NxtGenOrchestrator is an enterprise-grade ETL, streaming, and pipeline orchestration studio. It features an interactive DAG canvas, drag-to-connect node connectors, multi-workflow sequencing, zero-trust security profiles, execution simulation with real-time logs, and Power BI DirectLake target reporting.\n\n`;

  md += `## File Directory Index\n`;
  for (const [filePath] of fileEntries) {
    const cleanPath = filePath.startsWith('/') ? filePath.slice(1) : filePath;
    md += `- \`${cleanPath}\`\n`;
  }
  md += `\n---\n\n`;

  md += `## Full Code Listing\n\n`;
  for (const [filePath, content] of fileEntries) {
    const cleanPath = filePath.startsWith('/') ? filePath.slice(1) : filePath;
    const ext = cleanPath.split('.').pop() || '';
    const lang = ext === 'tsx' || ext === 'ts' ? 'typescript' : ext === 'json' ? 'json' : ext === 'css' ? 'css' : ext === 'html' ? 'html' : 'text';
    md += `### File: \`${cleanPath}\`\n\n`;
    md += '```' + lang + '\n';
    md += content;
    md += '\n```\n\n';
  }

  return md;
}

export async function exportProjectZip(options?: ExportCodeOptions) {
  const zip = new JSZip();
  const appName = options?.appName || 'NxtGenOrchestrator';

  // 1. Add all real source and config files to the zip
  const fileEntries = Object.entries(rawFiles);
  for (const [filePath, content] of fileEntries) {
    const relativePath = filePath.startsWith('/') ? filePath.slice(1) : filePath;
    zip.file(relativePath, content);
  }

  // 2. Add Claude-specific markdown bundle ready to upload or paste into Claude
  const claudeMarkdown = generateClaudeMarkdownBundle(options);
  zip.file('CLAUDE_PROMPT_ALL_CODE.md', claudeMarkdown);

  // 3. Add Comprehensive README and manifest
  zip.file('README.md', `# ${appName} – Enterprise AI-Powered ETL & Workflow Orchestration Studio

This package contains the complete, stand-alone codebase and architectural specifications for **${appName}**.

## Quick Start (Run Locally on Any Machine)

1. **Extract this zip file**:
   \`\`\`bash
   unzip ${appName.toLowerCase()}-code-complete.zip -d ${appName.toLowerCase()}
   cd ${appName.toLowerCase()}
   \`\`\`

2. **Install dependencies**:
   \`\`\`bash
   npm install
   \`\`\`

3. **Start the development server**:
   \`\`\`bash
   npm run dev
   \`\`\`
   Access the application in your browser at \`http://localhost:3000\`.

4. **Build for Production**:
   \`\`\`bash
   npm run build
   npm run preview
   \`\`\`

## Checking in Claude
- This zip file includes **\`CLAUDE_PROMPT_ALL_CODE.md\`**, which contains the full, organized codebase formatted for Claude.
- You can upload either this entire \`.zip\` archive or \`CLAUDE_PROMPT_ALL_CODE.md\` directly into Claude's prompt window to review, refactor, or query any part of the project.

## Architecture Highlights
- **Canvas & DAG**: Interactive visual graph with drag-to-connect nodes, pan/zoom, and floating draggable parameter controls.
- **Workflow Connectors**: High-throughput Kafka, Snowflake, AWS S3, gRPC, REST, and Power BI DirectLake sinks.
- **Multi-Workflow Sequence**: Connect 2 or more workflows in sequence with start/target gateway nodes.
- **Timestamped Execution Logs**: Millisecond-accurate execution timeline and telemetry.
`);

  zip.file('nxtgenorchestrator-manifest.json', JSON.stringify({
    application: appName,
    exportedAt: new Date().toISOString(),
    version: "4.5.0-enterprise",
    totalSourceFiles: fileEntries.length,
    activeWorkflowId: options?.currentWorkflowId || "wf-enterprise-mesh",
    workflows: options?.workflows || []
  }, null, 2));

  // 4. Generate ZIP blob and trigger browser download
  const blob = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${appName.toLowerCase()}-code-complete.zip`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  return true;
}

export function downloadClaudeMarkdownFile(options?: ExportCodeOptions) {
  const appName = options?.appName || 'NxtGenOrchestrator';
  const md = generateClaudeMarkdownBundle(options);
  const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${appName.toLowerCase()}-code-for-claude.md`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  return true;
}
