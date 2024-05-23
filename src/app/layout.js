import AddNewModal from "@/components/modal/add-new-modal/AddNewModal";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Techflix",
  description: "Product showcase by PSS Lab, ST Engineering",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          {children}
          <AddNewModal></AddNewModal>
        </Providers>
      </body>
    </html>
  );
}
