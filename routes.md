# Next.js Routes Map
# Generated on 2025-03-18T20:17:46.366Z

> Note: Routes marked with "via middleware" are rewritten or redirected by middleware.ts

## Namespace: app

GET     /app/(auth)/customer-login               # app/(auth)/customer-login/page.tsx
GET     /app/(auth)/login                        # app/(auth)/login/page.tsx
GET     /app/(auth)/login/error                  # app/(auth)/login/error/page.tsx
GET     /app/(auth)/login/local-auth             # app/(auth)/login/local-auth/page.tsx
GET     /app/(dashboard)                         # app/(dashboard)/page.tsx
GET     /app/(dashboard)/admin/debug             # app/(dashboard)/admin/debug/page.tsx
GET     /app/(dashboard)/admin/debug/:userId/validation # app/(dashboard)/admin/debug/[userId]/validation/page.tsx
GET     /app/(dashboard)/admin/debug/email       # app/(dashboard)/admin/debug/email/page.tsx
GET     /app/(dashboard)/admin/debug/onboarding  # app/(dashboard)/admin/debug/onboarding/page.tsx
GET     /app/(dashboard)/admin/debug/session     # app/(dashboard)/admin/debug/session/page.tsx
GET     /app/(dashboard)/admin/debug/stripe-debug # app/(dashboard)/admin/debug/stripe-debug/page.tsx
GET     /app/(dashboard)/admin/debug/stripe-migration # app/(dashboard)/admin/debug/stripe-migration/page.tsx
GET     /app/(dashboard)/admin/debug/users       # app/(dashboard)/admin/debug/users/page.tsx
GET     /app/(dashboard)/admin/tiers/:id         # app/(dashboard)/admin/tiers/[id]/page.tsx
GET     /app/(dashboard)/channels/embeds         # app/(dashboard)/channels/embeds/page.tsx
GET     /app/(dashboard)/channels/market         # app/(dashboard)/channels/market/page.tsx
GET     /app/(dashboard)/contracts               # app/(dashboard)/contracts/page.tsx
GET     /app/(dashboard)/contracts/:id           # app/(dashboard)/contracts/[id]/page.tsx
GET     /app/(dashboard)/contracts/create        # app/(dashboard)/contracts/create/page.tsx
GET     /app/(dashboard)/customers               # app/(dashboard)/customers/page.tsx
GET     /app/(dashboard)/customers/:id           # app/(dashboard)/customers/[id]/page.tsx
GET     /app/(dashboard)/features                # app/(dashboard)/features/page.tsx
GET     /app/(dashboard)/features/:id            # app/(dashboard)/features/[id]/page.tsx
GET     /app/(dashboard)/leads                   # app/(dashboard)/leads/page.tsx
GET     /app/(dashboard)/leads/shortlisted       # app/(dashboard)/leads/shortlisted/page.tsx
GET     /app/(dashboard)/maintainer              # app/(dashboard)/maintainer/page.tsx
GET     /app/(dashboard)/maintainer/stripe-connect # app/(dashboard)/maintainer/stripe-connect/page.tsx
GET     /app/(dashboard)/page/:id                # app/(dashboard)/page/[id]/page.tsx
GET     /app/(dashboard)/post/:id                # app/(dashboard)/post/[id]/page.tsx
GET     /app/(dashboard)/post/:id/settings       # app/(dashboard)/post/[id]/settings/page.tsx
GET     /app/(dashboard)/prospects               # app/(dashboard)/prospects/page.tsx
GET     /app/(dashboard)/reports                 # app/(dashboard)/reports/page.tsx
GET     /app/(dashboard)/settings                # app/(dashboard)/settings/page.tsx
GET     /app/(dashboard)/settings/payment        # app/(dashboard)/settings/payment/page.tsx
GET     /app/(dashboard)/settings/project        # app/(dashboard)/settings/project/page.tsx
GET     /app/(dashboard)/settings/repos          # app/(dashboard)/settings/repos/page.tsx
GET     /app/(dashboard)/settings/site           # app/(dashboard)/settings/site/page.tsx
GET     /app/(dashboard)/site/:id                # app/(dashboard)/site/[id]/page.tsx
GET     /app/(dashboard)/site/:id/analytics      # app/(dashboard)/site/[id]/analytics/page.tsx
GET     /app/(dashboard)/subscriptions           # app/(dashboard)/subscriptions/page.tsx
GET     /app/(dashboard)/tiers                   # app/(dashboard)/tiers/page.tsx
GET     /app/(dashboard)/tiers/:id               # app/(dashboard)/tiers/[id]/page.tsx
GET     /app/(dashboard)/tiers/new               # app/(dashboard)/tiers/new/page.tsx
GET     /app/(nonav)/c/contracts/:id             # app/(nonav)/c/contracts/[id]/page.tsx
GET     /app/(payments)/checkout/:id             # app/(payments)/checkout/[id]/page.tsx
GET     /app/(payments)/success                  # app/(payments)/success/page.tsx
GET     /app/c                                   # app/c/page.tsx
GET     /app/c/charges                           # app/c/charges/page.tsx
GET     /app/c/charges/:id                       # app/c/charges/[id]/page.tsx
GET     /app/c/debug                             # app/c/debug/page.tsx
GET     /app/c/settings                          # app/c/settings/page.tsx
GET     /app/c/subscriptions/:id                 # app/c/subscriptions/[id]/page.tsx

