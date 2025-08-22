import Testimonial from "@/components/home/testimonial";
import type { ReactElement } from "react";

export default function Testimonials() {
    const testimonial = {
        quote: (
            <>
                Using market.dev, our maintainer collective set up and {" "}
                <span className="text-marketing-primary">
                    started selling our first commercial se
                    <span className="tracking-[-0.005em]">r</span>vice tiers within a day
                </span>
                . We love working with them.
            </>
        ) as ReactElement,
        quotee: {
            name: "Cameron",
            title: "GM",
            image: {
                src: "/bc-avatar.jpg",
            },
            company: {
                name: "Shipyard",
                url: "https://ipshipyard.market.dev/",
            },
        },
    };

    return <Testimonial {...testimonial} />;
}
