export default function About() {
  return (
    <section className="py-16 bg-black text-white">
      <div className="container mx-auto px-4 max-w-4xl text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
          About The Vault
        </h2>

        <p className="text-lg text-gray-300 leading-relaxed">
          <span className="font-semibold text-white">The Vault</span> is more than just a channel — it’s a space where culture, creativity, and bold conversations live.
          Born from the belief that our stories deserve to be heard, The Vault dives deep into real topics with real people — from the streets to the studio.
        </p>

        <p className="mt-6 text-lg text-gray-300 leading-relaxed">
          Whether it’s breaking down trends, highlighting local creators, or just vibing over coffee and mic checks — we’re here for it.
          Hosted with heart, produced with hustle, and backed by a community that keeps it lit.
        </p>

        <div className="mt-10">
          <img
            src="/thevault1920edited.png"
            alt="The Vault Logo"
            className="mx-auto w-28 h-28 md:w-32 md:h-32 object-contain"
          />
        </div>
      </div>
    </section>
  );
}
