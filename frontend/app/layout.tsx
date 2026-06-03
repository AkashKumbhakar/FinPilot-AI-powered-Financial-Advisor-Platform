import "./globals.css";
import Providers from "./providers";
import { ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          {children}
        </Providers>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          theme="dark"
        />
      </body>
    </html>
  );
}