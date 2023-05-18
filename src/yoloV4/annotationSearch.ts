import { opendir } from 'fs/promises';
import { join } from 'node:path';

/**
 * Recursively search for annotation files from a base directory
 * @param baseDirectoryPath - path to the base directory
 * @returns array of paths to annotation files if any is found.
 */
export async function annotationSearch(
  baseDirectoryPath: string,
  annotationFilePaths: string[] = [],
) {
  const baseDir = await opendir(baseDirectoryPath, { recursive: true });

  for await (const dir of baseDir) {
    if (dir.isFile() && dir.name.endsWith('_annotations.txt')) {
      annotationFilePaths.push(join(baseDirectoryPath, dir.name));
    } else if (dir.isDirectory()) {
      await annotationSearch(
        join(baseDirectoryPath, dir.name),
        annotationFilePaths,
      );
    }
  }
  return annotationFilePaths;
}
