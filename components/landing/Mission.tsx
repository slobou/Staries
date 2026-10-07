export default function Mission() {
  return (
    <section className="bg-star text-ink">
      <div className="mx-auto flex max-w-5xl items-start gap-6 px-6 py-20 sm:gap-10">
        <span
          aria-hidden="true"
          className="select-none font-serif text-[9rem] font-black leading-[0.7] text-brand sm:text-[12rem]"
        >
          ”
        </span>
        <blockquote className="space-y-5">
          <p className="text-2xl font-extrabold leading-snug sm:text-4xl">
            We connect authors and readers through fast publishing, immersive
            reading, and curated quality. All in one app.
          </p>
          <p className="max-w-2xl text-base font-medium sm:text-lg">
            Blockchain is not the product — it is the trust layer. You just
            publish, and your work is protected automatically.
          </p>
        </blockquote>
      </div>
    </section>
  )
}
