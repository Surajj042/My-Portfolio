import { Poppins, Roboto } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
});

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-roboto",
});

export const metadata = {
  title: "Suraj Gurung | Portfolio",
  description:
    "Suraj Gurung – Full Stack Developer portfolio showcasing modern web projects, skills, and experience.",
  icons: {
    icon: [
      { url: "/assets/Logo.png", sizes: "any" },
      { url: "/assets/Logo.png", sizes: "192x192", type: "image/png" },
      { url: "/assets/Logo.png", sizes: "512x512", type: "image/png" },
    ],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} ${roboto.variable}`}>
        {children}
      </body>
    </html>
  );
}
