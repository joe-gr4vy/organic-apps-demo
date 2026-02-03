export const metadata = {
  title: 'OrganicApps - Subscription',
  description: 'Personalized fitness and nutrition plans',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0 }}>
        {children}
      </body>
    </html>
  );
}