import { Hono } from 'hono';
import { Layout } from './layout';

const app = new Hono<{ Bindings: Env }>();

// Route: /dev/*

app.get('/', async (c) => {
	return c.html(
		<Layout>
			<div class="max-w-xl">
				<h1 class="text-2xl font-bold mt-5 mb-5">Judul Laman</h1>
				<p class="text-base">text-base</p>
				<p class="text-base">text-base</p>
				<p class="text-base">text-base</p>
				<p class="text-base">text-base</p>
				<p class="text-base">text-base</p>

				<div class="flex flex-col gap-2 text-[15px] my-8">
					<div class="flex items-center gap-2">
						<label class="shrink-0">Komunikasi:</label>
						<input type="text" value="Komunikasi" class="flex-grow input" />
					</div>
					<div class="flex items-center gap-2">
						<label class="shrink-0">Komunikasi:</label>
						<div class="flex items-center gap-3 py-1">
							<label class="flex items-center gap-1">
								<input type="radio" name="JJJ" />
								<span>RADIO</span>
							</label>
							<label class="flex items-center gap-1">
								<input type="radio" name="JJJ" />
								<span>RADIO</span>
							</label>
						</div>
					</div>
					<div class="flex items-center gap-2">
						<label class="shrink-0">Komunikasi:</label>
						<input type="text" value="Komunikasi" class="input" />
					</div>
					<div class="flex items-center gap-2">
						<label class="shrink-0">Komunikasi:</label>
						<select class="select flex-grow">
							<option>Option 1</option>
							<option>Option 2</option>
							<option>Option 3</option>
							<option>Option 4</option>
						</select>
					</div>
					<div class="flex items-center gap-2">
						<label class="shrink-0">Komunikasi:</label>
						<button class="button">Button</button>
						<button disabled class="button">
							Button
						</button>
					</div>
					<div class="flex items-center gap-2">
						<label class="shrink-0">Komunikasi:</label>
						<button class="button-hollow">Button</button>
						<button disabled class="button-hollow">
							Button
						</button>
					</div>
				</div>



				<p class="mb-4">
					<span class="font-bold">default (16px)</span> New Yorkers are facing the winter chill with less warmth this year as the city's
					most revered soup stand unexpectedly shutters, following a series of events that have left the community puzzled.
				</p>
				<p class="text-[15px] mb-4">
					<span class="font-bold">15px</span> New Yorkers are facing the winter chill with less warmth this year as the city's most revered
					soup stand unexpectedly shutters, following a series of events that have left the community puzzled.
				</p>
				<p class="text-md mb-4">
					<span class="font-bold">md (14px)</span> New Yorkers are facing the winter chill with less warmth this year as the city's most
					revered soup stand unexpectedly shutters, following a series of events that have left the community puzzled.
				</p>
				<p class="text-sm mb-4">
					<span class="font-bold">sm (14px)</span> New Yorkers are facing the winter chill with less warmth this year as the city's most
					revered soup stand unexpectedly shutters, following a series of events that have left the community puzzled.
				</p>
				<h2 class="text-xl">H2 text-xl font default</h2>
				<h2 class="text-xl font-medium">H2 text-xl font-medium</h2>
				<h2 class="text-xl font-semibold">H2 text-xl font-semibold</h2>
				<h2 class="text-xl font-bold mb-5">H2 text-xl font-bold</h2>

				<h3 class="text-lg font-bold mb-5">H3 text-lg font-bold</h3>
			</div>
			<div class="h-64"></div>
		</Layout>
	);
});

export { app };