## Namespace: home

GET     /home                                    # home/page.tsx
GET     /home/legal/standard-msa                 # home/legal/standard-msa/page.tsx

## Namespace: maintainer-site

GET     /maintainer-site/:domain                 # maintainer-site/[domain]/page.tsx
GET     /maintainer-site/:domain/:slug           # maintainer-site/[domain]/[slug]/page.tsx
GET     /maintainer-site/:domain/(auth)/checkout/:id # maintainer-site/[domain]/(auth)/checkout/[id]/page.tsx
GET     /maintainer-site/:domain/contracts/:id   # maintainer-site/[domain]/contracts/[id]/page.tsx
GET     /maintainer-site/:domain/embed/:embed    # maintainer-site/[domain]/embed/[embed]/page.tsx
GET     /maintainer-site/:domain/success         # maintainer-site/[domain]/success/page.tsx

## Namespace: privacy

GET     /privacy                                 # privacy/page.tsx

## Namespace: terms

GET     /terms                                   # terms/page.tsx

## Namespace: api

POST    /api/:domain/subscription                # api/[domain]/subscription/route.ts
DELETE  /api/:domain/subscription                # api/[domain]/subscription/route.ts
GET     /api/admin/mock-users                    # api/admin/mock-users/route.ts
POST    /api/admin/send-bulk-email               # api/admin/send-bulk-email/route.ts
GET     /api/admin/users                         # api/admin/users/route.ts
GET     /api/auth/:...nextauth                   # api/auth/[...nextauth]/route.ts
POST    /api/auth/:...nextauth                   # api/auth/[...nextauth]/route.ts
POST    /api/auth/githubapp                      # api/auth/githubapp/route.ts
GET     /api/buybutton/:userid                   # api/buybutton/[userid]/route.tsx
GET     /api/domain/:slug/verify                 # api/domain/[slug]/verify/route.ts
POST    /api/generate                            # api/generate/route.ts
POST    /api/market/validate-expert              # api/market/validate-expert/route.ts
GET     /api/migrate                             # api/migrate/route.ts
GET     /api/og/:siteid                          # api/og/[siteid]/route.tsx
GET     /api/preview/nav                         # api/preview/nav/route.ts
GET     /api/preview/subscriptions               # api/preview/subscriptions/route.ts
GET     /api/sentry-example-api                  # api/sentry-example-api/route.js
GET     /api/tiers/:userid                       # api/tiers/[userid]/route.tsx
POST    /api/upload                              # api/upload/route.ts
GET     /api/users/verify                        # api/users/verify/route.ts

