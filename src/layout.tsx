import { FC } from 'hono/jsx';

export const Layout: FC = (props) => {
	const title = props.title || 'Aces Batch Manager';
	const refresh = props.refresh;
	return (
		<html>
			<head>
				<title>{title}</title>
				{props.refresh != undefined && <meta http-equiv="refresh" content={props.refresh} />}
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
				<link href="/styles.css" rel="stylesheet" />
				<script
					src="https://unpkg.com/htmx.org@1.9.10"
					integrity="sha384-D1Kt99CQMDuVetoL1lrYwg5t+9QdHe7NLX/SoJYkXDFfX37iInKRy5xLSi8nO7UC"
					crossorigin="anonymous"
				></script>
				<script src="https://unpkg.com/hyperscript.org@0.9.12"></script>
			</head>
			<body class="antialiased">
				<div class="page">{props.children}</div>
			</body>
		</html>
	);
};
