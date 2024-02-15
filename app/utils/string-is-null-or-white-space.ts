export function stringIsNullOrWhiteSpace(str: string | null): boolean {
	return str === null || str.match(/^ *$/) !== null;
}
