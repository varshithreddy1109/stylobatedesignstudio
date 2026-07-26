import Image from "next/image";

export default function Hero() {
  return (
    <section className="pt-20 md:pt-24">
      <div className="relative aspect-[16/9] w-full overflow-hidden md:aspect-[21/9]">
        <Image
          src="/images/hero-banner.jpg"
          alt="Stylobate Design Studio"
          fill
          priority
          className="object-cover"
        />
      </div>
    </section>
  );
}
