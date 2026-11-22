# Blog, FAQ and 404 photo credits

Photos used by the redesigned `/blog`, `/blog/{slug}`, `/faq` and the site's 404 page (not in legacy;
design kit: `docs/site-design-kit.md`). None of them repeats a photo, or a photo series, used in
`../../home/` or elsewhere in `../`. Every photo shows Indian children, students or schools. All are
free to use commercially under the [Pexels License](https://www.pexels.com/license/); attribution is
not required but is recorded here. Files were downloaded at 2400px wide (2026-11-22) into a new
scratch directory, checked with `file`, then cropped and compressed locally (sharp, mozjpeg q78) at
2× their largest display size. Each can be replaced from the Site Image Manager (Web Studio → Site
Images → folder `pages/blog`); none replaces a legacy theme image, so there is no legacy key.

| File | Size | Used on / shows | Legacy key that still wins | Source | Photographer |
|---|---|---|---|---|---|
| `blog-hero.jpg` | 1200×1000 | /blog hero: a young boy smiling over his workbook under a desk lamp at home | — | https://www.pexels.com/photo/child-studying-under-soft-lamplight-at-home-40746551/ | angel studio (Pexels) |
| `faq-hero.jpg` | 1200×1000 | /faq hero: a schoolgirl raising both hands among classmates in uniform, Jaipur | — | https://www.pexels.com/photo/cheerful-schoolgirl-outdoors-in-jaipur-india-39112159/ | Nitin Khajotia (Pexels) |
| `not-found.jpg` | 960×1200 | 404 page (`not-found.tsx`, `/site-404`): a young boy glancing sideways, curious | — | https://www.pexels.com/photo/portrait-of-a-young-boy-in-a-field-environment-35516671/ | ratankumerder DEY (Pexels) |
| `post-cover-1.jpg` | 1200×750 | Blog post without a cover image (cards, featured post, post page): girls laughing over a book together | — | https://www.pexels.com/photo/photo-of-children-sitting-together-4666964/ | Life Folk (Pexels) |
| `post-cover-2.jpg` | 1200×750 | Blog post without a cover image: two university students filming with a phone stabiliser on campus | — | https://www.pexels.com/photo/university-students-filming-with-mobile-stabilizer-37071199/ | Nowrin Sanjana (Pexels) |
| `post-cover-3.jpg` | 1200×750 | Blog post without a cover image: four schoolgirls in uniform walking down a tree-lined road, Raipur | — | https://www.pexels.com/photo/schoolgirls-walking-outdoors-in-raipur-india-39122603/ | "Beyond India" by Shubham Thakur (Pexels) |

Notes: the Pexels pages for `blog-hero.jpg`, `not-found.jpg`, `post-cover-1.jpg` and
`post-cover-2.jpg` tag them "Indian student", "Indian boy", "Indian children" and "Indian students"
but give no town. `faq-hero.jpg` shows school lanyards whose print is too small to read at display
size. The fallback cover is chosen per post (`post.id % 3`), so a post keeps the same photo.
