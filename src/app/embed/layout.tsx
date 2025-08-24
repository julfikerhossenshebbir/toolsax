
// This is a minimal layout for embedded content
export default function EmbedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-transparent">
          {children}
      </body>
    </html>
  );
}
