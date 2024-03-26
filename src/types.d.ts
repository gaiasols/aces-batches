type Env = {
	__STATIC_CONTENT: KVNamespace;
	__STATIC_CONTENT_MANIFEST: KVNamespace;
	DB: D1Database;
};

type Batch = {
	id: number;
	token: string;
	org_id: number;
	date: string;
	type: string;
	mode: string | null;
	split: number;
	title: string;
	status: number;
	time1: string | null;
	time2: string | null;
	time3: string | null;
	time4: string | null;
	created?: string | null;
	updated?: string | null;
};
type VBatch = Batch & {
	org_name: string;
	modules: number;
};
type Module = {
	id: string;
	category: string;
	title: string;
	ascent: number;
	version: string | null;
	created?: string;
	updated?: string | null;
};
type BatchModule = {
	batch_id: number;
	module_id: string;
	category: string;
};
