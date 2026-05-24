# Metrics

## North Star Metric

**Audits completed per week**

Why: An audit completed means a user got real value from the tool. 
It's the moment the product works. Everything downstream 
(email capture, consultation booking, credit purchase) flows from this.
DAU is wrong for a tool people use once a quarter. 
"Audits completed" captures both new users and word-of-mouth return visits.

## 3 Input Metrics

1. **Visitor → Audit start rate**
   Measures landing page effectiveness. If this drops, the headline or form 
   is losing people before they engage.

2. **Audit start → Audit completed rate**
   Measures form friction. If people start but don't finish, 
   the tool selection or detail inputs are too confusing.

3. **Audit completed → Email captured rate**
   Measures value delivery. If people finish the audit but don't 
   give their email, the results aren't compelling enough.

## What I'd Instrument First

- Audit completion event (with savings amount and tools used)
- Email capture event (with shareId)
- Consultation CTA click (only shown for >$500/mo savings)
- Share link copy click (viral loop signal)

Tools: Plausible Analytics (privacy-friendly) for pageviews, 
custom events via a simple `/api/track` endpoint to Supabase.

## Pivot Trigger

If after 500 audits the consultation booking rate is below 2%, 
the lead quality is too low — pivot the CTA to a lower-friction 
action (newsletter signup, Slack community) and rebuild trust 
before pushing the Credex offer.

If email capture rate is below 10%, the audit results aren't 
showing enough value — improve the savings logic and UI before 
scaling distribution.