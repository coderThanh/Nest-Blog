export type AuditCreate<T> = T & {
  createdBy: string | null;
};

export type AuditUpdate<T> = T & {
  createdBy?: string | null;
};

export type AuditSoftDelete<T> = T & {
  deletedBy: string | null;
  deletedAt: string;
};
