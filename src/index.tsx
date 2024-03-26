import { Hono } from "hono";
import { Layout } from "./layout";
import { serveStatic } from "hono/cloudflare-workers";
// import manifest from '__STATIC_CONTENT_MANIFEST';
import { app as dev } from "./dev"
import { app as htmx } from "./htmx";
import { ACSelectModule, BatchForm, BatchHero, BatchMenu, DaftarPeserta, FormSettingsDateTitle, FormSettingsModules, Main, Mainmenu, PRE, SettingsDateTitle, SettingsInfo, SettingsModules, UploadPersonsCSV } from "./components";
import { html } from "hono/html";
import { randomNames, randomNamesAndUsernames } from "./names";
import { getBatchModulesData } from "./utils";

const app = new Hono<{ Bindings: Env }>();

app.use('/static/*', serveStatic({ root: './' }));
app.use('/styles.css', serveStatic({ path: './styles.css' }));

app.get('/', async (c) => {
	const s = 'SELECT * FROM modules';
	const r = await c.env.DB.prepare(s).all()
	return c.html(
		<Layout>
			<h1 class="text-xl font-bold m-5">Hello Hono</h1>
			<PRE obj={r.results} />
		</Layout>
	);
})

const newBatchToken = (tokens: string[]) => {
	let token = tokens[0];
	while (tokens.includes(token)) {
		token = '012345678901234567890123456789'
			.split('')
			.sort(() => Math.random() - 0.5)
			.join('')
			.substring(0, 6);
	}
	return token;
}

app.get('/token', async (c) => {
	const tokens: string[] = [
		'949580', '495027', '472599', '807056', '102463', '985291', '042701', '910534', '233677', '012480', '359912', '401527', '153149', '089031', '769115', '535017', '467319', '136527', '089354', '194406', '610677', '162075', '116392', '086601', '598140', '065190', '822910', '721370', '613107', '542465', '817335', '340791', '034371', '098846', '672381', '870133', '372057', '418029', '960285', '475033', '141272', '010265', '068176', '060118', '429761', '403132', '958247', '746512', '800142', '746971', '227463', '993606', '164318', '042509', '861360', '671929', '320659', '962351', '408206', '706489', '170958', '062954', '496514', '720062', '709831', '264103', '173762', '536748', '501399', '467323', '474171', '037058', '658109', '904816', '213869', '450504', '567323', '676954', '672681', '729089', '468354', '158169', '664946', '773916', '853802', '242998', '377061', '162873', '204819', '560213', '468806', '508562', '748007', '320866', '381025', '672642', '432470', '393742', '020965', '011450'
	];
	const t = newBatchToken(tokens);

	return c.text(t + "\n" + tokens.join(' '));
})

app.post('/orgs', async (c) => {
	const { org_id, date, type, title } = await c.req.parseBody();
	const stm0 = 'SELECT max(id) + 1 as next_id FROM batches';
	const stm1 = 'SELECT token FROM batches';
	const db = c.env.DB;
	const rs = await db.batch([ db.prepare(stm0), db.prepare(stm1) ]);
	const next_id = (rs[0].results[0] as any).next_id || 0;
	const tokens = rs[1].results.map((v: any) => v.token);
	const new_token = newBatchToken(tokens);

	const stm2 = 'INSERT INTO batches (id, token, org_id, type, title, date) VALUES (?,?,?,?,?,?)';
	await db.prepare(stm2).bind(next_id, new_token, org_id, type, title, date).run();
	return c.redirect(`/batches/${next_id}`);
})

app.get('/orgs', async (c) => {
	const stm = 'SELECT * FROM organizations';
	const rs = await c.env.DB.prepare(stm).all();
	const orgs = rs.results;
	return c.html(
		<Layout title="Daftar Organisasi">
			<Mainmenu />
			<Main>
				<div class="flex items-center gap-4 my-8">
					<h1 class="flex-grow text-2xl font-semibold tracking-tight">Daftar Organisasi</h1>
				</div>
				<table class="w-full border-t border-stone-400">
					<tbody>
						{orgs.map((o: any, i: number) => (
							<tr class="border-b border-stone-300">
								<td class="pr-2 py-3">{i + 1}</td>
								<td class="pr-2 py-3">
									<a href={`/orgs/${o.id}`}>{o.name}</a>
								</td>
								<td class="pr-2 py-3">5</td>
								<td class="py-3 ">63</td>
							</tr>
						))}
					</tbody>
				</table>
				<div class="flex gap-3 bg-gray-100 my-12 p-4">
					<input type="text" class="input flex-grow" />
					<button class="button">Button</button>
					<button class="button-hollow bg-white">Cancel</button>
				</div>
			</Main>
		</Layout>
	);
})

