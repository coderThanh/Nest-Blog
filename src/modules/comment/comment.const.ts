import { Prisma } from '@prisma/client';

/** Hãy nhớ viết event listener onDelete Casade thủ công */
export const COMMENT_MODELS = new Set([Prisma.ModelName.Post]);
