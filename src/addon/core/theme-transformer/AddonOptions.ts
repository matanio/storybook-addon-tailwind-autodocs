import {
    CustomSectionInput,
    NormalizedSection,
    TailwindConfigSections,
    TailwindSectionInput,
} from '../../types';
import { VALID_SECTIONS } from '../../constants';

export class AddonOptions {
    private readonly defaultPath: string;
    public sections: NormalizedSection[];
    public forceSingleDoc?: NormalizedSection;

    constructor(
        defaultPath: string = 'Tailwind Theme/',
        sections: TailwindSectionInput[] = VALID_SECTIONS,
        forceSingleDoc?: CustomSectionInput
    ) {
        this.validateDefaultPath(defaultPath);
        this.validateSections(sections);
        this.validateSingleSectionOverride(forceSingleDoc);
        this.defaultPath = defaultPath;
        this.sections = this.normalizeSections(sections);
        if (forceSingleDoc === undefined) return;
        this.forceSingleDoc = this.normalizeSection(forceSingleDoc);
    }

    private validateDefaultPath(defaultPath: string) {
        if (typeof defaultPath !== 'string' || !defaultPath.trim()) {
            throw new Error('defaultPath must be a non-empty string');
        }
    }

    private validateSections(sections: TailwindSectionInput[]) {
        if (!Array.isArray(sections)) {
            throw new Error('sections must be an array');
        }
        for (const section of sections) {
            if (this.isValidSectionName(section)) {
                continue;
            }
            if (this.isValidSectionObject(section)) {
                continue;
            }
            throw new Error(
                'Invalid section: must be a valid tailwind section string or name and optional path'
            );
        }
    }

    private isValidSectionName(name: any): name is TailwindConfigSections {
        return (
            typeof name === 'string' &&
            VALID_SECTIONS.includes(name as TailwindConfigSections)
        );
    }

    private isValidSectionObject(
        section: any
    ): section is TailwindSectionInput {
        return (
            typeof section === 'object' &&
            section !== null &&
            this.isValidSectionName(section.name) &&
            (section.path === undefined ||
                (typeof section.path === 'string' && section.path.trim()))
        );
    }

    private normalizeSection(section: TailwindSectionInput): NormalizedSection {
        const name = typeof section === 'string' ? section : section.name;
        let path =
            typeof section === 'string'
                ? this.defaultPath
                : (section.path ?? this.defaultPath);
        if (path.endsWith('/')) {
            if (path === '/') {
                path = name;
            } else {
                path = `${path}${name}`;
            }
        }
        return { name, path };
    }

    private normalizeSections(
        sections: TailwindSectionInput[]
    ): NormalizedSection[] {
        return sections.map(section => {
            return this.normalizeSection(section);
        });
    }

    private validateSingleSectionOverride(
        singleSectionOverride?: CustomSectionInput
    ) {
        if (singleSectionOverride === undefined) return;
        if (
            typeof singleSectionOverride === 'string' &&
            singleSectionOverride.trim()
        )
            return;
        if (
            typeof singleSectionOverride === 'object' &&
            singleSectionOverride !== null &&
            (singleSectionOverride.path === undefined ||
                (typeof singleSectionOverride.path === 'string' &&
                    singleSectionOverride.path.trim()))
        )
            return;
        throw new Error(
            'Invalid single doc: must be a valid string or name and optional path'
        );
    }
}
