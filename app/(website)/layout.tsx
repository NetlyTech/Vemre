import Navbar from "@/components/components/NavBar";
import FooterComp from "@/components/components/FooterComp";

export default function WebsiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main className="min-h-[70vh]">{children}</main>
      <FooterComp />
    </>
  );
}
