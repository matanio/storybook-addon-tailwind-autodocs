import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// We test the createAddonOptions logic by importing preset internals via the
// deprecation warning behaviour — no Storybook runtime needed.
vi.mock('../../unplugin', () => ({ vite: vi.fn() }));
vi.mock('../../indexers', () => ({ configIndexer: vi.fn(), cssIndexer: vi.fn() }));
vi.mock('../../core/theme-loader', () => ({ ThemeLoaderManager: vi.fn() }));

describe('preset singleDoc deprecation', () => {
    let warnSpy: ReturnType<typeof vi.spyOn>;

    beforeEach(() => {
        warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    });

    afterEach(() => {
        warnSpy.mockRestore();
    });

    it('warns when forceSingleDoc is used without singleDoc', async () => {
        const { experimental_indexers } = await import('../../preset');
        await experimental_indexers([], { forceSingleDoc: 'Theme' } as any);
        expect(warnSpy).toHaveBeenCalledWith(
            expect.stringContaining('`forceSingleDoc` is deprecated')
        );
    });

    it('does not warn when singleDoc is used', async () => {
        const { experimental_indexers } = await import('../../preset');
        await experimental_indexers([], { singleDoc: 'Theme' } as any);
        expect(warnSpy).not.toHaveBeenCalled();
    });

    it('does not warn when neither is used', async () => {
        const { experimental_indexers } = await import('../../preset');
        await experimental_indexers([], {} as any);
        expect(warnSpy).not.toHaveBeenCalled();
    });

    it('singleDoc takes precedence over forceSingleDoc without warning', async () => {
        const { experimental_indexers } = await import('../../preset');
        await experimental_indexers([], { singleDoc: 'Theme', forceSingleDoc: 'Other' } as any);
        expect(warnSpy).not.toHaveBeenCalled();
    });
});
