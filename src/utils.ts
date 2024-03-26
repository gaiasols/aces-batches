export function randomToken() {
	return '012345678901234567890123456789'
		.split('')
		.sort(() => Math.random() - 0.5)
		.join('')
		.substring(0, 6);
}

export function uniqueToken(tokens: string[]) {
	let token = tokens[0];
	while (tokens.includes(token)) {
		token = randomToken();
	}
	return token;
}

export async function getBatchModulesData(db: D1Database, batch_id: number | string, priority = false) {
	const stm0 = 'SELECT * FROM v_batches WHERE id=?';
	const stm1 = priority
		? 'SELECT * FROM batch_modules WHERE batch_id=? ORDER BY priority '
		: 'SELECT * FROM batch_modules WHERE batch_id=?';
	const stm2 = 'SELECT * FROM modules';
	const rs = await db.batch([db.prepare(stm0).bind(batch_id), db.prepare(stm1).bind(batch_id), db.prepare(stm2)]);
	return {
		batch: rs[0].results[0] ? (rs[0].results[0] as VBatch) : null,
		selections: rs[1].results.map((x: any) => x.category + ':' + x.module_id),
		modules: rs[2].results as Module[],
	};
}
