import { html } from "hono/html";

export const LockSVG = () => (
	<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4">
		<path
			fill-rule="evenodd"
			d="M10 1a4.5 4.5 0 0 0-4.5 4.5V9H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2h-.5V5.5A4.5 4.5 0 0 0 10 1Zm3 8V5.5a3 3 0 1 0-6 0V9h6Z"
			clip-rule="evenodd"
		/>
	</svg>
);

export const ButtonLock = (props: { id?: string }) => (
	<button id={props.id} class="flex items-center justify-center w-5 h-5 text-stone-300 hover:text-stone-500 active:text-stone-700">
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4">
			<path
				fill-rule="evenodd"
				d="M10 1a4.5 4.5 0 0 0-4.5 4.5V9H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2h-.5V5.5A4.5 4.5 0 0 0 10 1Zm3 8V5.5a3 3 0 1 0-6 0V9h6Z"
				clip-rule="evenodd"
			/>
		</svg>
	</button>
);

export const ButtonOpen = (props: { id?: string }) => (
	<button id={props.id} class="flex items-center justify-center w-5 h-5 rounded-sm border border-stone-300 hover:border-stone-500 text-stone-300 hover:text-stone-500">
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4">
			<path
				fillRule="evenodd"
				d="M14.5 1A4.5 4.5 0 0 0 10 5.5V9H3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2h-1.5V5.5a3 3 0 1 1 6 0v2.75a.75.75 0 0 0 1.5 0V5.5A4.5 4.5 0 0 0 14.5 1Z"
				clipRule="evenodd"
			/>
		</svg>
	</button>
);

export const Mainmenu = () => (
	<div class="bg-stone-50 border-b border-stone-400/50 py-4 -mx-4 sm:-mx-5 px-4 sm:px-5">
		<div class="max-w-2xl mx-auto flex gap-4 text-sm text-stone-600 font-medium uppercase">
			<a href="/">Home</a>
			<a href="/orgs">Orgs</a>
			<a href="/batches">Batches</a>
			<a href="/modules">Modules</a>
			<a href="/assessors">Assessors</a>
		</div>
	</div>
);

export const BatchMenu = (props: { batch_id: number, path: string }) => {
	const { batch_id, path } = props;
	const menu = [
		{ path: '/settings', label: 'Settings' },
		{ path: '/persons', label: 'Persons' },
		{ path: '/assessors', label: 'Assessors' },
		{ path: '/deployment', label: 'Deployment' },
	];
	return (
		<div class="border-b border-stone-300 my-8">
			<div class="flex gap-5 text-[14px] text-gray-600 font-medium -mb-[2px]">
				{menu.map((m) => {
					const href = m.path == '/settings' ? `/batches/${batch_id}` : `/batches/${batch_id}${m.path}`;
					if (path == m.path) return <a class="border-b-2 border-sky-500 text-sky-500 pb-1" href={href}>{m.label}</a>
					return <a class="border-b-2 border-transparent hover:border-gray-500 hover:text-stone-700 pb-1" href={href}>{m.label}</a>
				})}
			</div>
		</div>
	);
}

export const BatchHero = (props: { batch: VBatch }) => (
	<div>
		<div class="flex items-center gap-4 my-8">
			<h1 class="flex-grow text-2xl text-sky-500 font-semibold tracking-tight">Batch # {props.batch.id}</h1>
		</div>
		<p class="font-bold -mt-8 mb-6">{props.batch.org_name}</p>
	</div>
);

export const Main = (props: { children: any }) => (
	<div class="max-w-2xl mx-auto">{props.children}</div>
)

export const PRE = (props: { obj: any }) => <pre class="max-h-64 bg-yellow-100 text-[12px] text-red-500 leading-4 overflow-x-auto my-5">{JSON.stringify(props.obj, null, 2)}</pre>;

