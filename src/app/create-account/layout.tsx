import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Create Account-MockInter',
  description: 'Create new account in MockInter',
}

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  )
}
