import * as fs from "fs/promises"
import * as path from "path"
import { Task } from "../task/Task"
import { BaseTool, ToolCallbacks } from "./BaseTool"

interface RecordLessonParams {
	lesson: string
}

export class RecordLessonTool extends BaseTool<"record_lesson"> {
	readonly name = "record_lesson" as const

	async execute(params: RecordLessonParams, task: Task, callbacks: ToolCallbacks): Promise<void> {
		const { pushToolResult, handleError } = callbacks
		const lesson = params.lesson

		if (!lesson) {
			task.consecutiveMistakeCount++
			task.recordToolError("record_lesson")
			pushToolResult(await task.sayAndCreateMissingParamError("record_lesson", "lesson"))
			return
		}

		const claudeMdPath = path.join(task.cwd, "CLAUDE.md")
		const timestamp = new Date().toISOString()
		const formattedLesson = `\n### [${timestamp}] Lesson Learned\n${lesson}\n`

		try {
			await fs.appendFile(claudeMdPath, formattedLesson, "utf8")
			pushToolResult(
				`Successfully recorded lesson to CLAUDE.md: "${lesson.substring(0, 50)}${lesson.length > 50 ? "..." : ""}"`,
			)
		} catch (error) {
			await handleError("recording lesson", error as Error)
		}
	}

	// record_lesson is non-streaming and doesn't require complex UI updates during partial parsing
	override async handlePartial(task: Task, block: any): Promise<void> {
		// No-op
	}
}

export const recordLessonTool = new RecordLessonTool()
