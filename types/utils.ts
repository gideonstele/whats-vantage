export type Awaited<T> = T extends Promise<infer U> ? U : T;

export type NoUndefined<T> = T extends undefined ? never : T;

export type Nullable<T> = T | null | undefined;
