export function getDefault<T>(obj: any, key: string, def: T): T {
    if (key in obj) return obj[key];
    return def;
}
