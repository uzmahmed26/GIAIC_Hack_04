import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

export const metadata: Metadata = {
  title: "Course Companion FTE — AI Agent Development",
  description:
    "Your Digital Full-Time Equivalent tutor for AI Agent Development. Learn Claude SDK, MCP Protocol, Agent Skills, and Agent Factory Architecture.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>{children}</body>
      </html>
    </ClerkProvider>
  );
}