app.get('/orgs/:id', async (c) => {
	const id = c.req.param('id');
	const stm0 = 'SELECT * FROM organizations WHERE id=?';
	const stm1 = 'SELECT * FROM batches WHERE org_id=?';
	const db = c.env.DB;
	const rs = await db.batch([
		db.prepare(stm0).bind(id),
		db.prepare(stm1).bind(id),
	])
	const org: any = rs[0].results[0];
	if (org == undefined) return c.notFound();

	const batches = rs[1].results;
	return c.html(
		<Layout>
			<Mainmenu />
			<Main>
				<h1 class="flex-grow text-2xl font-semibold tracking-tight mt-8 mb-12">{org.name}</h1>
				<table class="w-full border-t border-stone-500">
					<tbody>
						{batches.map((b: any) => (
							<tr id={`/batches/${b.id}`} class="batch border-b border-stone-300 cursor-pointer hover:text-sky-500">
								<td class="w-28 pr-2 py-3">{b.date}</td>
								<td class="pr-2 py-3">{b.type}</td>
								<td class="pr-2 py-3">{b.title}</td>
								<td class="pr-2 py-3">23</td>
								<td class="pr-2 py-3">9</td>
							</tr>
						))}
					</tbody>
				</table>
				{html`<script>
					document.querySelectorAll('tr.batch').forEach((tr) => {
						tr.addEventListener('click', () => (document.location.href = tr.id));
					});
				</script>`}
				{/* <PRE>{JSON.stringify(batches, null, 2)}</PRE> */}
				<BatchForm org_id={org.id} />
			</Main>
		</Layout>
	);
})

app.get('/modules', async (c) => {
	const stm = 'SELECT * FROM modules ORDER BY ascent DESC';
	const rs = await c.env.DB.prepare(stm).all();
	const modules = rs.results;
	return c.html(
		<Layout title="Daftar Organisasi">
			<Mainmenu />
			<Main>
				<div class="flex items-center gap-4 my-8">
					<h1 class="flex-grow text-2xl font-semibold tracking-tight">Daftar Modul</h1>
				</div>
				<table class="w-full border-t border-stone-400">
					<tbody>
						{modules.map((m: any, i: number) => (
							<tr class="border-b border-stone-300">
								<td class="pr-2 py-3">{i + 1}</td>
								<td class="py-3 ">{m.title}</td>
								<td class="text-sm text-stone-400 font-mono pr-2 py-3">{m.id}</td>
								<td class="pr-2 py-3">{m.category}</td>
								<td class="pr-2 py-3">{m.ascent ? '✅' : '-'}</td>
							</tr>
						))}
					</tbody>
				</table>
			</Main>
		</Layout>
	);
});

app.get('/assessors', async (c) => {
	const stm = 'SELECT * FROM assessors';
	const rs = await c.env.DB.prepare(stm).all();
	const assessors = rs.results;
	return c.html(
		<Layout title="Daftar Organisasi">
			<Mainmenu />
			<Main>
				<div class="flex items-center gap-4 my-8">
					<h1 class="flex-grow text-2xl font-semibold tracking-tight">Daftar Asesor</h1>
				</div>
				<table class="w-full border-t border-stone-400">
					<tbody>
						{assessors.map((m: any, i: number) => (
							<tr class="border-b border-stone-300">
								<td class="pr-2 py-3">{i + 1}</td>
								<td class="py-3 ">{m.fullname}</td>
								<td class="pr-2 py-3">{m.email}</td>
							</tr>
						))}
					</tbody>
				</table>
			</Main>
		</Layout>
	);
});

app.get('/batches', async (c) => {
	const stm = 'SELECT * FROM batches ORDER BY date DESC';
	const rs = await c.env.DB.prepare(stm).all();
	const batches = rs.results as Batch[];
	return c.html(
		<Layout>
			<Mainmenu />
			<Main>
				<div class="flex items-center gap-4 my-8">
					<h1 class="flex-grow text-2xl font-semibold tracking-tight">Daftar Batch</h1>
				</div>
				{/* <PRE obj={batches} /> */}
				<table class="w-full border-t border-stone-500">
					<tbody>
						{batches.map((b: Batch, i: number) => (
							<tr id={`/batches/${b.id}`} class="batch border-b border-stone-300 cursor-pointer hover:text-sky-500">
								<td class="w-8 pr-2 py-3">{i + 1}</td>
								<td class="pr-2 py-3">{b.date}</td>
								<td class="pr-2 py-3">{b.type}</td>
							</tr>
						))}
					</tbody>
				</table>
				{html`<script>
					document.querySelectorAll('tr.batch').forEach((tr) => {
						tr.addEventListener('click', () => document.location.href = tr.id);
					});
				</script>`}
			</Main>
		</Layout>
	);
});

