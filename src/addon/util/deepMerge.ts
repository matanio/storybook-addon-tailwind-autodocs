function isPlainObject(item: unknown): item is Record<string, unknown> {
    return Boolean(item) && typeof item === 'object' && !Array.isArray(item);
}

export function deepMerge(
    target: Record<string, unknown>,
    source: Record<string, unknown>
): Record<string, unknown> {
    const output = { ...target };
    if (isPlainObject(target) && isPlainObject(source)) {
        Object.keys(source).forEach(key => {
            if (isPlainObject(source[key])) {
                if (!(key in target)) {
                    output[key] = source[key];
                } else {
                    output[key] = deepMerge(
                        target[key] as Record<string, unknown>,
                        source[key] as Record<string, unknown>
                    );
                }
            } else {
                output[key] = source[key];
            }
        });
    }
    return output;
}