export const BatchForm = (props: { org_id: number }) => {
	return (
		<div id="">
			<div class="mt-20">
				<button id="btn1" class="button-hollow">
					New Batch
				</button>
				<div id="cnt1" class="bg-stone-100 px-5 pt-4 pb-5" style="display:none">
					<p class="font-semibold">New Batch</p>
					<hr class="border-stone-300 -mx-5 mt-4 mb-5" />
					<form method="post" action="/orgs" class="text-[15px] m-0">
						<input type="hidden" name="org_id" value={props.org_id} />
						<div class="flex flex-col gap-2">
							<div class="flex items-center gap-3">
								<span class="w-28">Date:</span>
								<input id="f-date" name="date" type="date" class="input flex-grow" placeholder="YYYY-MM-DD" />
							</div>
							<div class="flex items-center gap-3">
								<span class="w-28">Batch type:</span>
								<div class="flex gap-4 py-1">
									<label class="flex items-center gap-2">
										<input type="radio" name="type" value="ASCENT" />
										<span>AC</span>
									</label>
									<label class="flex items-center gap-2">
										<input type="radio" name="type" value="CUSTOM" />
										<span>Custom</span>
									</label>
								</div>
							</div>
							<div class="flex items-center gap-3">
								<span class="w-28 shrink-0">Title:</span>
								<input id="f-title" name="title" type="text" class="input flex-grow" placeholder="Batch Title" />
							</div>
						</div>
						<hr class="border-stone-300 -mx-5 my-5" />
						<div class="flex gap-2">
							<div class="w-28 shrink-0">&nbsp;</div>
							<div class="flex gap-3">
								<button class="button ">Submit</button>
								<button id="btn2" type="button" class="button-hollow">
									Cancel
								</button>
							</div>
						</div>
					</form>
				</div>
			</div>
			{html`<script>
				const btn1 = document.getElementById('btn1');
				const btn2 = document.getElementById('btn2');
				const cnt1 = document.getElementById('cnt1');
				const fdate = document.getElementById('f-date');
				const ftitle = document.getElementById('f-title');

				btn1.addEventListener('click', () => {
					btn1.style.display = 'none';
					cnt1.style.display = 'block';
				});
				btn2.addEventListener('click', () => {
					fdate.value = '';
					ftitle.value = '';
					cnt1.style.display = 'none';
					btn1.style.display = 'block';
				});
			</script>`}
		</div>
	);
}

export const ACSelectModule = (props: { name: string; label: string; modules: any[]; cat: string; selections: string[] }) => {
	const ac_modules = props.modules.filter((m: any) => m.ascent == 1);
	const _modules = ac_modules.filter((m: any) => m.category == props.cat);
	return (
		<div class="flex items-center">
			<p class="w-36">{props.label}:</p>
			<select name={props.name} class="flex-grow text-[15px] leading-tight py-[6px]">
				<option value=""> - N/A</option>
				{_modules.map((m: any) =>
					props.selections.includes(m.id) ? (
						<option selected value={m.id}>
							{m.title}
						</option>
					) : (
						<option value={m.id}>{m.title}</option>
					)
				)}
			</select>
		</div>
	);
};

// Batch settings

export const SettingsInfo = (props: { batch: VBatch }) => (
	<div class="rounded border border-stone-300 px-4 pt-2 pb-3 my-5">
		{/* <form method="post" class="text-[15px] mb-1"> */}
		<table class="w-full mb-1">
			<tbody>
				<tr>
					<td width="26%" class="text-nowrap pt-2 pr-2">
						Organization:
					</td>
					<td class="font-bold pt-2">{props.batch.org_name}</td>
				</tr>
				<tr>
					<td class="text-nowrap pt-4 pr-2">Batch Type:</td>
					<td class="font-bold pt-2">{props.batch.type}</td>
				</tr>
				<tr>
					<td class="text-nowrap pt-4 pr-2">Date Created:</td>
					<td class="font--bold pt-2">{props.batch.created}</td>
				</tr>
			</tbody>
		</table>
		{/* </form> */}
	</div>
);

export const SettingsDateTitle = (props: { batch: VBatch }) => (
	<div id="date-title" class="rounded border border-stone-300 px-4 pr-2 pt-2 pb-3 my-5">
		<div class="relative ">
			<div class="absolute top-0 right-0">
				<button
					class="flex items-center justify-center w-5 h-5 text-stone-300 hover:text-stone-500 active:text-stone-700"
					hx-get={`/htmx/batches/${props.batch.id}/form-date-title`}
					hx-target="#date-title"
					hx-swap="outerHTML"
				>
					<LockSVG />
				</button>
			</div>
			<form class="text-[15px] mb-0">
				<table class="w-full">
					<tbody>
						<tr>
							<td width="26%" class="text-nowrap pt-2 pr-2">
								Date:
							</td>
							<td class="pt-2">
								<input readonly type="date" name="date" class="input w-32" value={props.batch.date} />
							</td>
						</tr>
						<tr>
							<td class="text-nowrap pt-2 pr-2">Title:</td>
							<td class="pt-2">
								<input readonly type="text" name="title" class="input" value={props.batch.title} />
							</td>
						</tr>
					</tbody>
					<tbody id="B2" style="display:none">
						<tr>
							<td colspan={2} class="border-b border-stone-300 pt-4"></td>
						</tr>
						<tr>
							<td></td>
							<td class="pt-3">
								<button class="button">SUBWAY</button>
							</td>
						</tr>
					</tbody>
				</table>
			</form>
		</div>
	</div>
);

