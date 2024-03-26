import { Hono } from "hono";
import { Layout } from "./layout";
import { serveStatic } from "hono/cloudflare-workers";
// import manifest from '__STATIC_CONTENT_MANIFEST';
import { app as dev } from "./dev"
import { app as htmx } from "./htmx";
import { ACSelectModule, BatchForm, BatchHero, BatchMenu, DaftarPeserta, FormSettingsDateTitle, FormSettingsModules, LoginForm, Main, Mainmenu, PRE, SettingsDateTitle, SettingsInfo, SettingsModules, UploadPersonsCSV } from "./components";
import { html } from "hono/html";
import { randomNames, randomNamesAndUsernames } from "./names";
import { getBatchModulesData, getSessionUser, randomPersonsWithPassword, uniqueToken } from "./utils";
import { decrypt, encrypt } from "./crypto";
import { sealData } from "iron-session";
import { deleteCookie, setCookie } from "hono/cookie";

const app = new Hono<{ Bindings: Env }>();

app.use('/static/*', serveStatic({ root: './' }));
app.use('/styles.css', serveStatic({ path: './styles.css' }));
app.use('*', async (c, next) => {
	const start = Date.now();
	await next();
	const end = Date.now();
	c.res.headers.set('X-Response-Time', `${end - start}`);
});
app.use('*', async (c, next) => {
	const pathname = new URL(c.req.raw.url).pathname;
	const paths = ['/orgs', '/batches', '/modules', '/assessors', '/admin'];
	for (let i=0; i<paths.length; i++) {
		if (pathname.startsWith(paths[i])) {
			if (!(await getSessionUser(c))) return c.redirect('/');
		}
	}
	await next();
});

app.post('/login', async (c) => {
	const body = await c.req.parseBody();
	const username = body.username as string;
	const password = body.password as string;
	const stm = `SELECT * FROM admins WHERE username=?`;
	const found: any = await c.env.DB.prepare(stm).bind(username).first();

	// Not found
	if (!found) return c.html(<LoginForm username={username} password={password} />);

	// Incorrect password
	const decrypted = await decrypt(found.hash);
	if (password != decrypted) return c.html(<LoginForm username={username} password={password} />);

	// Create cookie
	const user: Admin = {
		id: found.id,
		fullname: found.fullname,
		username: found.username,
		email: found.email,
	}
	const sealedData = await sealData(user, { password: c.env.COOKIE_PASSWORD });
	setCookie(c, c.env.COOKIE_NAME, sealedData, { path: '/' });

	c.status(200);
	c.res.headers.append('HX-Trigger', 'login-ok');
	return c.body('');
})

app.post('/logout', async (c) => {
	deleteCookie(c, c.env.COOKIE_NAME, { path: '/' });
	return c.redirect('/');
})

