import type { Testimonial } from "../types";

/*
 * ============================================================================
 * PLACEHOLDER CONTENT — REPLACE BEFORE DEPLOYING
 * ============================================================================
 *
 * These entries are NOT real testimonials. Nobody wrote them, nobody is
 * quoted, and no company is represented. The names below are deliberately
 * generic placeholders rather than invented people, because publishing a
 * fabricated quote under a plausible-sounding name is misinformation: a
 * visitor would reasonably read "Priya Raman, Senior Engineer at Vercel" as a
 * real endorsement, and could make a hiring or contracting decision on it.
 *
 * The layout is 3 cards across on desktop, so cards are narrow and the
 * carousel advances every 3 seconds. Both of those push hard in the same
 * direction: quotes here are deliberately short, roughly 20-30 words, which is
 * about what a reader can actually finish in a 3 second dwell. Real quotes
 * should be trimmed to a similar length or the cards will have to scroll.
 *
 * The entries are not uniform on purpose. One has a `company`, one omits
 * `rating` entirely, so the two layout paths that differ get exercised rather
 * than assumed.
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
 *
 * There is no `avatar` field on purpose: a stock photo standing in for a
 * person's face is the same problem one level down.
 */
export const testimonials: Testimonial[] = [
  {
    quote:
      "Placeholder quote — short enough to finish in one 3 second pass, but long enough that the card holds its full width without collapsing.",
    name: "Client Name",
    role: "Role at Company",
    rating: 5,
  },
  {
    quote:
      "Placeholder quote describing a result rather than a personality, which is the shape most real testimonials take once the work produced something measurable.",
    name: "Client Name",
    role: "Role at Company",
    rating: 5,
  },
  {
    quote:
      "Placeholder quote with a `company` attached, so the attribution line runs onto two lines and the card height can be checked against its neighbours.",
    name: "Client Name",
    role: "Role at Company",
    company: "Company",
    rating: 4,
  },
  {
    quote:
      "Placeholder quote with no `rating` field at all, so the layout path where the star row is missing gets exercised rather than assumed to be fine.",
    name: "Client Name",
    role: "Role at Company",
  },
  {
    quote:
      "Placeholder quote — this is the widest of the six, kept long on purpose to prove the grid stacks to the tallest card instead of clipping the name and role.",
    name: "Client Name",
    role: "Role at Company",
    rating: 5,
  },
  {
    quote:
      "Placeholder quote closing the second page. Six entries is two full pages of three, with no ragged remainder on the end.",
    name: "Client Name",
    role: "Role at Company",
    rating: 5,
  },
];
