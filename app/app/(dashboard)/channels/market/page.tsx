import { Flex, Card } from "@tremor/react";
import PageHeading from "@/components/common/page-heading";
import { getCurrentUser } from "@/app/services/UserService";
import { Lock, ArrowRight, Search } from "lucide-react";
import { Button } from "@tremor/react";

export default async function MarketChannel() {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return <div>Not logged in</div>;
  }
  if (!currentUser.marketExpertId) {
    // User is an expert but not connected to Market.dev so let's autoconnect them
    return <div>Not connected to Market.dev</div>;
  }

  const hasListings = false;

  return (
    <Flex flexDirection="col" alignItems="start" className="w-full gap-6">
      <PageHeading title="Market" />

      {!hasListings ? (
        <div className="from-muted/50 to-muted/30 relative space-y-8 rounded-lg border bg-gradient-to-b p-8">
          {/* Background Pattern */}
          <div
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M54.627 0l.83.828-1.415 1.415L51.8 0h2.827zM5.373 0l-.83.828L5.96 2.243 8.2 0H5.374zM48.97 0l3.657 3.657-1.414 1.414L46.143 0h2.828zM11.03 0L7.372 3.657 8.787 5.07 13.857 0H11.03zm32.284 0L49.8 6.485 48.384 7.9l-7.9-7.9h2.83zM16.686 0L10.2 6.485 11.616 7.9l7.9-7.9h-2.83zM22.343 0L13.857 8.485 15.272 9.9l7.9-7.9h-.83zm5.657 0L19.514 8.485 20.93 9.9l8.485-8.485h-.485zM3.715 0L0 3.715l1.414 1.414L8.485 0H3.715zm10.285 0L6.485 7.515l1.414 1.414L15.485 0H14zM38.657 0l-8.485 8.485 1.415 1.415 7.9-7.9h-.83zm5.657 0l-7.515 7.515 1.414 1.414L45.8 0h-1.486zm5.657 0l-6.485 6.485 1.414 1.414L54.627 0h-4.686zM32.343 0L26.514 5.828 27.93 7.242 34.97 0h-2.627zM44.143 0L38.314 5.828 39.73 7.242 46.77 0h-2.627zM27.343 0L21.514 5.828 22.93 7.242 29.97 0h-2.627zM39.143 0L33.314 5.828 34.73 7.242 41.77 0h-2.627zm-16.057 0L17.514 5.828 18.93 7.242 25.97 0h-2.884zm5.657 0L23.172 5.828 24.586 7.242 31.627 0h-2.884zM60 0L49.515 10.485l1.414 1.414L60 2.827V0zM0 0l10.485 10.485-1.414 1.414L0 2.827V0z' fill='%23000000' fill-opacity='0.35' fill-rule='evenodd'/%3E%3C/svg%3E")`,
            }}
          />

          <div className="relative space-y-4">
            <h2 className="text-4xl font-bold tracking-tight">
              Get listed on market.dev
            </h2>
            <p className="text-muted-foreground max-w-2xl text-xl">
              Join a marketplace of services & resources from top open source
              developers in any ecosystem.
            </p>
          </div>

          {/* Market.dev Preview Card */}
          <Card className="bg-background/95 relative overflow-hidden border backdrop-blur">
            <div className="space-y-6 p-6">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="bg-primary/10 h-8 w-8 rounded-full" />
                  <span className="font-semibold">market.dev</span>
                </div>
                <Button size="sm">Start Selling</Button>
              </div>

              {/* Search Bar */}
              <div className="relative">
                <Search className="text-muted-foreground absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
                <div className="bg-muted/30 text-muted-foreground w-full rounded-md border px-10 py-2 text-sm">
                  Search ecosystems and projects...
                </div>
              </div>

              {/* Stats */}
              <div className="space-y-2">
                <h3 className="text-2xl font-bold">
                  Find and hire experts in open source.
                </h3>
                <p className="text-muted-foreground">
                  Over 340,000 of the best experts in 323+ developer ecosystems.
                </p>
              </div>

              {/* Technology Grid */}
              <div className="grid grid-cols-6 gap-4">
                {[
                  "JavaScript",
                  "Python",
                  "React",
                  "CSS",
                  "Node.js",
                  "Java",
                ].map((tech, i) => (
                  <Card
                    key={tech}
                    className="flex flex-col items-center gap-2 p-4 text-center"
                  >
                    <div className="bg-primary/10 h-12 w-12 rounded-lg" />
                    <span className="text-xs font-medium">{tech}</span>
                  </Card>
                ))}
              </div>

              {/* Expert Profiles */}
              <div className="space-y-4">
                <h4 className="font-semibold">JavaScript Experts</h4>
                <div className="grid grid-cols-4 gap-4">
                  {[1, 2, 3, 4].map((profile) => (
                    <Card key={profile} className="space-y-3 p-4">
                      <div className="bg-primary/10 aspect-square rounded-lg" />
                      <div className="space-y-1">
                        <div className="bg-muted h-4 w-2/3 rounded" />
                        <div className="bg-muted h-3 w-1/2 rounded" />
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          <div className="relative flex flex-col gap-4 sm:flex-row">
            <Button size="lg" className="gap-2 font-medium">
              Connect Market Account <ArrowRight className="h-4 w-4" />
            </Button>
            <Button size="lg" variant="light">
              Learn More About Market
            </Button>
          </div>
        </div>
      ) : (
        <Card className="bg-muted/40 relative overflow-hidden border">
          <div className="bg-background/80 absolute inset-0 z-10 flex items-center justify-center backdrop-blur-sm">
            <div className="text-muted-foreground flex flex-col items-center gap-2">
              <Lock className="h-8 w-8" />
              <p className="text-sm font-medium">Preview Only</p>
            </div>
          </div>
          <iframe
            src={"https://google.com"}
            className="pointer-events-none h-[600px] w-full"
            title="Market Preview"
            aria-label="Preview of your Market page"
          />
        </Card>
      )}
    </Flex>
  );
}
