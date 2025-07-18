import { Schema as S } from "@triplit/client";

export const schema = S.Collections({
	users: {
		schema: S.Schema({
			id: S.Id(),
			name: S.String(),
		}),
	},
	source: {
		schema: S.Schema({
			id: S.String(),
			title: S.Record({
				full: S.String(),
				short: S.String(),
			}),
		}),
		relationships: {
			background: S.RelationMany("background", {
				where: [["source.id", "=", "$background.source.ID"]],
			}),
		},
	},
	background: {
		schema: S.Schema({
			id: S.String(),
			name: S.Record({
				primary: S.String(),
			}),
			source: S.Record({
				ID: S.String(),
				page: S.Number(),
			}),
		}),
		relationships: {
			source: S.RelationOne("source", {
				where: [["background.source.ID", "=", "$id"]],
			}),
		},
	},
});
