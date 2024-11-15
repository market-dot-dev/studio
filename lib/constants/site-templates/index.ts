import SectionCTA from './section-cta';
import SectionHero from './section-hero';
import SectionWork from './section-work';
import SectionTiers from './section-tiers';
import SectionHeader from './section-header';
import SectionExpertise from './section-expertise';

export default [
    SectionHeader,
    SectionHero,
    SectionExpertise,
    SectionWork,
    SectionTiers,
    SectionCTA,
]

export const defaultPageTemplate = 
    SectionHeader.template +
    SectionHero.template +
    SectionExpertise.template +
    SectionWork.template +
    SectionTiers.template +
    SectionCTA.template;
    
export const newPageTemplate =
    SectionHeader.template +
    SectionHero.template +
    SectionExpertise.template +
    SectionWork.template +
    SectionTiers.template +
    SectionCTA.template;
