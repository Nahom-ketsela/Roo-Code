import * as fs from "fs/promises"
import * as path from "path"
import { randomUUID } from "crypto"
import { Task } from "../core/task/Task"
import { generateContentHash } from "../utils/hash"

/**
 * Logs a semantic trace of an agent's file mutation to .orchestration/agent_trace.jsonl.
 * This satisfies the "Intent-AST Correlation" requirement by linking the mutation
 * to its intent, class, and content hash.
 *
 * @param task The current Task instance containing semantic metadata.
 * @param filePath The path of the file being modified.
 * @param newContent The new content of the file.
 */
export async function logAgentTrace(task: Task, filePath: string, newContent: string): Promise<void> {
	const traceId = randomUUID()
	const timestamp = new Date().toISOString()
	const contentHash = generateContentHash(newContent)

	const traceEntry = {
		id: traceId,
		timestamp: timestamp,
		vcs: { revision_id: "untracked_agent_mutation" },
		files: [
			{
				relative_path: filePath,
				conversations: [
					{
						url: task.taskId || "session_log_id",
						entity_type: "AI",
						model_identifier: "roo-code-agent",
						ranges: [
							{
								content_hash: contentHash,
							},
						],
					},
				],
			},
		],
		related: [
			{
				type: "specification",
				value: task.currentIntentId || "unspecified",
			},
			{
				type: "mutation_class",
				value: task.currentMutationClass || "unspecified",
			},
		],
	}

	const orchestrationDir = path.join(task.cwd, ".orchestration")
	const traceFilePath = path.join(orchestrationDir, "agent_trace.jsonl")

	try {
		// Ensure the directory exists
		await fs.mkdir(orchestrationDir, { recursive: true })

		// Append the trace entry as a single line
		await fs.appendFile(traceFilePath, JSON.stringify(traceEntry) + "\n", "utf8")
	} catch (error) {
		// Non-blocking error for the agent's core loop, but we should log it
		console.error(`Failed to log agent trace: ${error}`)
	}
}
