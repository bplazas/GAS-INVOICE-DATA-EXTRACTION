# WhatsApp Invoice Extractor (Google Apps Script)

Portfolio project: Automate invoice processing from WhatsApp → AI extraction (Google APIs) → Google Sheets DB.

Features in progress:

- WhatsApp attachment listener (via API)
- Blob → Drive storage
- Format detection (PDF editable/image/non-editable)
- AI JSON extraction
- Manual confirmation for missing fields
- Batch processing 1-2× daily

Tech: Google Apps Script + clasp + VS Code + GitHub

Follow the journey: @mountain_cund on X

## Current Status (21 Feb 2026)
- Config-driven via projectData.json
- Folder listing & JSON summary generation
- Modal UI for invoice selection (dummy text for now)
- Next: Load real file list into modal + start editable PDF extraction

## Latest: Visual PDF Preview in Modal (Feb 22, 2026)
- file list ready in to modal
- selection of pdf on modal ready
- Next: processing of selected files using AI to extract content

## Latest: Multi-file preview tabs (Feb 23, 2026)
- Selection modal → Process Selected → opens one tab per invoice
- Custom page with large thumbnail + extracted placeholder
- Delay added to avoid browser popup blocker
- Next: Add editable fields + Approve/Reject buttons

## Latest: Data Extraction (Feb 25, 2026)
- Data Extraction from invoice files using Gemini
- Update html showing PDF and data extracted

## Final (Feb 26, 2026)
- Data Extraction saved to a Google SpreadSheet
- Project Completed
