import { Schema as S } from "@triplit/client";

const contentSchema = {
	type: S.String(),
	name: S.Record({
		primary: S.String(),
		aliases: S.Json({ nullable: true }),
		specifier: S.String({ nullable: true }),
	}),
	source: S.Record({
		ID: S.String(),
		page: S.Number(),
	}),
	reference: S.Json({ nullable: true }),
} as const;

export const schema = S.Collections({
	source: {
		schema: S.Schema({
			id: S.String(),
			type: S.String(),
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
			...contentSchema,
			data: S.Json({ nullable: true }),
		}),
		relationships: {
			sourceData: S.RelationOne("source", {
				where: [["id", "=", "$source.ID"]],
			}),
		},
	},
	condition: {
		schema: S.Schema({
			id: S.String(),
			...contentSchema,
			data: S.Json({ nullable: true }),
		}),
		relationships: {
			sourceData: S.RelationOne("source", {
				where: [["id", "=", "$source.ID"]],
			}),
		},
	},
	divineIntercession: {
		schema: S.Schema({
			id: S.String(),
			...contentSchema,
			data: S.Json({ nullable: true }),
		}),
		relationships: {
			sourceData: S.RelationOne("source", {
				where: [["id", "=", "$source.ID"]],
			}),
		},
	},
	event: {
		schema: S.Schema({
			id: S.String(),
			...contentSchema,
			data: S.Json({ nullable: true }),
		}),
		relationships: {
			sourceData: S.RelationOne("source", {
				where: [["id", "=", "$source.ID"]],
			}),
		},
	},
	familiarAbility: {
		schema: S.Schema({
			id: S.String(),
			...contentSchema,
			data: S.Json({ nullable: true }),
		}),
		relationships: {
			sourceData: S.RelationOne("source", {
				where: [["id", "=", "$source.ID"]],
			}),
		},
	},
	relicGift: {
		schema: S.Schema({
			id: S.String(),
			...contentSchema,
			data: S.Json({ nullable: true }),
		}),
		relationships: {
			sourceData: S.RelationOne("source", {
				where: [["id", "=", "$source.ID"]],
			}),
		},
	},
	skill: {
		schema: S.Schema({
			id: S.String(),
			...contentSchema,
			data: S.Json({ nullable: true }),
		}),
		relationships: {
			sourceData: S.RelationOne("source", {
				where: [["id", "=", "$source.ID"]],
			}),
		},
	},
	users: {
		schema: S.Schema({
			id: S.Id(),
			name: S.String(),
		}),
	},
});
