import SectionCTA from './section-cta';
import SectionImageText from './section-image-text';
import SectionTextImage from './section-text-image';
import SectionHero from './section-hero';
import SectionTiers from './section-tiers';

export default [
    SectionHero,
    SectionTiers,
    SectionCTA,
    SectionImageText,
    SectionTextImage,
]

export const defaultPageTemplate = 
    SectionHero.template +
    SectionTiers.template +
    SectionImageText.template +
    SectionCTA.template;

export const newPageTemplate =
    SectionHero.template +
    SectionCTA.template
    
