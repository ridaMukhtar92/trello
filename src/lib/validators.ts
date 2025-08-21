import { z } from "zod";

export const BoardCreate = z.object({ title: z.string().min(1).max(120) });
export const ListCreate = z.object({ boardId: z.string().uuid(), title: z.string().min(1), position: z.number().int().nonnegative().optional() });
export const TaskCreate = z.object({ listId: z.string().uuid(), title: z.string().min(1), position: z.number().int().nonnegative().optional(), description: z.string().optional(), dueDate: z.string().date().optional() });

export const BoardUpdate = z.object({ id: z.string().uuid(), title: z.string().min(1).max(120) });
export const ListUpdate = z.object({ id: z.string().uuid(), title: z.string().min(1), position: z.number().int().nonnegative().optional() });
export const TaskUpdate = z.object({ id: z.string().uuid(), title: z.string().min(1), description: z.string().optional(), position: z.number().int().nonnegative().optional(), dueDate: z.string().optional() });