import { existsSync } from 'fs';

export function allExist(args: string[] | string) {
  if (typeof args === 'string') {
    args = [args];
    for (const dir of args) {
      if (!existsSync(dir)) {
        return false;
      }
    }
  }
  return true;
}
