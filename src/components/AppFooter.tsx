export default function AppFooter() {
    return (
      <footer className="border-t">
        <div className="container py-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Toolsax. All rights reserved.</p>
          <p className="mt-1">
            Built with Next.js and Firebase. Hosted on Firebase App Hosting.
          </p>
        </div>
      </footer>
    );
}
