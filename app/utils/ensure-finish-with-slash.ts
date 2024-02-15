export function ensureFinishWithSlash(str: string) {
	if (str.endsWith('/')) {
		return str;
	}
	return str + '/';
}
