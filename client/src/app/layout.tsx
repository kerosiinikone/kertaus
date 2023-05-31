import "./globals.css";
import { Inter } from "next/font/google";
import { ApolloWrapper } from "../../lib/apollo-wrapper";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Kertaus App",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html className={inter.className}>
      <body>
        <ApolloWrapper>{children}</ApolloWrapper>
      </body>
    </html>
  );
}
