import "./globals.css";
import { Inter } from "next/font/google";
import Header from "@/components/Header";
import { ApolloWrapper } from "@/lib/apollo-wrapper";
import { UserContextProvider } from "@/context/UserContext";

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
      <body className="flex justify-center bg-gradient-to-r from-white to-neutral-100">
        <ApolloWrapper>
          <UserContextProvider>
            <div className="container flex flex-col max-w-3xl">
              <Header />
              <div className="container flex justify-center md:my-18 my-10">
                {children}
              </div>
            </div>
          </UserContextProvider>
        </ApolloWrapper>
      </body>
    </html>
  );
}
