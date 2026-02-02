export const metadata = {
  title: 'Bilimevi Sözleşme Sistemi',
  description: 'Dijital sözleşme kabul platformu',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tr">
      <body>{children}</body>
    </html>
  )
}
