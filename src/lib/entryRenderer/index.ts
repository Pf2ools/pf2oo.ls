import "./renderer.css";

abstract class Renderer {
	abstract renderParagraph(text: string): string;
	abstract renderTag(type: string, content: string, extra?: string[]): string;
	abstract renderObject(object: object): string;
	abstract wrapContent(content: string): string;

	protected parseText(text: string): string {
		// eslint-disable-next-line regexp/no-super-linear-backtracking
		return text.replace(/\{@(\w+)\s+([^}]+)\}/g, (match, type, content) => {
			const [main, ...extra] = content.split("|").map((s: string) => s.trim());
			return this.renderTag(type, main, extra);
		});
	}

	render(data: (string | object)[]): string {
		const content = data
			.map((text) => typeof text === "string"
				? this.renderParagraph(this.parseText(text))
				: this.renderObject(text))
			.join("");

		return this.wrapContent(content);
	}
}

export class HTMLRenderer extends Renderer {
	renderParagraph(text: string): string {
		return `<p>${text}</p>\n`;
	}

	// TODO: EXPAND
	renderTag(type: string, content: string, _extra?: string[]): string {
		const className = `tag tag-${type}`;

		switch (type) {
			case "b":
			case "bold":
				return `<strong>${content}</strong>`;
			case "i":
			case "italic":
				return `<em>${content}</em>`;
			case "code":
				return `<code>${content}</code>`;
			default:
				return `<span class="${className} unsupported">${_extra?.[1] || content}</span>`;
		}
	}

	// TODO: EXPAND
	renderObject(obj: object) {
		return `<pre>${JSON.stringify(obj, null, 2)}</pre>\n`;
	}

	// TODO: IS IT NEEDED?
	wrapContent(content: string): string {
		return `<div class="pf2ools-content">\n${content}</div>`;
	}
}

export class MarkdownRenderer extends Renderer {
	renderParagraph(text: string): string {
		return `${text}\n\n`;
	}

	renderTag(type: string, content: string, _extra?: string[]): string {
		switch (type) {
			case "b":
			case "bold":
				return `**${content}**`;
			case "i":
			case "italic":
				return `*${content}*`;
			case "code":
				return `\`${content}\``;
			default:
				return content;
		}
	}

	renderObject(_obj: object) {
		return "Object Entries are Unsupported";
	}

	wrapContent(content: string): string {
		return content.trim();
	}
}
