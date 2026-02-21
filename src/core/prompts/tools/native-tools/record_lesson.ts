import type OpenAI from "openai"

/**
 * Tool definition for recording lessons learned during the task.
 * This satisfies the "Shared Brain" requirement for parallel orchestration.
 */
export const record_lesson = {
	type: "function",
	function: {
		name: "record_lesson",
		description:
			"Use this tool immediately if a verification step (like a linter or test) fails, or to record architectural constraints. It appends the lesson to CLAUDE.md so parallel agents share this knowledge and avoid repeating mistakes.",
		parameters: {
			type: "object",
			properties: {
				lesson: {
					type: "string",
					description: "The lesson learned or architectural constraint to record.",
				},
			},
			required: ["lesson"],
			additionalProperties: false,
		},
	},
} satisfies OpenAI.Chat.ChatCompletionTool
