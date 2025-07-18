export function nonNullable<T>(value: T): value is NonNullable<T> {
	return value !== null && value !== undefined;
}

/**
 * Returns `true` if the the input object `obj` has at least one property.
 */
export function nonEmpty(obj: { [K: string]: any }): boolean {
	for (const _key in obj) {
		if (obj[_key] !== undefined) return true; // This is simply most performant ¯\_(ツ)_/¯
	}
	return false;
}

/**
 * Returns `true` if the `val` is: `true`, a number, or a non-empty string, object, or array.
 * Returns `false` otherwise (i.e. `null`, `undefined`, and empty strings, objects, or arrays).
 */
export function isTruthy<T>(val: T): val is NonNullable<T> {
	return (
		nonNullable(val)
		&& Boolean(val)
		&& (typeof val === "object" ? nonEmpty(val) : true)
		&& (Array.isArray(val) ? val.length !== 0 : true)
	);
}
