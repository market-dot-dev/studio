# Next.js Routes Map
# Generated on 2025-03-16T09:36:52.346Z

> Note: Routes marked with "via middleware" are rewritten or redirected by middleware.ts

## Namespace: api

GET     /api/buybutton/:userid                   # api/buybutton/[userid]/route.tsx
GET     /api/og/:siteid                          # api/og/[siteid]/route.tsx
GET     /api/sentry-example-api                  # api/sentry-example-api/route.js
GET     /api/tiers/:userid                       # api/tiers/[userid]/route.tsx

## Namespace: app

GET     /app/(auth)/customer-login               # app/(auth)/customer-login/page.tsx
GET     /app/(auth)/login                        # app/(auth)/login/page.tsx
GET     /app/(auth)/login/error                  # app/(auth)/login/error/page.tsx
GET     /app/(auth)/login/local-auth             # app/(auth)/login/local-auth/page.tsx
GET     /app/(auth)/login/thanks                 # app/(auth)/login/thanks/page.tsx
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

## Namespace: (auth)

GET     /(auth)/checkout/:id                     # maintainer-site/[domain]/(auth)/checkout/[id]/page.tsx (via :domain.market.dev middleware)
GET     /(auth)/customer-login                   # app/(auth)/customer-login/page.tsx (via app.market.dev middleware)
GET     /(auth)/login                            # app/(auth)/login/page.tsx (via app.market.dev middleware)
GET     /(auth)/login/error                      # app/(auth)/login/error/page.tsx (via app.market.dev middleware)
GET     /(auth)/login/local-auth                 # app/(auth)/login/local-auth/page.tsx (via app.market.dev middleware)
GET     /(auth)/login/thanks                     # app/(auth)/login/thanks/page.tsx (via app.market.dev middleware)

## Namespace: (dashboard)

GET     /(dashboard)                             # app/(dashboard)/page.tsx (via app.market.dev middleware)
GET     /(dashboard)/admin/debug                 # app/(dashboard)/admin/debug/page.tsx (via app.market.dev middleware)
GET     /(dashboard)/admin/debug/:userId/validation # app/(dashboard)/admin/debug/[userId]/validation/page.tsx (via app.market.dev middleware)
GET     /(dashboard)/admin/debug/email           # app/(dashboard)/admin/debug/email/page.tsx (via app.market.dev middleware)
GET     /(dashboard)/admin/debug/onboarding      # app/(dashboard)/admin/debug/onboarding/page.tsx (via app.market.dev middleware)
GET     /(dashboard)/admin/debug/session         # app/(dashboard)/admin/debug/session/page.tsx (via app.market.dev middleware)
GET     /(dashboard)/admin/debug/stripe-debug    # app/(dashboard)/admin/debug/stripe-debug/page.tsx (via app.market.dev middleware)
GET     /(dashboard)/admin/debug/stripe-migration # app/(dashboard)/admin/debug/stripe-migration/page.tsx (via app.market.dev middleware)
GET     /(dashboard)/admin/debug/users           # app/(dashboard)/admin/debug/users/page.tsx (via app.market.dev middleware)
GET     /(dashboard)/admin/tiers/:id             # app/(dashboard)/admin/tiers/[id]/page.tsx (via app.market.dev middleware)
GET     /(dashboard)/channels/embeds             # app/(dashboard)/channels/embeds/page.tsx (via app.market.dev middleware)
GET     /(dashboard)/channels/market             # app/(dashboard)/channels/market/page.tsx (via app.market.dev middleware)
GET     /(dashboard)/contracts                   # app/(dashboard)/contracts/page.tsx (via app.market.dev middleware)
GET     /(dashboard)/contracts/:id               # app/(dashboard)/contracts/[id]/page.tsx (via app.market.dev middleware)
GET     /(dashboard)/contracts/create            # app/(dashboard)/contracts/create/page.tsx (via app.market.dev middleware)
GET     /(dashboard)/customers                   # app/(dashboard)/customers/page.tsx (via app.market.dev middleware)
GET     /(dashboard)/customers/:id               # app/(dashboard)/customers/[id]/page.tsx (via app.market.dev middleware)
GET     /(dashboard)/features                    # app/(dashboard)/features/page.tsx (via app.market.dev middleware)
GET     /(dashboard)/features/:id                # app/(dashboard)/features/[id]/page.tsx (via app.market.dev middleware)
GET     /(dashboard)/leads                       # app/(dashboard)/leads/page.tsx (via app.market.dev middleware)
GET     /(dashboard)/leads/shortlisted           # app/(dashboard)/leads/shortlisted/page.tsx (via app.market.dev middleware)
GET     /(dashboard)/maintainer                  # app/(dashboard)/maintainer/page.tsx (via app.market.dev middleware)
GET     /(dashboard)/maintainer/stripe-connect   # app/(dashboard)/maintainer/stripe-connect/page.tsx (via app.market.dev middleware)
GET     /(dashboard)/page/:id                    # app/(dashboard)/page/[id]/page.tsx (via app.market.dev middleware)
GET     /(dashboard)/post/:id                    # app/(dashboard)/post/[id]/page.tsx (via app.market.dev middleware)
GET     /(dashboard)/post/:id/settings           # app/(dashboard)/post/[id]/settings/page.tsx (via app.market.dev middleware)
GET     /(dashboard)/prospects                   # app/(dashboard)/prospects/page.tsx (via app.market.dev middleware)
GET     /(dashboard)/reports                     # app/(dashboard)/reports/page.tsx (via app.market.dev middleware)
GET     /(dashboard)/settings                    # app/(dashboard)/settings/page.tsx (via app.market.dev middleware)
GET     /(dashboard)/settings/payment            # app/(dashboard)/settings/payment/page.tsx (via app.market.dev middleware)
GET     /(dashboard)/settings/project            # app/(dashboard)/settings/project/page.tsx (via app.market.dev middleware)
GET     /(dashboard)/settings/repos              # app/(dashboard)/settings/repos/page.tsx (via app.market.dev middleware)
GET     /(dashboard)/settings/site               # app/(dashboard)/settings/site/page.tsx (via app.market.dev middleware)
GET     /(dashboard)/site/:id                    # app/(dashboard)/site/[id]/page.tsx (via app.market.dev middleware)
GET     /(dashboard)/site/:id/analytics          # app/(dashboard)/site/[id]/analytics/page.tsx (via app.market.dev middleware)
GET     /(dashboard)/subscriptions               # app/(dashboard)/subscriptions/page.tsx (via app.market.dev middleware)
GET     /(dashboard)/tiers                       # app/(dashboard)/tiers/page.tsx (via app.market.dev middleware)
GET     /(dashboard)/tiers/:id                   # app/(dashboard)/tiers/[id]/page.tsx (via app.market.dev middleware)
GET     /(dashboard)/tiers/new                   # app/(dashboard)/tiers/new/page.tsx (via app.market.dev middleware)