app.get('/', async (c) => {
	if (await getSessionUser(c)) return c.html(
		<Layout>
			<Mainmenu />
			<Main>
				<div class="flex items-center gap-4 my-8">
					<h1 class="flex-grow text-2xl font-semibold tracking-tight">Welkomen</h1>
				</div>
				<form method="post" action="/logout">
					<button class="button">Logout</button>
				</form>
			</Main>
		</Layout>
	);
	return c.html(
		<html>
			<head>
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
				<script
					src="https://unpkg.com/htmx.org@1.9.10"
					integrity="sha384-D1Kt99CQMDuVetoL1lrYwg5t+9QdHe7NLX/SoJYkXDFfX37iInKRy5xLSi8nO7UC"
					crossorigin="anonymous"
				></script>
				<script src="https://unpkg.com/hyperscript.org@0.9.12"></script>
				<link href="/styles.css" rel="stylesheet" />
			</head>
			<body class="antialiased">
				<div class="w-full h-full flex items-center justify-center bg-stone-100 border-8 border-white">
					<div class="flex-grow max-w-lg p-6">
						<div class="rounded-lg bg-white px-8 pt-7 pb-6">
							<div class="flex items-center gap-3 mb-6">
								<div class="w-16">
									<svg viewBox="0 0 420 375">
										<title>Cloudflare Workers logo (horizontal combination mark)</title>
										<defs>
											<linearGradient
												id="CloudflareWorkersLogoCombinationMarkHorizontal--gradient-a"
												x1="50%"
												x2="25.7%"
												y1="100%"
												y2="8.7%"
											>
												<stop offset="0%" stop-color="#eb6f07"></stop>
												<stop offset="100%" stop-color="#fab743"></stop>
											</linearGradient>
											<linearGradient
												id="CloudflareWorkersLogoCombinationMarkHorizontal--gradient-b"
												x1="81%"
												x2="40.5%"
												y1="83.7%"
												y2="29.5%"
											>
												<stop offset="0%" stop-color="#d96504"></stop>
												<stop offset="100%" stop-color="#d96504" stop-opacity="0"></stop>
											</linearGradient>
											<linearGradient
												id="CloudflareWorkersLogoCombinationMarkHorizontal--gradient-c"
												x1="42%"
												x2="84%"
												y1="8.7%"
												y2="79.9%"
											>
												<stop offset="0%" stop-color="#eb6f07"></stop>
												<stop offset="100%" stop-color="#eb720a" stop-opacity="0"></stop>
											</linearGradient>
											<linearGradient
												id="CloudflareWorkersLogoCombinationMarkHorizontal--gradient-d"
												x1="50%"
												x2="25.7%"
												y1="100%"
												y2="8.7%"
											>
												<stop offset="0%" stop-color="#ee6f05"></stop>
												<stop offset="100%" stop-color="#fab743"></stop>
											</linearGradient>
											<linearGradient
												id="CloudflareWorkersLogoCombinationMarkHorizontal--gradient-e"
												x1="-33.2%"
												x2="91.7%"
												y1="100%"
												y2="0%"
											>
												<stop offset="0%" stop-color="#d96504" stop-opacity=".8"></stop>
												<stop offset="49.8%" stop-color="#d96504" stop-opacity=".2"></stop>
												<stop offset="100%" stop-color="#d96504" stop-opacity="0"></stop>
											</linearGradient>
											<linearGradient
												id="CloudflareWorkersLogoCombinationMarkHorizontal--gradient-f"
												x1="50%"
												x2="25.7%"
												y1="100%"
												y2="8.7%"
											>
												<stop offset="0%" stop-color="#ffa95f"></stop>
												<stop offset="100%" stop-color="#ffebc8"></stop>
											</linearGradient>
											<linearGradient
												id="CloudflareWorkersLogoCombinationMarkHorizontal--gradient-g"
												x1="8.1%"
												x2="96.5%"
												y1="1.1%"
												y2="48.8%"
											>
												<stop offset="0%" stop-color="#fff" stop-opacity=".5"></stop>
												<stop offset="100%" stop-color="#fff" stop-opacity=".1"></stop>
											</linearGradient>
											<linearGradient id="CloudflareWorkersLogoCombinationMarkHorizontal--gradient-h" x1="-13.7%" y1="104.2%" y2="46.2%">
												<stop offset="0%" stop-color="#fff" stop-opacity=".5"></stop>
												<stop offset="100%" stop-color="#fff" stop-opacity=".1"></stop>
											</linearGradient>
										</defs>
										<path
											fill="url(#CloudflareWorkersLogoCombinationMarkHorizontal--gradient-a)"
											d="M107 5.4l49 88.4-45 81a26 26 0 0 0 0 25.3l45 81.2-49 88.4A52 52 0 0 1 85 349L7 213.5a52.2 52.2 0 0 1 0-52L85 26a52 52 0 0 1 22-20.6z"
										></path>
										<path
											fill="url(#CloudflareWorkersLogoCombinationMarkHorizontal--gradient-b)"
											d="M111 174.9a26 26 0 0 0 0 25.2l45 81.2-49 88.4A52 52 0 0 1 85 349L7 213.5C.8 202.8 35.5 190 111 175z"
											opacity=".7"
										></path>
										<path
											fill="url(#CloudflareWorkersLogoCombinationMarkHorizontal--gradient-c)"
											d="M112 14.3l44 79.5-7.3 12.7-38.8-65.7C98.7 22.5 81.6 32 60.2 69l3.2-5.5L85 26a52 52 0 0 1 21.8-20.6l5.1 8.9z"
											opacity=".5"
										></path>
										<path
											fill="url(#CloudflareWorkersLogoCombinationMarkHorizontal--gradient-d)"
											d="M331 26l78 135.5c9.3 16 9.3 36 0 52L331 349a52 52 0 0 1-45 26h-78l97-174.9a26 26 0 0 0 0-25.2L208 0h78a52 52 0 0 1 45 26z"
										></path>
										<path
											fill="url(#CloudflareWorkersLogoCombinationMarkHorizontal--gradient-e)"
											d="M282 374.4l-77 .7 93.2-175.8a27 27 0 0 0 0-25.4L205 0h17.6l97.8 173.1a27 27 0 0 1-.1 26.8 15624 15624 0 0 0-62.7 110c-19 33.4-10.8 54.9 24.4 64.5z"
										></path>
										<path
											fill="url(#CloudflareWorkersLogoCombinationMarkHorizontal--gradient-f)"
											d="M130 375c-8 0-16-1.9-23-5.3l96.2-173.5c3-5.4 3-12 0-17.4L107 5.4A52 52 0 0 1 130 0h78l97 174.9a26 26 0 0 1 0 25.2L208 375h-78z"
										></path>
										<path
											fill="url(#CloudflareWorkersLogoCombinationMarkHorizontal--gradient-g)"
											d="M298.2 178.8L199 0h9l97 174.9a26 26 0 0 1 0 25.2L208 375h-9l99.2-178.8c3-5.4 3-12 0-17.4z"
											opacity=".6"
										></path>
										<path
											fill="url(#CloudflareWorkersLogoCombinationMarkHorizontal--gradient-h)"
											d="M203.2 178.8L107 5.4c3-1.6 6.6-2.8 10-3.8 21.2 38.1 52.5 95.9 94 173.3a26 26 0 0 1 0 25.2L115.5 373c-3.4-1-5.2-1.7-8.4-3.2l96-173.5c3-5.4 3-12 0-17.4z"
											opacity=".6"
										></path>
									</svg>
								</div>
								<div class="flex flex-col">
									<p class="text-stone-400 font-bold leading-none">Aces Batch</p>
									<p class="text-3xl font-bold leading-none tracking--wide">Manager</p>
								</div>
							</div>
							<p class="text-xl font-bold mb-5">Lorem ipsum dolor sis amet.</p>
							<LoginForm />
						</div>
					</div>
				</div>
				{html`<script>
					document.body.addEventListener('login-ok', function (evt) {
						document.location = '/orgs';
					});
					const changeEvent = (event) => {
						const msg = document.getElementById('msg');
						if (msg) msg.innerText = '';
					};
				</script>`}
			</body>
		</html>
	);
})