export const FormSettingsDateTitle = (props: { batch: VBatch }) => (
	<div id="date-title" class="rounded border border-stone-300 px-4 pr-2 pt-2 pb-3 my-5">
		<div class="relative ">
			<form
			class="text-[15px] mb-0"
			hx-post={`/htmx/batches/${props.batch.id}/date-title`}
			hx-target="#date-title"
			hx-swap="outerHTML"
			>
				<table class="w-full">
					<tbody>
						<tr>
							<td width="26%" class="text-nowrap pt-2 pr-2">
								Date:
							</td>
							<td class="pt-2">
								<input type="date" name="date" class="input w-32" value={props.batch.date} />
							</td>
						</tr>
						<tr>
							<td class="text-nowrap pt-2 pr-2">Title:</td>
							<td class="pt-2">
								<input type="text" name="title" class="input" value={props.batch.title} />
							</td>
						</tr>
					</tbody>
					<tbody id="B2">
						<tr>
							<td colspan={2} class="border-b border-stone-300 pt-4"></td>
						</tr>
						<tr>
							<td></td>
							<td class="pt-3">
								<button class="button">Submit</button>
								<button
									type="button"
									class="button-hollow float-right"
									hx-get={`/htmx/batches/${props.batch.id}/date-title`}
									hx-target="#date-title"
									hx-swap="outerHTML"
								>
									Cancel
								</button>
							</td>
						</tr>
					</tbody>
				</table>
			</form>
		</div>
	</div>
);

const SelectModule = (props: { readonly?:boolean; name: string; cat: string; modules: Module[]; selections: string[] }) => {
	const ac_modules = props.modules.filter((m: any) => m.ascent == 1);
	const _modules = ac_modules.filter((m: any) => m.category == props.cat);
	const selections = props.selections.map((s) => s.split(':')[1])
	if (props.readonly) return (
		<select disabled name={props.name} class="w-full select pr-12">
			<option value=""> - N/A</option>
			{_modules.map((m: any) =>
				selections.includes(m.id) ? (
					<option selected value={m.id}>
						{m.title}
					</option>
				) : (
					<option value={m.id}>{m.title}</option>
				)
			)}
		</select>
	);
	return (
		<select name={props.name} class="w-full select pr-12">
			<option value=""> - N/A</option>
			{_modules.map((m: any) =>
				selections.includes(m.id) ? (
					<option selected value={m.id}>
						{m.title}
					</option>
				) : (
					<option value={m.id}>{m.title}</option>
				)
			)}
		</select>
	);
};

const SelectCustomModule = (props: { readonly?:boolean; name: string; index: number; modules: any[]; selections: string[] }) => {
	const { name, index, modules, readonly } = props;
	const selections = props.selections.map((s) => s.split(':')[1]);
	if (readonly) return (
		<select disabled name={name} class="w-full select pr-12">
			<option value=""> - N/A</option>
			{modules.map((m: any) =>
				selections[index] && selections[index] == m.id ? (
					<option selected value={(index + 1) + ':' + m.category + ':' + m.id}>
						{m.title}
					</option>
				) : (
					<option value={(index + 1) + ':' + m.category + ':' + m.id}>{m.title}</option>
				)
			)}
		</select>
	);
	return (
		<select name={name} class="w-full select pr-12">
			<option value=""> - N/A</option>
			{modules.map((m: any) =>
				selections[index] && selections[index] == m.id ? (
					<option selected value={index + 1 + ':' + m.category + ':' + m.id}>
						{m.title}
					</option>
				) : (
					<option value={index + 1 + ':' + m.category + ':' + m.id}>{m.title}</option>
				)
			)}
		</select>
	);
};