## Namespace: (nonav)

GET     /(nonav)/c/contracts/:id                 # app/(nonav)/c/contracts/[id]/page.tsx (via app.market.dev middleware)

## Namespace: (payments)

GET     /(payments)/checkout/:id                 # app/(payments)/checkout/[id]/page.tsx (via app.market.dev middleware)
GET     /(payments)/success                      # app/(payments)/success/page.tsx (via app.market.dev middleware)

## Namespace: c

GET     /c                                       # app/c/page.tsx (via app.market.dev middleware)
GET     /c/charges                               # app/c/charges/page.tsx (via app.market.dev middleware)
GET     /c/charges/:id                           # app/c/charges/[id]/page.tsx (via app.market.dev middleware)
GET     /c/debug                                 # app/c/debug/page.tsx (via app.market.dev middleware)
GET     /c/settings                              # app/c/settings/page.tsx (via app.market.dev middleware)
GET     /c/subscriptions/:id                     # app/c/subscriptions/[id]/page.tsx (via app.market.dev middleware)

## Namespace: charges

GET     /charges                                 # app/c/charges/page.tsx (via app.market.dev for customers)
GET     /charges/:id                             # app/c/charges/[id]/page.tsx (via app.market.dev for customers)

## Namespace: debug

GET     /debug                                   # app/c/debug/page.tsx (via app.market.dev for customers)

## Namespace: root

GET                                              # home/page.tsx (via market.dev middleware)
GET     /                                        # maintainer-site/[domain]/page.tsx (via :domain.market.dev middleware)

## Namespace: settings

GET     /settings                                # app/c/settings/page.tsx (via app.market.dev for customers)

## Namespace: subscriptions

GET     /subscriptions/:id                       # app/c/subscriptions/[id]/page.tsx (via app.market.dev for customers)

## Namespace: legal

GET     /legal/standard-msa                      # home/legal/standard-msa/page.tsx (via market.dev middleware)

## Namespace: :slug

GET     /:slug                                   # maintainer-site/[domain]/[slug]/page.tsx (via :domain.market.dev middleware)

## Namespace: contracts

GET     /contracts/:id                           # maintainer-site/[domain]/contracts/[id]/page.tsx (via :domain.market.dev middleware)

## Namespace: embed

GET     /embed/:embed                            # maintainer-site/[domain]/embed/[embed]/page.tsx (via :domain.market.dev middleware)

## Namespace: success

GET     /success                                 # maintainer-site/[domain]/success/page.tsx (via :domain.market.dev middleware)