app.get('/whoami', async (c) => {
	const user = await getSessionUser(c);
	if (!user) return c.text('GUEST');
	return c.json(user);
})

app.post('/orgs', async (c) => {
	const { org_id, date, type, title } = await c.req.parseBody();
	const stm0 = 'SELECT max(id) + 1 as next_id FROM batches';
	const stm1 = 'SELECT token FROM batches';
	const db = c.env.DB;
	const rs = await db.batch([ db.prepare(stm0), db.prepare(stm1) ]);
	const next_id = (rs[0].results[0] as any).next_id || 0;
	const tokens = rs[1].results.map((v: any) => v.token);
	const token = uniqueToken(tokens);

	const stm2 = 'INSERT INTO batches (id, token, org_id, type, title, date) VALUES (?,?,?,?,?,?)';
	await db.prepare(stm2).bind(next_id, token, org_id, type, title, date).run();
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
								<td class="pr-2 py-3">xxx</td>
								<td class="py-3 ">xxxxx</td>
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
	// const stm0 = 'SELECT * FROM assessors';
	// const rs = await c.env.DB.prepare(stm0).all();
	// const _assessors = rs.results;
	// const updates:any[] = [];
	// const db = c.env.DB;
	// for (let i=0; i<_assessors.length; i++) {
	// 	const a:any = _assessors[i];
	// 	const hash = await encrypt(a.username);
	// 	const stm = `UPDATE assessors SET hash='${hash}' WHERE username='${a.username}'`;
	// 	updates.push(db.prepare(stm));
	// }
	// await db.batch(updates);
	const stm1 = 'SELECT * FROM assessors';
	const rs1 = await c.env.DB.prepare(stm1).all();
	const assessors = rs1.results;
	return c.html(
		<Layout title="Daftar Organisasi">
			<Mainmenu />
			<Main>
				<div class="flex items-center gap-4 my-8">
					<h1 class="flex-grow text-2xl font-semibold tracking-tight">Daftar Asesor</h1>
				</div>
				{/* <PRE obj={updates} /> */}
				<table class="w-full border-t border-stone-400">
					<tbody>
						{assessors.map((m: any, i: number) => (
							<tr class="border-b border-stone-300">
								<td class="pr-2 py-3">{i + 1}</td>
								<td class="py-3 ">{m.fullname}</td>
								<td class="pr-2 py-3">{m.username}</td>
								<td class="text-sm text-right font-mono pr-2 py-3">{m.hash}</td>
							</tr>
						))}
					</tbody>
				</table>
			</Main>
		</Layout>
	);
});

app.get('/batches', async (c) => {
	const stm = 'SELECT * FROM v_batches ORDER BY date DESC';
	const rs = await c.env.DB.prepare(stm).all();
	const batches = rs.results as VBatch[];
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
						{batches.map((b: VBatch, i: number) => (
							<tr id={`/batches/${b.id}`} class="batch border-b border-stone-300 cursor-pointer hover:text-sky-500">
								<td class="w-8 pr-2 py-3">{i + 1}</td>
								<td class="pr-2 py-3">{b.date}</td>
								<td class="pr-2 py-3">{b.org_name}</td>
								<td class="pr-2 py-3">{b.title}</td>
								<td class="pr-2 py-3">{b.type == 'ASCENT' ? 'AC' : 'CT'}</td>
							</tr>
						))}
					</tbody>
				</table>
				{html`<script>
					document.querySelectorAll('tr.batch').forEach((tr) => {
						tr.addEventListener('click', () => (document.location.href = tr.id));
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
	const names = await randomPersonsWithPassword(parseInt(num as string));
	const persons = names.map(
		(n, i) => `('${batch_id}-${String(i + 1).padStart(4, '0')}', ${org_id}, ${batch_id}, '${n.name}', '${n.username}', '${n.hash}')`
	);
	const stm0 = 'DELETE FROM persons WHERE batch_id=?'
	const stm1 = `INSERT INTO persons (id, org_id, batch_id, fullname, username, hash) VALUES ${persons.join(', ')}`;
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
