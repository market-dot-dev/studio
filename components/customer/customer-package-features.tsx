'use client'
import { useModal } from "@/components/modal/provider";
import { Feature } from "@prisma/client";
import styles from './features.module.css';
import { CheckSquare2 as CheckSquare } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CustomerPackageFeatures({ features, maintainerEmail }: { features: Partial<Feature>[], maintainerEmail: string | null }) {
    const { show, hide } = useModal();

    const isEmail = (uri: string) => uri.includes('@');
    const isPhoneNumber = (uri: string) => /^\+?[1-9]\d{1,14}$/.test(uri);

    const showFeatures = () => {
        
        show(
          <div className="flex flex-col gap-4 rounded-md border bg-white p-6 shadow-2xl">
            {[
              { id: 0, name: "Contact Maintainers", uri: maintainerEmail },
              ...features,
            ].map((feature) =>
              feature.uri ? (
                <div
                  key={feature.id}
                  className={styles.feature_item + " flex flex-col gap-2"}
                >
                  <h2 className="text-xl font-bold">{feature.name}</h2>
                  <div className="flex items-center justify-between gap-4 rounded-sm border p-2 text-sm">
                    {isEmail(feature.uri) ? (
                      <a
                        href={`mailto:${feature.uri}`}
                        className="flex items-center gap-2"
                      >
                        <span>{feature.uri}</span>
                      </a>
                    ) : isPhoneNumber(feature.uri) ? (
                      <a
                        href={`tel:${feature.uri}`}
                        className="flex items-center gap-2"
                      >
                        <span>{feature.uri}</span>
                      </a>
                    ) : (
                      <a
                        href={feature.uri}
                        target="_blank"
                        className="flex items-center gap-2"
                      >
                        <span>{feature.uri}</span>
                      </a>
                    )}
                  </div>
                </div>
              ) : (
                <div className="my-1 flex flex-row" key={feature.id}>
                  <CheckSquare className="min-w-6 text-green-500" /> &nbsp;{" "}
                  {feature.name}
                </div>
              ),
            )}
          </div>,
          hide,
          true, // ignoreFocusTrap
          undefined,
          "w-full md:w-2/3 lg:w-1/2",
        );
    }

    return (
        <Button onClick={showFeatures}>Contact Maintainers</Button>
    );
}
