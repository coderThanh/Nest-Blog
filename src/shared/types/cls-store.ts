import { ClsStore } from 'nestjs-cls';

export interface GlobalClsStore extends ClsStore {
  userId?: string;
}
