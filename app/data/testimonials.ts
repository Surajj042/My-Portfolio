import type { Testimonial } from "../types";

/*
 * ============================================================================
 * SAMPLE CONTENT — REPLACE BEFORE DEPLOYING
 * ============================================================================
 *
 * These entries are NOT real testimonials. Nobody wrote them, nobody is quoted,
 * and no organisation is represented.
 *
 * The names are plausible on purpose, so the card layout is exercised honestly:
 * two-line attributions, differing name lengths, and a long company name that
 * has to wrap next to a 48px portrait. "Client Name" hid all of that.
 *
 * The companies are INVENTED — each is a name I made up, not a real
 * organisation. That is a deliberate line. A fabricated quote attributed to a
 * generic person is a lie on a template; the same quote attributed to a company
 * that actually exists is a lie about something a reader could go and check, and
 * potentially about a named business. If you replace these, check the same way:
 * no real company should ever appear here without a quote they actually gave.
 *
 * The avatars are generated, not photographed — `scripts/generate-avatars.mjs`
 * draws a gradient tile carrying each person's initials. A stock photo standing
 * in for a named face is a fabricated likeness attached to a fabricated quote.
 * These read as placeholders but occupy the space a real portrait would, so the
 * card can be judged at its true size. Swap in consented photographs by
 * dropping files into `public/assets/avatars/` and repointing `avatar`.
 *
 * The entries are not uniform on purpose. One carries a `company`, one omits
 * `rating` entirely, and the lengths differ, so the layout paths that differ get
 * exercised rather than assumed.
 *
 * TO SHIP THIS SECTION FOR REAL:
 *   1. Delete every entry below and paste in quotes you have actually been
 *      given, with the person's name, role and company as they consented to
 *      them being published.
 *   2. If you have no testimonials yet, delete the whole `testimonials` array
 *      and remove the section from `app/app-client.tsx` and the `navLinks`
 *      entry in `app/data/site.config.ts`. An empty testimonials section is
 *      worse than no testimonials section.
 *   3. If a quote came from a colleague rather than a paying client, say so in
 *      the `role` field (e.g. "Teammate, N-GVLH project"). The distinction
 *      matters to whoever reads it.
 *   4. Keep the count a multiple of 3 (PER_PAGE in `sections/Testimonials.tsx`)
 *      so the two pages stay balanced. A trailing page of one card looks
 *      broken next to a full one.
 *   5. Regenerate the tiles after editing names: `npm run generate:avatars`.
 */
export const testimonials: Testimonial[] = [
  {
    quote:
      "Took over a project that had stalled twice and got it to launch. Asked the right questions early, which is most of why it moved.",
    name: "Anish Rai",
    role: "Founder",
    company: "Ledgerline",
    avatar: "/assets/avatars/anish-rai.png",
    rating: 5,
  },
  {
    quote:
      "The bug had been open for months. It turned out to be one line, found in an afternoon, and explained so our team could follow it.",
    name: "Sneha Adhikari",
    role: "Operations Lead",
    company: "Brightleaf Retail",
    avatar: "/assets/avatars/sneha-adhikari.png",
    rating: 5,
  },
  {
    quote:
      "Rebuilt our internal reporting around what people actually ask for, rather than the report we had always been producing.",
    name: "Bikash Thapa",
    role: "Product Manager",
    company: "Himal Byte",
    avatar: "/assets/avatars/bikash-thapa.png",
    rating: 4,
  },
  {
    quote:
      "Handover notes that made sense. Sounds minor until you are the one receiving the project six months later.",
    name: "Pratiksha Shah",
    role: "Studio Manager",
    avatar: "/assets/avatars/pratiksha-shah.png",
  },
  {
    quote:
      "We had a half-finished feature and a deadline. It got scoped down, shipped, and the part nobody wanted to touch turned out to be the easy part once it was written down.",
    name: "Nirajan Gurung",
    role: "Technical Director",
    company: "Everest Fintech",
    avatar: "/assets/avatars/nirajan-gurung.png",
    rating: 5,
  },
  {
    quote:
      "Straightforward to work with, quick to answer, and patient with the questions we should have known the answers to.",
    name: "Aashma Khadka",
    role: "Co-founder",
    company: "Karnali Foods",
    avatar: "/assets/avatars/aashma-khadka.png",
    rating: 5,
  },
];
