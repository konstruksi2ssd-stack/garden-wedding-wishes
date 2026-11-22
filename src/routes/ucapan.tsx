import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import monogram from "@/assets/monogram.png.asset.json";
import { wishesQuery } from "@/lib/wishes";
import { PetalRain, Twinkles } from "@/components/invite/LiveOrnaments";
import { WishList, WishStats, WishWallHeader, useLiveWishes } from "@/components/invite/WishWall";

export const Route = createFileRoute("/ucapan")({
  head: () => ({
    meta: [
      { title: "Dinding Ucapan & Doa — Salsabila & Lukman" },
      { name: "description", content: "Baca semua ucapan dan doa dari para tamu untuk pernikahan Salsabila & Lukman." },
      { property: "og:title", content: "Dinding Ucapan & Doa untuk Salsabila & Lukman" },
      { property: "og:description", content: "Ucapan dan doa restu dari keluarga dan sahabat untuk Salsabila & Lukman." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(wishesQuery),
  component: WishesPage,
  errorComponent: () => (
    <main className="flex min-h-screen items-center justify-center bg-royal-navy p-6 text-center">
      <div>
        <p className="font-display text-xl text-ivory">Ucapan belum bisa dimuat.</p>
        <Link to="/ucapan" className="btn-gold mt-4 px-6 py-2 text-sm">Coba lagi</Link>
      </div>
    </main>
  ),
});

function WishesPage() {
  const { data: wishes } = useSuspenseQuery(wishesQuery);
  useLiveWishes();
  return (
    <main className="relative min-h-screen overflow-hidden bg-royal-navy">
      <PetalRain count={12} seed={4} className="fixed" />
      <Twinkles count={12} seed={9} className="fixed" />
      <div className="relative mx-auto max-w-3xl px-5 py-14 text-center">
        <img src={monogram.url} alt="Monogram S&L" className="floaty mx-auto mb-5 h-20" />
        <WishWallHeader />
        <div className="mt-8">
          <WishStats wishes={wishes} />
        </div>
        <div className="mt-8">
          <WishList wishes={wishes} />
        </div>
        <Link to="/" className="btn-gold mt-10 px-8 py-3 text-sm">Buka Undangan</Link>
      </div>
    </main>
  );
}
