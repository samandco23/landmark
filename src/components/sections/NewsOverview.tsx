import Image from "next/image";
import Link from "next/link";
import { getTranslations } from "next-intl/server";

const POSTS = [
  {
    title: "New EU Regulation Targets Greenwashing: as of September 27",
    category: "News",
    readTime: "Less than 1 minute read",
    image: "/assets/images/news-greenwashing.webp",
    alt: "EU greenwashing regulation",
  },
  {
    title: "Which Logistics Provider Should an Enterprise Brand Use for EU Expansion?",
    category: "Articles",
    readTime: "5 minutes read",
    image: "/assets/images/news-netherlands.jpg",
    alt: "Parcel delivery logistics",
  },
  {
    title: "Landmark Global to join EU CBEC Forum 2026, with Olivier Leruth speaking on marketplace panel",
    category: "News",
    readTime: "Less than 1 minute read",
    image: "/assets/images/news-cbec.jpg",
    alt: "EU CBEC Forum 2026",
  },
];

export async function NewsOverview() {
  const t = await getTranslations("home.blog");

  return (
    <section id="news" className="bg-white" style={{ paddingBlock: "var(--block-padding)" }}>
      <div className="container u-stack u-stack--12">
        <h3 className="font-serif text-2xl lg:text-3xl">{t("title")}</h3>
        <div className="grid gap-8 md:grid-cols-3">
          {POSTS.map((post) => (
            <article key={post.title} className="group u-stack u-stack--4">
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image
                  src={post.image}
                  alt={post.alt}
                  fill
                  sizes="(min-width: 768px) 33vw, 100vw"
                  className="object-cover transition-transform duration-200 ease-out group-hover:scale-[1.025]"
                />
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="rounded-badge bg-blue-light/30 px-1.5 py-0.5 font-semibold text-black">
                  {post.category}
                </span>
                <span className="text-grey-mid-02">–</span>
                <span className="font-semibold text-grey-mid-02">{post.readTime}</span>
              </div>
              <h4 className="font-sans font-semibold leading-snug text-grey-dark-02 group-hover:underline">
                {post.title}
              </h4>
            </article>
          ))}
        </div>
        <div className="pt-2">
          <Link href="/news" className="font-semibold text-red underline underline-offset-4">
            {t("readMore")}
          </Link>
        </div>
      </div>
    </section>
  );
}
