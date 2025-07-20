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
			backgrounds: S.RelationMany("background", {
				where: [["source.ID", "=", "$id"]],
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
			sourceData: S.RelationOne("source", {
				where: [["id", "=", "$source.ID"]],
			}),
		},
	},
});
