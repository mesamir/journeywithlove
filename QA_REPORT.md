
---

## QA_REPORT.md

```markdown
# QA Report — Willowbrook Adult Family Home Prototype

**Important honesty note:** I authored this code but **could not execute it in a browser**.
Per the project instructions, I will not mark anything "Pass" unless it was actually
verified. Statuses below distinguish *static review* (I read the code and traced the logic)
from *browser verification* (not performed here).

| # | Test scenario | Expected result | Actual result | Status | Notes |
|---|---|---|---|---|---|
| 1 | All 13 HTML files exist | 13 pages present | 13 pages written | Static review OK / Browser not run | — |
| 2 | Shared header & footer inject on every page | Every page shows nav + footer | `main.js` targets `#siteHeader`/`#siteFooter`, present on all pages | Static review OK / Browser not run | Requires `config.js` + `main.js` to load |
| 3 | Active nav state | Current page highlighted | `aria-current="page"` set by comparing `body[data-page]` | Static review OK / Browser not run | Every page sets `data-page` |
| 4 | Mobile hamburger opens/closes menu | Panel slides in, focus moves in | `navigation.js` toggles classes, sets `aria-expanded`, traps focus | Static review OK / Browser not run | — |
| 5 | Escape closes mobile menu | Menu closes, focus restored | `keydown` handler calls `close()`, restores `lastFocus` | Static review OK / Browser not run | — |
| 6 | Sticky header shadow on scroll | Class added past 12px | Scroll listener present | Static review OK / Browser not run | — |
| 7 | Back-to-top button appears after scroll | Visible past 480px | `.visible` toggled | Static review OK / Browser not run | — |
| 8 | Accordion expand/collapse | Panel toggles, chevron rotates | `faq.js` toggles `aria-expanded` and `hidden` | Static review OK / Browser not run | Single-open per group by default |
| 9 | Accordion keyboard operable | Enter/Space toggle | Native `<button>` used | Static review OK / Browser not run | — |
| 10 | FAQ search filters questions | Non-matching items hidden | `input` handler filters on textContent | Static review OK / Browser not run | — |
| 11 | FAQ category filter | Only category shown | `data-faq-filter` buttons set `cat` | Static review OK / Browser not run | — |
| 12 | FAQ empty state | Message shown when 0 results | `.show` toggled on `#faqEmpty` | Static review OK / Browser not run | — |
| 13 | Gallery category filter | Items hidden/shown | `gallery.js` toggles `.hidden` and rebuilds `visible` | Static review OK / Browser not run | — |
| 14 | Lightbox opens on click | Overlay shown, focus to close btn | `open()` sets `.open`, focuses `#lbClose` | Static review OK / Browser not run | — |
| 15 | Lightbox prev/next | Cycles through visible images | `open(index±1)` with modulo | Static review OK / Browser not run | — |
| 16 | Lightbox Escape closes | Overlay closes, focus restored | `keydown` handler | Static review OK / Browser not run | — |
| 17 | Lightbox arrow keys | Prev/next navigation | `ArrowLeft`/`ArrowRight` handled | Static review OK / Browser not run | — |
| 18 | Lightbox focus trap | Tab cycles within dialog | First/last button wrap logic | Static review OK / Browser not run | — |
| 19 | Contact form required validation | Empty fields flagged | `validate()` adds `.error` + message | Static review OK / Browser not run | — |
| 20 | Contact form email validation | Invalid email flagged | Regex check in `forms.js` | Static review OK / Browser not run | — |
| 21 | Contact form phone validation | Invalid phone flagged | Regex `[\d\s()+.-]{7,}` | Static review OK / Browser not run | Deliberately permissive |
| 22 | Contact form saves to localStorage | Entry in `afh_contact_messages` | `S.push(S.KEYS.contact, …)` | Static review OK / Browser not run | — |
| 23 | Contact form clears after submit | Fields reset | `contact.reset()` | Static review OK / Browser not run | — |
| 24 | Admission form validation | Same as contact | Shared `validate()` | Static review OK / Browser not run | — |
| 25 | Admission form saves to localStorage | Entry in `afh_admission_inquiries` | `S.push(S.KEYS.admission, …)` | Static review OK / Browser not run | — |
| 26 | Tour date input blocks past dates | `min` set to today | `dateInput.min = todayISO()` | Static review OK / Browser not run | Client-side only |
| 27 | Tour slot availability renders | 7 slots appear | `renderSlots()` builds buttons | Static review OK / Browser not run | — |
| 28 | Booked slots disabled | Slot not selectable | `b.disabled = booked.includes(time)` | Static review OK / Browser not run | — |
| 29 | Duplicate slot prevention | Cannot pick same slot twice | Disabled on render for same date | Static review OK / Browser not run | — |
| 30 | Tour form requires a slot | Error if none selected | `selectedSlot` check | Static review OK / Browser not run | — |
| 31 | Tour submission saves | Entry in `afh_tour_requests` | `S.push(S.KEYS.tour, entry)` | Static review OK / Browser not run | — |
| 32 | Tour success message clarifies status | "Not a confirmed appointment" shown | Copy in `#tourSuccess` and toast | Static review OK / Browser not run | — |
| 33 | Saved tour requests listed | Requests render | `renderSaved()` | Static review OK / Browser not run | — |
| 34 | Cancel a tour request | Status → cancelled, button disabled | `S.write` with mapped status | Static review OK / Browser not run | — |
| 35 | Toast notifications | Appear and auto-dismiss | 5.2s timeout, manual close | Static review OK / Browser not run | — |
| 36 | Copyright year dynamic | Current year rendered | `new Date().getFullYear()` | Static review OK / Browser not run | — |
| 37 | localStorage unavailable | No crash, message shown | `available()` guard + try/catch | Static review OK / Browser not run | — |
| 38 | Skip link | First tab focuses it | First element in `<body>` | Static review OK / Browser not run | — |
| 39 | Reduced motion | Transitions disabled | `prefers-reduced-motion` block | Static review OK / Browser not run | — |
| 40 | Responsive layout at 320px | No horizontal overflow | Single-column rules at 640px | Static review OK / Browser not run | Should be visually confirmed |
| 41 | Unique page titles & descriptions | One per page | Written per page | Static review OK | — |
| 42 | No duplicated IDs within a page | Unique IDs | Reviewed per page | Static review OK | — |
| 43 | Console errors | None expected | Not executed | **Not verified** | Must be checked in a browser |
| 44 | Broken internal links | All resolve | Reviewed by name | Static review OK | Confirm after download |
| 45 | WCAG 2.2 AA conformance | Meets AA | Not audited | **Not verified** | Independent audit required |
| 46 | Real email delivery / appointment confirmation | N/A (by design) | Not implemented | N/A | Prototype limitation |

### Outstanding work before this can be called production-ready
- Browser verification of every row above.
- Cross-browser testing (Safari especially, for `backdrop-filter` and `aspect-ratio`).
- Independent accessibility audit with real assistive-technology users.
- Legal review of privacy policy and terms.
- Replacement of all placeholder content and photography.
- Backend integration for form delivery, with server-side validation and spam protection.