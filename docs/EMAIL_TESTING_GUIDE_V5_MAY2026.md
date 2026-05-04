# EMAIL — Testing Guide v5 (May 2026)

**To:** beggferoza@gmail.com, zenithyassin@gmail.com
**CC:** chad.cupido91@gmail.com
**Subject:** Omni Wellness Media — Testing Guide v5 (May 2026) — Please review this week

---

Hi Feroza and Zenith,

Thank you for all the testing feedback so far — it's made a real difference to the quality of the platform.

We've just shipped a major update and need your eyes on it. The full testing guide (v5) is attached as a PDF. Please try to complete the tests by end of this week if possible.

Here's a summary of what's new and what to focus on:

---

**WHAT'S NEW TO TEST**

**1. Provider Pro Upgrade Page (brand new page)**
URL: https://www.omniwellnessmedia.co.za/upgrade

This is a new page we'd like you to review carefully — it's the first thing a wellness practitioner sees when they decide to upgrade. Please check:
- Does it look professional and trustworthy?
- Do both the WhatsApp and Email activation buttons work?
- Does it read clearly on your phone?

**2. Provider Dashboard — Three New Tabs**
URL: https://www.omniwellnessmedia.co.za/provider-dashboard (requires login)

The dashboard now has 10 tabs. Three of them (Analytics, Clients, Financial) are gated behind Provider Pro. When you're on a free account:
- Each of these tabs should show a blurred preview with an upgrade card — NOT an error
- The upgrade card should link correctly to the upgrade page
- The "Pro" label should appear next to each gated tab name in the tab bar

**3. Sandy Mitchell's Redesigned Profile**
URL: https://www.omniwellnessmedia.co.za/provider/sandy-mitchell

Sandy's profile has been completely rebuilt in an Airbnb-style layout. Key things to check:
- The hero cover strip and lifted avatar look correct
- Clicking through the Services, About, Packages, and Gallery tabs all work
- On mobile: is there a sticky bar at the bottom with price + Book button?
- Does the overall design feel professional and trustworthy?

**4. Consumer Account Page (Redesigned)**
URL: https://www.omniwellnessmedia.co.za/wellness-exchange/account (requires login)

The account page has been rebuilt with a proper profile layout. Please check:
- Cover strip loads
- WellCoin Wallet card shows your balance
- "Complete Profile" checklist shows which fields are still needed
- Sign out button works

---

**TESTS FROM PREVIOUS VERSIONS — PLEASE CONFIRM THESE STILL WORK**

These were fixed in earlier sprints. Please confirm nothing has broken:

✅ **Blog Save Draft** (https://www.omniwellnessmedia.co.za/blog/editor/new)
Write a title + content, click "Save Draft" — should show green "Draft saved successfully" toast. NOT a red error.

✅ **Tour Booking** (https://www.omniwellnessmedia.co.za/tours/great-mother-cave-tour)
Fill in the booking form and submit — should show green "Booking Submitted!" toast. Test while logged out AND while logged in.

✅ **Admin Sidebar** (https://www.omniwellnessmedia.co.za/admin)
Admin dashboard should show sidebar navigation on the left with three groups (Core, Manage, System), smart greeting at top, and home screen with quick actions.

---

**HOW TO REPORT ISSUES**

When something doesn't work, please send:
1. The exact URL (copy from your browser address bar)
2. What you expected to happen
3. What actually happened (the exact error message if there is one)
4. A screenshot — on phone: hold side button + volume up
5. Whether you were logged in or not
6. Your device (e.g. iPhone, Android, Windows laptop) and browser (Chrome, Safari)

Send to:
- Tumelo: ttncube01@gmail.com
- Or reply to this email

---

**KEY LINKS FOR TESTING**

| Page | URL |
|------|-----|
| Homepage | https://www.omniwellnessmedia.co.za |
| Admin Dashboard | https://www.omniwellnessmedia.co.za/admin |
| Provider Dashboard | https://www.omniwellnessmedia.co.za/provider-dashboard |
| Provider Pro Upgrade | https://www.omniwellnessmedia.co.za/upgrade |
| Sandy Mitchell Profile | https://www.omniwellnessmedia.co.za/provider/sandy-mitchell |
| Consumer Account | https://www.omniwellnessmedia.co.za/wellness-exchange/account |
| Great Mother Cave Tour | https://www.omniwellnessmedia.co.za/tours/great-mother-cave-tour |
| Blog Editor | https://www.omniwellnessmedia.co.za/blog/editor/new |
| Services | https://www.omniwellnessmedia.co.za/services |
| Contact | https://www.omniwellnessmedia.co.za/contact |

---

The full checklist with every individual checkbox is in the attached PDF (Testing Guide v5). You don't need to test everything — prioritise the NEW sections first, then the existing ones.

Thank you both — this is genuinely important work and we appreciate you doing it.

Best,
Tumelo

Tumelo Ncube | Technical Lead, Omni Wellness Media
ttncube01@gmail.com

---
*Attachment: Omni_Wellness_Testing_Guide_v5_May2026.pdf*
