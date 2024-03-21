import { Hono } from "hono";
import { Layout } from "./layout";
import { serveStatic } from "hono/cloudflare-workers";
// import manifest from '__STATIC_CONTENT_MANIFEST';

const app = new Hono<{ Bindings: Env }>();

app.use('/static/*', serveStatic({ root: './' }));
app.use('/styles.css', serveStatic({ path: './styles.css' }));

app.get('/', async (c) => {
	return c.html(
		<Layout>
			<h1>Hello Hono</h1>
		</Layout>
	);
})

export default app;