app.post('/batches/:batch_id', async (c) => {
	const body = await c.req.parseBody();
	const id = parseInt(body.id as string);
	const date = body.date as string;
	const title = body.title as string;
	const mod_self = body.self ? body.self : null;
	const mod_case = body.case ? body.case : null;
	const mod_face = body.face ? body.face : null;
	const mod_disc = body.disc ? body.disc : null;
	const stm0 = 'DELETE FROM batch_modules WHERE batch_id=?';
	const stm1 = 'INSERT INTO batch_modules (batch_id, module_id, type) VALUES '
	const values = [['SELF', mod_self], ['CASE', mod_case], ['FACE', mod_face], ['DISC', mod_disc]]
		.filter(([a, b]) => b !== null)
		.map(([a, b]) => `(${id}, '${b}', '${a}')`)
		.join(', ');
	await c.env.DB.batch([
		c.env.DB.prepare(stm0).bind(id),
		c.env.DB.prepare(stm1 + values)
	])
	return c.redirect(`/batches/${id}`)
})

app.get('/batches/:batch_id', async (c) => {
	const batch_id = c.req.param('batch_id');
	const stm0 = 'SELECT * FROM v_batches WHERE id=?';
	const found = await c.env.DB.prepare(stm0).bind(batch_id).first();
	if (!found) return c.notFound();
	const batch = found as VBatch;
	const { modules, selections } = await getBatchModulesData(c.env.DB, batch_id, batch.type == 'CUSTOM');
	return c.html(
		<Layout>
			<Mainmenu />
			<Main>
				<BatchHero batch={batch} />
				<BatchMenu batch_id={batch.id} path="/settings" />
				<SettingsInfo batch={batch} />
				<SettingsDateTitle batch={batch} />
				{selections.length > 0 && <SettingsModules batch={batch} modules={modules} selections={selections} />}
				{selections.length == 0 && <FormSettingsModules batch={batch} modules={modules} selections={selections} />}
			</Main>
		</Layout>
	);
});

app.post('/batches/:batch_id/persons', async (c) => {
	const { batch_id, org_id, num } = await c.req.parseBody();
	const names = randomNamesAndUsernames(parseInt(num as string)).map(
		(n, i) => `('${batch_id}-${String(i + 1).padStart(4, '0')}', ${org_id}, ${batch_id}, '${n.name}', '${n.username}')`
	);
	const stm0 = 'DELETE FROM persons WHERE batch_id=?'
	const stm1 = `INSERT INTO persons (id, org_id, batch_id, fullname, username) VALUES ${names.join(', ')}`;
	await c.env.DB.batch([
		c.env.DB.prepare(stm0).bind(batch_id),
		c.env.DB.prepare(stm1),
	])
	return c.redirect(`/batches/${batch_id}/persons`)
});

app.get('/batches/:batch_id/persons', async (c) => {
	const batch_id = c.req.param('batch_id');
	const stm0 = 'SELECT * FROM v_batches WHERE id=?';
	const stm1 = 'SELECT * FROM persons WHERE batch_id=?';
	const db = c.env.DB;
	const rs = await db.batch([
		db.prepare(stm0).bind(batch_id),
		db.prepare(stm1).bind(batch_id),
	])
	if (rs[0].results[0] == undefined) return c.notFound();
	const batch = rs[0].results[0] as VBatch;
	const persons = rs[1].results;
	return c.html(
		<Layout>
			<Mainmenu />
			<Main>
				<BatchHero batch={batch} />
				<BatchMenu batch_id={batch.id} path="/persons" />
				<div id="daftar-peserta">
					{persons.length > 0 && <DaftarPeserta persons={persons} />}
					{persons.length == 0 && <UploadPersonsCSV batch={batch} />}
				</div>
			</Main>
		</Layout>
	);
})

app.get('/batches/:batch_id/assessors', async (c) => {
	const batch_id = c.req.param('batch_id');
	const stm0 = 'SELECT * FROM v_batches WHERE id=?';
	const batch: VBatch | null = await c.env.DB.prepare(stm0).bind(batch_id).first();
	if (!batch) return c.notFound();
	return c.html(
		<Layout>
			<Mainmenu />
			<Main>
				<BatchHero batch={batch} />
				<BatchMenu batch_id={batch.id} path="/assessors" />
			</Main>
		</Layout>
	);
});

app.get('/batches/:batch_id/deployment', async (c) => {
	const batch_id = c.req.param('batch_id');
	const stm0 = 'SELECT * FROM v_batches WHERE id=?';
	const batch: VBatch | null = await c.env.DB.prepare(stm0).bind(batch_id).first();
	if (!batch) return c.notFound();
	return c.html(
		<Layout>
			<Mainmenu />
			<Main>
				<BatchHero batch={batch} />
				<BatchMenu batch_id={batch.id} path="/deployment" />
			</Main>
		</Layout>
	);
});

app.route('/dev', dev);
app.route('/htmx', htmx);
export default app;
