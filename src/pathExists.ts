import { stat } from 'fs/promises';

/**
 * Check if all paths exist (otherwise throws an error)
 * @param args - paths to check (wont distinguish between file and directory)
 */
export async function pathExistOrThrow(args: string[] | string) {
  if (typeof args === 'string') args = [args];
  for (const dir of args) {
    await stat(dir);
  }
}
