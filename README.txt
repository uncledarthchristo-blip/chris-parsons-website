THE FACES OF CHRIS PARSONS — WEBSITE PREVIEW V16

This is a local preview only. It has NOT been deployed to Netlify.
The proposed domain chrisparson.uk is awaiting Chris's final approval and has not been configured.

To preview:
1. Extract this ZIP.
2. Open index.html in a modern web browser.
3. Keep the assets folder beside index.html.

Version 16 additions:
- Product photographs for the 4-LOM Funko Pop, Stormtrooper Funko Pop and Hikari Stormtrooper.
- Five populated photograph galleries with permanent reference numbers.
- Reference numbers appear beneath thumbnails and in the enlarged image view.
- The Autograph Shop's signed-photo link points to the galleries.
- Clear email ordering instructions connect gallery selections to Chris's order process.
- Wookieepedia link for the 4-LOM story retained.
- Product and gallery imagery uses supplied photographs.

Gallery reference prefixes:
4L = 4-LOM
C3 = C-3PO
IF = Imperial Forces
PD = Protocol Droids
RA = Rebel Alliance

The companion PDF "chris-parsons-photo-quick-reference-v16.pdf" is supplied separately for Chris.
It contains thumbnails and the matching reference numbers, plus a simple order-handling guide.

Ordering details shown:
- Signed 10 x 8 photograph: £35
- Personal dedications: no extra charge
- Payment: PayPal in GBP
- Postage: quoted individually; tracked available at extra cost by arrangement
- Dispatch target: within 7 days
- Contact: chrisparsons1@gmx.com

Before production deployment:
- Chris to approve the domain name and provide final domain registration/DNS details.
- Chris to confirm that the gallery image selections and product descriptions are correct.
- Run a final desktop/mobile and link/order-flow test.

Gallery correction applied after review:
- Removed C3-003 (duplicate).
- Removed IF-003 and IF-005 (duplicates).
- Removed PD-007.
- Kept all remaining reference numbers unchanged; gaps are intentional.
- Reframed PD-006 thumbnail to favour the upper body.
See the revised companion PDF for the corrected thumbnail guide.

Version 16 layout refinement:
- Removed the separate 'Other Roles & Characters' section and its navigation/feature links. The five detailed photo galleries now provide the visual overview of Chris's roles.

Gallery framing correction: RA-004 now uses a dedicated upper-body thumbnail crop showing Chris's face, shoulders and chest. The full original photo remains available when opened.

RA-004 framing update: gallery thumbnail now uses a face-and-shoulders crop. The full original photograph remains available when opened. Quick Reference Guide updated to match.

Additional update: RA-004 gallery thumbnail zoomed out to show Chris's face, shoulders and more of his upper body. Added an Upcoming Appearances landing-page tile and dedicated section, ready for confirmed convention listings.
RA-004 thumbnail uses the full original photo with contain-fit so Chris remains visible rather than an over-tight crop.


UPCOMING APPEARANCES – GOOGLE SHEETS FEED
The Upcoming Appearances section reads this published CSV feed directly (no Netlify function required): 
https://docs.google.com/spreadsheets/d/e/2PACX-1vTh4QKl1QTGA6Jlg96AB3ic3TCpNvRC0Ciffwz_dyc5vUt7xJGXO1sr37RtX-msJA/pub?gid=290466325&single=true&output=csvsr37RtX-msJA/pub?gid=290466325&single=true&output=csv

The page displays rows whose Status is PUBLISH, with a valid event name and start date. DRAFT and CANCELLED rows are ignored by the page. Important: a published CSV is publicly readable, so do not put confidential details in the published tab. The best practice is to publish a tab containing only public event information.

After this integration is deployed once, edit the spreadsheet to update appearances; no Netlify rebuild is needed for normal event changes. Visitors may need to refresh the page, and Google may take a short time to update its published feed.

V26 update: Added 4-LOM gallery images 4L-010 through 4L-012. Existing references retained.


VERSION 32 UPDATE
Protocol Droids gallery additions: PD-014 K-3PO and C-3PO on Hoth; PD-015 E-3PO in the corridor; PD-016 R-3PO on the film set. Existing references retained. Duplicate photos from the supplied batch were not added.


APPEARANCES FIX (V35): The Google Sheets CSV feed is read automatically by script.js.
The date parser now supports Australian D/M/YYYY slash dates as well as ISO dates and dotted day-first dates.
No Netlify setting change is required for the Google Sheets feed itself. Upload/deploy this package to publish the code fix.