export const SettingsModules = (props: { batch: VBatch; modules: Module[]; selections: string[] }) => {
	const ac_selections = { SELF: '', CASE: '', FACE: '', DISC: '' };
	const cu_selections: string[] = [];
	if (props.batch.type == 'ASCENT') {
		props.selections.forEach((catid) => {
			const [cat, id] = catid.split(':');
			const module = props.modules.find((m) => m.id == id);
			if (module) {
				if (cat == 'SELF') ac_selections.SELF = module.title;
				if (cat == 'CASE') ac_selections.CASE = module.title;
				if (cat == 'FACE') ac_selections.FACE = module.title;
				if (cat == 'DISC') ac_selections.DISC = module.title;
			}
		})
	} else {
		props.selections.forEach((catid) => {
			const [cat, id] = catid.split(':');
			const module = props.modules.find((m) => m.id == id);
			if (module) {
				cu_selections.push(module.title);
			}
		})
	}
	return (
		<div id="settings-modules" class="rounded border border-stone-300 px-4 pr-2 pt-2 pb-3 my-5">
			<div class="relative">
				<div class="absolute top-0 right-0">
					<button
						class="flex items-center justify-center w-5 h-5 text-stone-300 hover:text-stone-500 active:text-stone-700"
						hx-get={`/htmx/batches/${props.batch.id}/form-modules`}
						hx-target="#settings-modules"
						hx-swap="outerHTML"
					>
						<LockSVG />
					</button>
				</div>
				<form class="text-[15px] pr-6 mb-0">
					<table class="w-full">
						<tbody>
							<tr>
								<td width="26%" class="text-nowrap pt-2 pr-2">
									{props.batch.type == 'ASCENT' ? 'Mod Selftest:' : 'Module # 1'}
								</td>
								<td class="pt-2">
									{props.batch.type == 'ASCENT' ? (
										<input readonly class="input w-full" type="text" name="mod[]" value={ac_selections.SELF || '---'} />
									) : (
										<input readonly class="input w-full" type="text" name="mod[]" value={cu_selections[0] || '---'} />
									)}
								</td>
							</tr>
							<tr>
								<td class="text-nowrap pt-2 pr-2">{props.batch.type == 'ASCENT' ? 'Mod Case:' : 'Module # 2'}</td>
								<td class="pt-2">
									{props.batch.type == 'ASCENT' ? (
										<input readonly class="input w-full" type="text" name="mod[]" value={ac_selections.CASE || '---'} />
									) : (
										<input readonly class="input w-full" type="text" name="mod[]" value={cu_selections[1] || '---'} />
									)}
								</td>
							</tr>
							<tr>
								<td class="text-nowrap pt-2 pr-2">{props.batch.type == 'ASCENT' ? 'Mod Face2Face:' : 'Module # 3'}</td>
								<td class="pt-2">
									{props.batch.type == 'ASCENT' ? (
										<input readonly class="input w-full" type="text" name="mod[]" value={ac_selections.FACE || '---'} />
									) : (
										<input readonly class="input w-full" type="text" name="mod[]" value={cu_selections[2] || '---'} />
									)}
								</td>
							</tr>
							<tr>
								<td class="text-nowrap pt-2 pr-2">{props.batch.type == 'ASCENT' ? 'Mod Discussion:' : 'Module # 4'}</td>
								<td class="pt-2">
									{props.batch.type == 'ASCENT' ? (
										<input readonly class="input w-full" type="text" name="mod[]" value={ac_selections.DISC || '---'} />
									) : (
										<input readonly class="input w-full" type="text" name="mod[]" value={cu_selections[3] || '---'} />
									)}
								</td>
							</tr>
						</tbody>
					</table>
				</form>
			</div>
		</div>
	);
};

