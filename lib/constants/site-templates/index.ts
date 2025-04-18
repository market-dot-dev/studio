import SectionCTA from "./section-cta";
import SectionExpertise from "./section-expertise";
import SectionFooter from "./section-footer";
import SectionHeader from "./section-header";
import SectionHero from "./section-hero";
import SectionTiers from "./section-tiers";
import SectionWork from "./section-work";

// @TODO: Site-template doesn't allow replacing the anchor with a <Button />, it needs to to avoid these hardcoded styles.
export default [
  SectionHeader,
  SectionHero,
  SectionExpertise,
  SectionWork,
  SectionTiers,
  SectionCTA,
  SectionFooter
];

export const defaultPageTemplate =
  SectionHeader.template +
  SectionHero.template +
  SectionExpertise.template +
  SectionWork.template +
  SectionTiers.template +
  SectionCTA.template +
  SectionFooter.template;

export const newPageTemplate =
  SectionHeader.template + SectionHero.template + SectionCTA.template + SectionFooter.template;
