# Sequence Diagrams (Text UML)

## Apply and Post Flow
```
Participant->WebApp: Login
WebApp->API: GET /campaigns/:id
Participant->WebApp: Apply
WebApp->API: POST /campaigns/:id/applications
API->DB: create Application(submitted)
Admin->WebApp: Approve
WebApp->API: POST /applications/:id/approve
API->DB: create Participation(approved), create TrackingLink
API->Email: notify participant
Participant->Platform: Publish content
Participant->WebApp: Submit URL
WebApp->API: POST /participants/:id/submissions
API->DB: ContentSubmission(pending)
Worker->SocialAPI: fetch metrics
SocialAPI->Worker: returns view counts
Worker->DB: MetricSnapshot, EarningAccrual(pending)
Worker->API: notify via WebSocket
After Hold Period
Worker->DB: Accruals locked
Brand->API: Approves payout batch
API->Stripe: Create transfers
Stripe->Webhook: payout.succeeded
Webhook->DB: mark paid
```

## Click Tracking
```
User->Link: https://rwd.link/{tracking_id}
Link->API: record click (UA, IP, referrer)
API->Redirect: campaign url
Worker->Risk: score click
```
