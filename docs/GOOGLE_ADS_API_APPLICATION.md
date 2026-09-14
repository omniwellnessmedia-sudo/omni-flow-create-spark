# Google Ads API: getting the developer token

What this unlocks: the "Send to Google Ads" button on Admin, Marketing,
Google Ads. Today the screen builds an upload file the team drops into the
account. With a developer token the same campaigns post straight into the
account from the admin, paused, in one click.

Account facts (verified in `docs/ADS_SETUP_RUNBOOK.md` and `src/lib/googleAds.ts`):

| Item | Value |
|---|---|
| Google Ads customer ID | 396-986-7500 |
| Conversion tag | AW-11266714886 |
| Currency | ZAR |
| Site | https://omniwellnessmedia.co.za |

Google only issues developer tokens to a **manager account** (an MCC).
The customer ID above is a normal account, so step 1 creates a manager
account and links the existing one under it. Nothing about the existing
campaigns, billing or history changes.

## Step 1. Create a manager account and link Omni's account (10 minutes)

1. Sign in with the Google account that owns 396-986-7500.
2. Go to https://ads.google.com/home/tools/manager-accounts/ and choose
   **Create a manager account**.
   - Name: `Omni Wellness Media`
   - Use: `Manage my own accounts`
   - Country: South Africa. Time zone: Johannesburg. Currency: ZAR.
3. Inside the new manager account: **Accounts**, then **Sub-account settings**,
   then the plus button, **Link existing account**, and enter `396-986-7500`.
4. Sign back into the ordinary account, open **Tools**, **Access and security**,
   **Managers**, and accept the link request.

## Step 2. Apply for the developer token (5 minutes)

1. Sign into the **manager** account.
2. **Tools**, then **Setup**, then **API Center**. (On older layouts: Tools and
   settings, Setup, API Center.)
3. Fill in the form:
   - API contact email: the Omni team inbox you read daily. Google sends
     policy notices here and expects a reply within a few days.
   - Company name: Omni Wellness Media
   - Company URL: https://omniwellnessmedia.co.za
   - Company type: Advertiser
   - Intended use: Managing my own campaigns
4. Accept the terms and submit.

The token appears at once with **Test account** access. That is enough for
me to build and test the button against a test account. Live posting needs
**Basic access**, which is step 3.

## Step 3. Apply for Basic access (15 minutes, then a few working days)

In the same API Center page, next to the access level, choose **Apply for
Basic access**. The form asks the questions below. Suggested answers, all
true of what is built:

**Describe your tool and how it uses the Google Ads API.**

> An internal admin screen on our own website. Staff pick one of our
> published services, an AI pass drafts responsive search ad copy inside
> the character limits, staff edit and approve it, and one button creates
> the campaign, ad group, keywords and ad in our own Google Ads account in
> a paused state. Staff then enable it inside Google Ads. The tool only
> writes to our own account and only creates campaigns; it never changes
> billing, budgets on running campaigns, or anything outside our account.

**Who will use it?** Omni Wellness Media staff, two to four people. Nobody outside the company.

**Which accounts will it access?** Only our own account, 396-986-7500, under our own manager account.

**Which API services will you use?** CampaignService, AdGroupService,
AdGroupAdService, AdGroupCriterionService, CampaignBudgetService. Read
access to CampaignService and the search reports for a status list.

**How does the tool handle Required Minimum Functionality?** Not applicable.
The tool is for our own account and is not offered to third parties, so
RMF does not apply.

**Will you store Google Ads data?** Only the IDs of campaigns the tool
created, so the screen can show whether a campaign already exists. No
performance data is stored outside Google Ads.

**Estimated daily API calls.** Under 200 on a busy day.

Google normally answers within a few working days. If they ask for a
design document, this file is it; send them the link to this page in the
repository.

## Step 4. Google Cloud OAuth (10 minutes, can be done while waiting)

The button needs a way to sign in as Omni. This is a one-off.

1. Go to https://console.cloud.google.com and create a project called
   `Omni Ads`, under the same Google account.
2. **APIs and services**, **Library**, search **Google Ads API**, **Enable**.
3. **APIs and services**, **OAuth consent screen**: User type **Internal** if
   Omni has Google Workspace, otherwise **External**. App name
   `Omni Ads Admin`, support email the team inbox. Add the scope
   `https://www.googleapis.com/auth/adwords`.
4. **Credentials**, **Create credentials**, **OAuth client ID**, type
   **Web application**, name `Omni Ads Admin`. Add this authorised redirect
   URI: `https://omniwellnessmedia.co.za/admin/ads/callback`.
5. Copy the **Client ID** and **Client secret**.

## Step 5. Hand me four values

Send these by a private channel, never in a WhatsApp group, never in a commit:

1. Developer token (from API Center)
2. Manager account ID (the 10 digit number at the top of the manager account)
3. OAuth Client ID
4. OAuth Client secret

They go into Supabase edge function secrets, the same place the AI key
lives. I wire the button the same day. Until Basic access is granted the
button works against a test account only, which is enough to prove it.

## What does not change

The upload file keeps working. Approving copy on the screen is the same
act either way; the token only changes what the last button does.
