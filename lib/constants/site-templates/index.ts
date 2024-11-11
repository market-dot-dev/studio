import SectionCTA from './section-cta';
import SectionHero from './section-hero';
import SectionWork from './section-work';
import SectionTiers from './section-tiers';
import SectionExpertise from './section-expertise';

export default [
    SectionHero,
    SectionExpertise,
    SectionWork,
    SectionTiers,
    SectionCTA,
]

export const defaultPageTemplate = 
    SectionHero.template +
    SectionExpertise.template +
    SectionWork.template +
    SectionTiers.template +
    SectionCTA.template;

export const newPageTemplate =
    SectionHero.template +
    SectionCTA.template
    
