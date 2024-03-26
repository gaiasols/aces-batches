import { Hono } from 'hono';
import { Layout } from './layout';
import { html } from 'hono/html';
import { FormSettingsDateTitle, FormSettingsModules, SettingsDateTitle, SettingsModules } from './components';
import { getBatchModulesData } from './utils';

const app = new Hono<{ Bindings: Env }>();

/******** Root: /htmx ********/

app.post('/batches/:batch_id/date-title', async (c) => {
	const batch_id = c.req.param('batch_id');
	const body = await c.req.parseBody();
	const date = body.date as string;
	const title = body.title as string;
	const stm0 = 'SELECT * FROM v_batches WHERE id=?';
	const stm1 = 'UPDATE batches SET date=?, title=? WHERE id=?';
	const db = c.env.DB;
	const rs = await db.batch([
		db.prepare(stm1).bind(date, title, batch_id),
		db.prepare(stm0).bind(batch_id),
	])
	const batch = rs[1].results[0] as VBatch;
	return c.html(<SettingsDateTitle batch={batch as VBatch} />);
});

app.get('/batches/:batch_id/date-title', async (c) => {
	const batch_id = c.req.param('batch_id');
	const stm0 = 'SELECT * FROM v_batches WHERE id=?';
	const batch = await c.env.DB.prepare(stm0).bind(batch_id).first();
	if (!batch) {
		c.status(404);
		return c.body('');
	}
	return c.html(<SettingsDateTitle batch={batch as VBatch} />);
})

app.get('/batches/:batch_id/form-date-title', async (c) => {
	const batch_id = c.req.param('batch_id');
	const stm0 = 'SELECT * FROM v_batches WHERE id=?';
	const batch = await c.env.DB.prepare(stm0).bind(batch_id).first();
	if (!batch) {
		c.status(404);
		return c.body('');
	}
	return c.html(<FormSettingsDateTitle batch={batch as VBatch} />);
});

/******* ******/

app.post('/batches/:batch_id/modules', async (c) => {
	const batch_id = c.req.param('batch_id');
	const body = await c.req.parseBody();
	console.log('body', body);
	const type = body.batch_type as string;
	const values: any[] = [];
	if (type == 'ASCENT') {
		if (body.self) values.push({ id: body.self, type: 'SELF', priority: null });
		if (body.case) values.push({ id: body.case, type: 'CASE', priority: null });
		if (body.face) values.push({ id: body.face, type: 'FACE', priority: null });
		if (body.disc) values.push({ id: body.disc, type: 'DISC', priority: null });
	} else {
		const selected = body['module[]'];
		const ids = typeof selected == 'object' ? [...(selected as string[])] : [selected];
		ids.forEach((v) => {
			if (v.length) {
				// SELF:CRATE-01
				// values.push({ id: a[1], type: a[0] });
				const a = v.split(':');
				// 2:SELF:CRATE-01
				values.push({ id: a[2], type: a[1], priority: a[0] });
			}
		});
	}
	const _values = values.map((v) => `(${batch_id}, '${v.id}', '${v.type}', ${v.priority})`).join(',');
	const stm0 = 'DELETE FROM batch_modules WHERE batch_id=?';
	const stm1 = 'INSERT INTO batch_modules (batch_id, module_id, category, priority) VALUES ' + _values;
	console.log(stm1);
	const db = c.env.DB;
	await db.batch([
		db.prepare(stm0).bind(batch_id),
		db.prepare(stm1),
	])
	const { batch, modules, selections } = await getBatchModulesData(db, batch_id, type == 'CUSTOM');
	if (!batch) {
		c.status(404);
		return c.body('');
	}
	return c.html(<SettingsModules batch={batch} modules={modules} selections={selections} />);
});

app.get('/batches/:batch_id/modules', async (c) => {
	const batch_id = c.req.param('batch_id');
	const db = c.env.DB;
	const stm0 = 'SELECT * FROM v_batches WHERE id=?';
	const found = await db.prepare(stm0).bind(batch_id).first();
	if (!found) {
		c.status(404);
		return c.body('');
	}
	const batch = found as VBatch;
	const { modules, selections } = await getBatchModulesData(db, batch_id, batch.type == 'CUSTOM');
	return c.html(<SettingsModules batch={batch} modules={modules} selections={selections} />);
});

app.get('/batches/:batch_id/form-modules', async (c) => {
	const batch_id = c.req.param('batch_id');
	const db = c.env.DB;
	const stm0 = 'SELECT * FROM v_batches WHERE id=?';
	const found = await db.prepare(stm0).bind(batch_id).first();
	if (!found) {
		c.status(404);
		return c.body('');
	}
	const batch = found as VBatch;
	const { modules, selections } = await getBatchModulesData(db, batch_id, batch.type == 'CUSTOM');
	return c.html(<FormSettingsModules batch={batch} modules={modules} selections={selections} />);
});

export { app };