export const FormSettingsModules = (props: { batch: VBatch; modules: any[]; selections: string[] }) => (
	<div id="settings-modules" class="rounded border border-stone-300 px-4 pr-2 pt-2 pb-3 my-5">
		<form class="text-[15px] pr-6 mb-0" hx-post={`/htmx/batches/${props.batch.id}/modules`} hx-target="#settings-modules" hx-swap="outerHTML">
			<input type="hidden" name="batch_type" value={props.batch.type} />
			<table class="w-full">
				<tbody>
					<tr>
						<td width="26%" class="text-nowrap pt-2 pr-2">
							{props.batch.type == 'ASCENT' ? 'Mod Selftest:' : 'Module # 1'}
						</td>
						<td class="pt-2">
							{props.batch.type == 'ASCENT' ? (
								<SelectModule cat="SELF" name="self" modules={props.modules} selections={props.selections} />
							) : (
								<SelectCustomModule index={0} name="module[]" modules={props.modules} selections={props.selections} />
							)}
						</td>
					</tr>
					<tr>
						<td class="text-nowrap pt-2 pr-2">{props.batch.type == 'ASCENT' ? 'Mod Case:' : 'Module # 2'}</td>
						<td class="pt-2">
							{props.batch.type == 'ASCENT' ? (
								<SelectModule cat="CASE" name="case" modules={props.modules} selections={props.selections} />
							) : (
								<SelectCustomModule index={1} name="module[]" modules={props.modules} selections={props.selections} />
							)}
						</td>
					</tr>
					<tr>
						<td class="text-nowrap pt-2 pr-2">{props.batch.type == 'ASCENT' ? 'Mod Face2Face:' : 'Module # 3'}</td>
						<td class="pt-2">
							{props.batch.type == 'ASCENT' ? (
								<SelectModule cat="FACE" name="face" modules={props.modules} selections={props.selections} />
							) : (
								<SelectCustomModule index={2} name="module[]" modules={props.modules} selections={props.selections} />
							)}
						</td>
					</tr>
					<tr>
						<td class="text-nowrap pt-2 pr-2">{props.batch.type == 'ASCENT' ? 'Mod Discussion:' : 'Module # 4'}</td>
						<td class="pt-2">
							{props.batch.type == 'ASCENT' ? (
								<SelectModule cat="DISC" name="disc" modules={props.modules} selections={props.selections} />
							) : (
								<SelectCustomModule index={3} name="module[]" modules={props.modules} selections={props.selections} />
							)}
						</td>
					</tr>
					<tr>
						<td colspan={2} class="border-b border-stone-300 pt-4"></td>
					</tr>
					<tr>
						<td></td>
						<td class="pt-3">
							<button class="button mr-3">Submit</button>
							<button
								type="button"
								class="button-hollow float-right"
								hx-get={`/htmx/batches/${props.batch.id}/modules`}
								hx-target="#settings-modules"
								hx-swap="outerHTML"
							>
								Cancel
							</button>
						</td>
					</tr>
				</tbody>
			</table>
		</form>
	</div>
);

//

export const UploadPersonsCSV = (props: { batch: Batch|VBatch }) => (
	<div>
		<div class="rounded bg-stone-50 border border-stone-300 text--[15px] px-4 pt-2 pb-3">
			<p class="mb-5">Belum ada data peserta.</p>
			<form>
				<input type="hidden" name="batch_id" value={props.batch.id} />
				<button class="button">Upload Daftar Peserta</button>
			</form>
		</div>
		<p class="mt-2">
			🏀{' '}
			<a class="text-stone-600 hover:text-orange-500 hover:underline" href="#">
				Download file template daftar peserta
			</a>
		</p>
		{/* DEV ONLY */}
		<p class="border-b border-stone-400 text-stone-400 text-center font-mono mt-8">DEV ONLY</p>
		<form method="post" class="flex items-center justify-center mt-6">
			<input type="hidden" name="batch_id" value={props.batch.id} />
			<input type="hidden" name="org_id" value={props.batch.org_id} />
			<div class="flex gap-3 items-center">
				<span>Create sample data:</span>
				<input type="number" name="num" min={5} max={100} value={15} class="w-20 input" />
				<button class="button">Create</button>
			</div>
		</form>
	</div>
);

export const DaftarPeserta = (props: { persons: any[] }) => (
	<div>
		<h3 class="text-stone-600 font-medium uppercase mb-3">Daftar Peserta Batch</h3>
		<table class="w-full border-t border-stone-500">
			<tbody>
				{props.persons.map((p: any, i: number) => (
					<tr class="border-b border-stone-300 cursor-pointer hover:text-sky-500">
						<td class="w-8 pr-2 py-3">{i + 1}</td>
						<td class="pr-2 py-3">{p.fullname}</td>
						<td class="pr-2 py-3">{p.username}</td>
					</tr>
				))}
			</tbody>
		</table>
		<PRE obj={props.persons[props.persons.length -1]} />
	</div>
);
