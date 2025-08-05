import type { backgroundInfer } from "pf2ools-schema";

declare global {
	interface DB {
		background: backgroundInfer & { id: string };
	}
}
