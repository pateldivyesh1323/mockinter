import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Verify your Email Address',
  description: 'Verify your Email Address to login to MockInter',
}

export default function VerifyEmailLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <main>
      {children}
    </main>
  )
}
