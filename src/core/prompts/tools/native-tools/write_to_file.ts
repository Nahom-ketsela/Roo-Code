import type OpenAI from "openai"

const WRITE_TO_FILE_DESCRIPTION = `Request to write content to a file. This tool is primarily used for creating new files or for scenarios where a complete rewrite of an existing file is intentionally required. If the file exists, it will be overwritten. If it doesn't exist, it will be created. This tool will automatically create any directories needed to write the file.

**Important:** You should prefer using other editing tools over write_to_file when making changes to existing files, since write_to_file is slower and cannot handle large files. Use write_to_file primarily for new file creation.

When using this tool, you must accurately classify the change. You must provide the \`intent_id\` you checked out and choose a \`mutation_class\` that best describes the semantic nature of your change:
- "AST_REFACTOR": For syntax changes, cleanup, or structural refactoring that does not change functional logic.
- "INTENT_EVOLUTION": For adding new features, modifying core logic, or evolving the system's capabilities.

ALWAYS provide the COMPLETE file content in your response. This is NON-NEGOTIABLE. Partial updates or placeholders like '// rest of code unchanged' are STRICTLY FORBIDDEN. Failure to do so will result in incomplete or broken code.

Example: Writing a configuration file
{ "path": "frontend-config.json", "content": "{\\n  \\"apiEndpoint\\": \\"https://api.example.com\\",\\n  \\"theme\\": {\\n    \\"primaryColor\\": \\"#007bff\\"\\n  }\\n}", "intent_id": "setup_api", "mutation_class": "INTENT_EVOLUTION" }`

const PATH_PARAMETER_DESCRIPTION = `The path of the file to write to (relative to the current workspace directory)`

const CONTENT_PARAMETER_DESCRIPTION = `The content to write to the file. ALWAYS provide the COMPLETE intended content of the file, without any truncation or omissions. You MUST include ALL parts of the file, even if they haven't been modified. Do NOT include line numbers in the content.`

export default {
	type: "function",
	function: {
		name: "write_to_file",
		description: WRITE_TO_FILE_DESCRIPTION,
		strict: true,
		parameters: {
			type: "object",
			properties: {
				path: {
					type: "string",
					description: PATH_PARAMETER_DESCRIPTION,
				},
				content: {
					type: "string",
					description: CONTENT_PARAMETER_DESCRIPTION,
				},
				intent_id: {
					type: "string",
					description: "The active intent ID this file change belongs to.",
				},
				mutation_class: {
					type: "string",
					enum: ["AST_REFACTOR", "INTENT_EVOLUTION"],
					description:
						"Semantic classification of the change: 'AST_REFACTOR' for syntax/structure, 'INTENT_EVOLUTION' for logic/features.",
				},
			},
			required: ["path", "content", "intent_id", "mutation_class"],
			additionalProperties: false,
		},
	},
} satisfies OpenAI.Chat.ChatCompletionTool
