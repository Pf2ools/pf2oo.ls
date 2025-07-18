import { Schema as S } from "@triplit/client";

export const schema = S.Collections({
	users: {
		schema: S.Schema({
			id: S.Id(),
			name: S.String(),
		}),
	},
	background: {
		schema: S.Schema({
			id: S.Id(),
			name: S.Record({
				primary: S.String()
			}),
		}),
	},
	source: {
		schema: S.Schema({
			id: S.Id(),
			name: S.Record({
				primary: S.String()
			}),
		}),
	},
});
