import { Hono } from "hono";
import { Layout } from "./layout";
import { serveStatic } from "hono/cloudflare-workers";
// import manifest from '__STATIC_CONTENT_MANIFEST';
import { app as dev } from "./dev"

const app = new Hono<{ Bindings: Env }>();

app.use('/static/*', serveStatic({ root: './' }));
app.use('/styles.css', serveStatic({ path: './styles.css' }));

app.get('/', async (c) => {
	const s = 'SELECT * FROM modules';
	const r = await c.env.DB.prepare(s).all()
	return c.html(
		<Layout>
			<h1 class="text-xl font-bold m-5">Hello Hono</h1>
			<pre class="text-[12px] text-red-500 m-5">{JSON.stringify(r.results, null, 2)}</pre>
		</Layout>
	);
})

app.route('/dev', dev)
export default app;
