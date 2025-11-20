# User Flows

## Actors
- Visitor (anonymous)
- Participant (registered user)
- Brand/Creator (campaign owner)
- Admin/Reviewer

## Key Flows (Happy Paths)
1. Brand publishes campaign
   - Brand logs in → Creates campaign draft → Adds budget, CPM, start/end, brief → Submits for review → Admin approves → Brand publishes → Campaign visible
2. Participant applies and earns
   - User logs in → Completes profile + links socials → Browses campaigns → Applies → Approved → Receives tracking link → Posts content → Submits URL → System ingests metrics → Earnings accrue → Hold period → Locked → Payout
3. Payout to participant
   - User completes KYC in Stripe → Balance reaches threshold → Payout request → Batch approved → Stripe transfer → Status updated

## Edge/Exception Flows
- Application rejected: notify with reason
- Content rejected: resubmission with feedback; rate limits
- Metrics anomaly: auto-pause participant; manual review
- Budget exhausted: campaign auto-pauses
- Chargeback/clawback: negative accrual applied; notify user

## Onboarding
- Participant: email/OAuth → username → link socials → accept terms → optional 2FA
- Brand: email/OAuth → org name → billing method → verification → team members

## Navigation Map (MVP)
- Public: Home, Campaigns, Campaign Detail, Help/FAQ
- Participant: Dashboard, Earnings, Applications, Submissions, Settings
- Brand: Dashboard, Campaigns, Create/Edit Campaign, Applications, Participants, Payouts
- Admin: Queues, Campaigns, Users, Ledger, Payouts, Settings
