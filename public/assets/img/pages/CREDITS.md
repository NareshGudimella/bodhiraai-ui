# Marketing page photo credits

Photos used by the redesigned marketing pages other than the homepage (not in legacy; design kit:
`docs/site-design-kit.md`). The homepage's photos live in `../home/` with their own CREDITS.md;
pages don't reuse a homepage photo. Every photo with people shows Indian students, teachers,
parents or staff, and none shows a readable logo or brand (checked at full size). All are free to use commercially under the [Pexels License](https://www.pexels.com/license/);
attribution is not required but is recorded here. Files were downloaded at 2400px wide
(2026-11-22), checked with `file`, then cropped and compressed locally (sharp, mozjpeg q78) at 2×
their largest display size. Each can be replaced from the Site Image Manager (Web Studio → Site
Images → folder `pages`); where a legacy image key had the same role, a replacement saved under that
legacy key still wins (`imageResolver()` in `src/lib/site.ts`).

| File | Size | Used on / shows | Legacy key that still wins | Source | Photographer |
|---|---|---|---|---|---|
| `about-hero.jpg` | 1200×1000 | /about hero: two students in maroon school blazers reading in a bright school library, India | — | https://www.pexels.com/photo/students-studying-in-a-library-in-india-33745692/ | Gokuldham Nar (Pexels) |
| `about-classroom.jpg` | 1200×840 | /about "How Bodhira.ai works" (video thumbnail): schoolgirls in uniform listening in class, India | `assets/img/images/about-img-1.jpg` | https://www.pexels.com/photo/photograph-of-girls-in-a-classroom-3231358/ | Yogendra Singh (Pexels) |
| `about-map.jpg` | 640×480 | /about "How Bodhira.ai works", second photo: a student pointing to a map of India, Patiala | `assets/img/images/about-img-2.jpg` | https://www.pexels.com/photo/young-girl-learning-geography-with-indian-map-31864391/ | Bipspatiala (Pexels) |
| `role-student.jpg` | 600×720 | /about role card "Student" (shown when the CMS has no team): a schoolgirl in uniform reading in the school library, teacher behind | `assets/img/team/team-men-1.png` | https://www.pexels.com/photo/students-studying-in-modern-library-interior-33745700/ | Gokuldham Nar (Pexels) |
| `role-teacher.jpg` | 600×720 | /about role card "Teacher": a teacher explaining to schoolboys (crop of the same photo as `pricing-schools.jpg`) | `assets/img/team/team-men-2.png` | https://www.pexels.com/photo/teacher-standing-among-young-boys-in-shirts-22616347/ | Fahad Puthawala (Pexels) |
| `role-parent.jpg` | 600×720 | /about role card "Parent": a mother singing with her children at the harmonium at home | `assets/img/team/team-men-3.png` | https://www.pexels.com/photo/music-lesson-with-harmonium-and-engaged-children-34195649/ | Fakhrul Hassan (Pexels) |
| `role-admin.jpg` | 600×720 | /about role card "School Admin": a woman at her desk in an office | `assets/img/team/team-men-4.png` | https://www.pexels.com/photo/indian-woman-in-an-office-18890945/ | Rajib Ahmed (Pexels) |
| `video-lessons.jpg` | 1200×750 | /about "Watch Lessons by Topic": students in uniform around a laptop, Biyani Girls College, Jaipur. **Edited:** a media-brand sticker on the laptop lid was painted out | `assets/img/images/video-img-1.png` | https://www.pexels.com/photo/women-in-office-by-laptop-at-table-18067562/ | Biyani Girls College (Pexels) |
| `video-feedback.jpg` | 1200×750 | /about "Take a Quiz, Get Feedback": a teacher going over a student's work at his desk | `assets/img/images/video-img-2.png` | https://www.pexels.com/photo/teacher-with-a-student-in-a-classroom-18870246/ | World Sikh Organization of Canada (Pexels) |
| `pricing-hero.jpg` | 1200×1000 | /pricing hero: a young boy in a kurta and cap following an online lesson on a laptop at home | — | https://www.pexels.com/photo/a-boy-using-a-laptop-while-sitting-on-a-couch-4384091/ | Photographielove (Pexels) |
| `pricing-schools.jpg` | 1400×800 | /pricing closing call-to-action card: a teacher with schoolboys on a heritage visit | — | https://www.pexels.com/photo/teacher-standing-among-young-boys-in-shirts-22616347/ | Fahad Puthawala (Pexels) |

Notes: `video-feedback.jpg` belongs to the same Sikh-school series as the homepage's
`faq-students.jpg` (different photo; the Pexels page gives no location). `role-admin.jpg` is an
office portrait, not a photo of a real school administrator; swap it for a partner school's
photo when one is available. Rejected in review (2026-11-22): a STEM-lab photo with a large
readable brand name on the wall, a laptop with an Apple logo, and a hero photo that didn't read
as an Indian student.
