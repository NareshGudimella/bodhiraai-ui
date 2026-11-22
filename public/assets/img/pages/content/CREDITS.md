# Content pages photo credits

Photos used by the redesigned content-group marketing pages (`/features`, `/courses`, `/course`,
`/course-details`, `/teachers`, `/success-stories`; not in legacy; design kit:
`docs/site-design-kit.md`). None of them is used on the homepage (`../../home/`), the other
redesigned pages (`../`) or the sign-in pages (`../../auth/`). Every photo shows Indian students,
teachers or professionals. All are free to use commercially under the
[Pexels License](https://www.pexels.com/license/) or the [Unsplash License](https://unsplash.com/license);
attribution is not required but is recorded here. Files were downloaded at 2400px wide
(2026-11-22) into an empty scratch directory, checked with `file`, then cropped and compressed
locally (sharp, mozjpeg q78) at 2× their largest display size. In `features-hero.jpg` the brand name
printed on the smart board's frame was blurred out. Each can be replaced from the Site Image Manager
(Web Studio → Site Images → folder `pages/content`); where a legacy theme image key had the same
role, a replacement saved under that legacy key still wins (`imageResolver()` in `src/lib/site.ts`).

| File | Size | Used on / shows | Legacy key that still wins | Source | Photographer |
|---|---|---|---|---|---|
| `features-hero.jpg` | 1200×1000 | /features hero: a teacher explaining a circuit diagram on an interactive smart board (Multitech Institute, New Delhi) | — | https://www.pexels.com/photo/engineer-teaching-igbt-gate-driver-circuit-class-35157344/ | Multitech Institute (Pexels) |
| `features-cta.jpg` | 1400×800 | /features and /success-stories closing call-to-action card: schoolboys raising their hands in class | — | https://unsplash.com/photos/FOLReFbwgLI | amol sonar (Unsplash) |
| `courses-hero.jpg` | 1200×1000 | /courses hero: children laughing beside a Hindi and English alphabet chart painted on the classroom wall | — | https://www.pexels.com/photo/smiling-girl-and-boys-sitting-under-walls-with-letters-at-school-20556421/ | Kunal Lakhotia (Pexels) |
| `courses-primary.jpg` | 600×720 | /courses class level "Class 1 – 5": young children sitting on a classroom floor, India | — | https://www.pexels.com/photo/group-of-listening-little-children-sitting-on-the-floor-1895114/ | Balljinder Singh (Pexels) |
| `courses-middle.jpg` | 600×720 | /courses class level "Class 6 – 8": a smiling schoolgirl in uniform with her school bag, Lucknow | — | https://www.pexels.com/photo/a-woman-smiling-at-the-camera-14075587/ | 112 Uttar Pradesh (Pexels) |
| `courses-secondary.jpg` | 600×720 | /courses class level "Class 9 – 10": secondary students in uniform writing at their desks (crop), CIMT Hooghly, West Bengal | — | https://unsplash.com/photos/a-classroom-full-of-students-sitting-at-desks-I4lLt9g8i3k | CIMT HOOGHLY (Unsplash) |
| `courses-senior.jpg` | 600×720 | /courses class level "Class 11 – 12": a student reading at a library desk, New Delhi | — | https://www.pexels.com/photo/student-reading-a-book-16504588/ | Shantanu Kumar (Pexels) |
| `course-react.jpg` | 1200×750 | /course card 1 ("React Tutorial…", Skill): a student with his laptop on a park bench | `assets/img/images/course-img-1.png` | https://www.pexels.com/photo/young-indian-boy-is-doing-his-work-in-laptop-15598845/ | Sanket Mishra (Pexels) |
| `course-teaching.jpg` | 1200×750 | /course cards 2 and 6 (legacy used the same image for both): teachers with girls in a colourful classroom | `assets/img/images/course-img-2.png` | https://www.pexels.com/photo/girls-in-indian-school-12199101/ | Eternal Traveler (Pexels) |
| `course-strategies.jpg` | 1200×750 | /course card 3 ("Innovative Instructional Strategies…"): students and their mentor testing a bottle rocket they built, a hands-on science activity in Kharagpur, West Bengal (cropped to leave out an umbrella with a printed brand) | `assets/img/images/course-img-3.png` | https://www.pexels.com/photo/students-conducting-rocket-launch-experiment-outdoors-40350769/ | Fliqa India (Pexels) |
| `course-develop.jpg` | 1200×750 | /course card 4 ("React Tutorial…", Develop): a developer holding up a "CODE" sticky note | `assets/img/images/course-img-4.png` | https://www.pexels.com/photo/man-in-grey-sweater-holding-yellow-sticky-note-879109/ | Hitesh Choudhary (Pexels) |
| `course-management.jpg` | 1200×750 | /course card 5 ("Cultural Perspectives…", Management): a teacher talking with schoolgirls in a heritage building | `assets/img/images/course-img-5.png` | https://www.pexels.com/photo/man-talking-to-the-band-22686426/ | Fahad Puthawala (Pexels) |
| `course-details.jpg` | 1200×750 | /course-details hero: a designer working on a laptop at a long desk | `assets/img/service/course-details-img.png` | https://www.pexels.com/photo/focused-professional-in-modern-workspace-setting-40062245/ | Jatin Chaudhary (Pexels) |
| `teachers-hero.jpg` | 1200×1000 | /teachers hero: a teacher with folded arms in front of a chalkboard | — | https://www.pexels.com/photo/confident-man-standing-in-front-of-blackboard-36781276/ | Anil Sharma (Pexels) |
| `success-hero.jpg` | 1200×1000 | /success-stories hero: students celebrating in shirts covered in friends' signatures, Vidisha, Madhya Pradesh | — | https://www.pexels.com/photo/group-of-happy-students-celebrating-together-outdoors-31968811/ | Yash Bakode (Pexels) |

Notes: `teachers-hero.jpg` is by the same photographer as two homepage photos (`content-tablet.jpg`,
`blog-fallback-3.jpg`) but shows a different person. `course-management.jpg` is by the photographer
of `../pricing-schools.jpg` (a different group and place). `course-details.jpg` is tagged Dublin on
Pexels; the photo itself shows no location. /shop uses no photos: the theme's product images were
grey placeholders, so the cards draw typographic book covers (a Site Image Manager replacement under
`assets/img/shop/shop-N.png` is shown instead when one exists).
