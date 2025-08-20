import { Tool } from './types';

export const ALL_TOOLS: Tool[] = [
  {
    "id": "case-converter",
    "name": "Case Converter",
    "description": "Convert text to uppercase, lowercase, etc.",
    "link": "/case-converter",
    "category": "Utilities",
    "icon": "CaseUpper"
  },
  {
    "id": "password-generator",
    "name": "Password Generator",
    "description": "Create secure, random passwords.",
    "link": "/password-generator",
    "category": "Security",
    "icon": "Lock"
  },
  {
    "id": "qr-generator",
    "name": "QR Code Generator",
    "description": "Create custom QR codes for URLs or text.",
    "link": "/qr-generator",
    "category": "Utilities",
    "icon": "QrCode"
  },
  {
    "id": "json-formatter",
    "name": "JSON Formatter",
    "description": "Format, validate, and beautify JSON data.",
    "link": "/json-formatter",
    "category": "Development",
    "icon": "Braces"
  },
  {
    "id": "lorem-ipsum-generator",
    "name": "Lorem Ipsum Generator",
    "description": "Generate placeholder text for your designs.",
    "link": "/lorem-ipsum-generator",
    "category": "Content",
    "icon": "FileText"
  },
  {
    "id": "color-converter",
    "name": "Color Converter",
    "description": "Convert between HEX, RGB, and HSL values.",
    "link": "/color-converter",
    "category": "Design",
    "icon": "Palette"
  },
  {
    "id": "image-compressor",
    "name": "Image Compressor",
    "description": "Reduce file size of JPG & PNG images.",
    "link": "/image-compressor",
    "category": "Image",
    "icon": "Minimize2",
    "authRequired": true
  },
  {
    "id": "markdown-editor",
    "name": "Markdown Editor",
    "description": "Write and preview Markdown in real-time.",
    "link": "/markdown-editor",
    "category": "Content",
    "icon": "FileSignature"
  },
  {
    "id": "unit-converter",
    "name": "Unit Converter",
    "description": "Convert length, weight, temperature, etc.",
    "link": "/unit-converter",
    "category": "Utilities",
    "icon": "Ruler"
  },
  {
    "id": "word-counter",
    "name": "Word Counter",
    "description": "Count words, characters, and sentences.",
    "link": "/word-counter",
    "category": "Content",
    "icon": "FileJson2"
  },
  {
    "id": "url-encoder-decoder",
    "name": "URL Encoder & Decoder",
    "description": "Encode or decode special characters in URLs.",
    "link": "/url-encoder-decoder",
    "category": "Development",
    "icon": "Link"
  },
  {
    "id": "image-resizer",
    "name": "Image Resizer",
    "description": "Resize images to specific dimensions online.",
    "link": "/image-resizer",
    "category": "Image",
    "icon": "Crop",
     "authRequired": true
  },
  {
    "id": "base64-encoder",
    "name": "Base64 Encoder & Decoder",
    "description": "Encode or decode text to Base64 format.",
    "link": "/base64-encoder",
    "category": "Development",
    "icon": "Binary"
  },
  {
    "id": "hash-generator",
    "name": "Hash Generator",
    "description": "Generate MD5, SHA-1, SHA-256 hashes.",
    "link": "/hash-generator",
    "category": "Security",
    "icon": "Fingerprint"
  },
  {
    "id": "favicon-generator",
    "name": "Favicon Generator",
    "description": "Create a favicon from any image.",
    "link": "/favicon-generator",
    "category": "Image",
    "icon": "Heart",
     "authRequired": true
  },
  {
    "id": "html-minifier",
    "name": "HTML Minifier",
    "description": "Minify and compress HTML code.",
    "link": "/html-minifier",
    "category": "Development",
    "icon": "FileCode"
  },
  {
    "id": "css-minifier",
    "name": "CSS Minifier",
    "description": "Minify and optimize CSS stylesheets.",
    "link": "/css-minifier",
    "category": "Development",
    "icon": "FileCode2"
  },
  {
    "id": "javascript-minifier",
    "name": "JavaScript Minifier",
    "description": "Compress and minify JavaScript files.",
    "link": "/javascript-minifier",
    "category": "Development",
    "icon": "FileCode2"
  },
  {
    "id": "meta-tag-generator",
    "name": "Meta Tag Generator",
    "description": "Create SEO-friendly meta tags for websites.",
    "link": "/meta-tag-generator",
    "category": "SEO",
    "icon": "Code"
  },
  {
    "id": "open-graph-generator",
    "name": "Open Graph Generator",
    "description": "Generate Open Graph tags for social sharing.",
    "link": "/open-graph-generator",
    "category": "SEO",
    "icon": "Share2"
  },
  {
    "id": "slug-generator",
    "name": "Slug Generator",
    "description": "Convert text into SEO-friendly slugs.",
    "link": "/slug-generator",
    "category": "SEO",
    "icon": "Globe"
  },
  {
    "id": "emoji-picker",
    "name": "Emoji Picker",
    "description": "Search and copy emojis instantly.",
    "link": "/emoji-picker",
    "category": "Content",
    "icon": "Smile"
  },
  {
    "id": "gradient-generator",
    "name": "Gradient Generator",
    "description": "Create custom CSS gradients.",
    "link": "/gradient-generator",
    "category": "Design",
    "icon": "Paintbrush"
  },
  {
    "id": "box-shadow-generator",
    "name": "Box Shadow Generator",
    "description": "Generate CSS box shadows visually.",
    "link": "/box-shadow-generator",
    "category": "Design",
    "icon": "BoxSelect"
  },
  {
    "id": "border-radius-generator",
    "name": "Border Radius Generator",
    "description": "Visualize and generate CSS border-radius.",
    "link": "/border-radius-generator",
    "category": "Design",
    "icon": "Square"
  },
  {
    "id": "regex-tester",
    "name": "Regex Tester",
    "description": "Test and debug regular expressions.",
    "link": "/regex-tester",
    "category": "Development",
    "icon": "Scan"
  },
  {
    "id": "html-entity-converter",
    "name": "HTML Entity Converter",
    "description": "Convert text to HTML entities and vice versa.",
    "link": "/html-entity-converter",
    "category": "Development",
    "icon": "Code2"
  },
  {
    "id": "icon-finder",
    "name": "Icon Finder",
    "description": "Search and download icons.",
    "link": "/icon-finder",
    "category": "Design",
    "icon": "Search"
  },
  {
    "id": "text-diff-checker",
    "name": "Text Diff Checker",
    "description": "Compare two texts and highlight differences.",
    "link": "/text-diff-checker",
    "category": "Content",
    "icon": "GitCompareArrows"
  },
  {
    "id": "pdf-merger",
    "name": "PDF Merger",
    "description": "Merge multiple PDF files into one.",
    "link": "/pdf-merger",
    "category": "PDF",
    "icon": "FilePlus",
    "authRequired": true
  },
  {
    "id": "pdf-splitter",
    "name": "PDF Splitter",
    "description": "Split PDF files into separate pages.",
    "link": "/pdf-splitter",
    "category": "PDF",
    "icon": "FileMinus"
  },
  {
    "id": "image-to-pdf",
    "name": "Image to PDF",
    "description": "Convert images to PDF format.",
    "link": "/image-to-pdf",
    "category": "PDF",
    "icon": "FileImage"
  },
  {
    "id": "speech-to-text",
    "name": "Speech to Text",
    "description": "Convert speech to written text.",
    "link": "/speech-to-text",
    "category": "Utilities",
    "icon": "Mic"
  },
  {
    "id": "text-to-speech",
    "name": "Text to Speech",
    "description": "Convert text into natural-sounding speech.",
    "link": "/text-to-speech",
    "category": "Utilities",
    "icon": "Volume2"
  },
  {
    "id": "audio-converter",
    "name": "Audio Converter",
    "description": "Convert audio files to different formats.",
    "link": "/audio-converter",
    "category": "Utilities",
    "icon": "FileAudio"
  },
  {
    "id": "github-to-jsdelivr-converter",
    "name": "GitHub to jsDelivr Converter",
    "description": "Migrating from GitHub to jsDelivr.",
    "link": "/github-to-jsdelivr-converter",
    "category": "Development",
    "icon": "Github"
  },
  {
    "id": "whatsapp-message-generator",
    "name": "WhatsApp Message Generator",
    "description": "Create custom WhatsApp messages for quick sharing.",
    "link": "/whatsapp-message-generator",
    "category": "Social Media",
    "icon": "MessageSquare"
  }
];
