/**
 * TITLE STATUS ENGINE
 */

export type TitleStatus =
  | 'CLEAN'
  | 'CAVEATED'
  | 'DISPUTED'
  | 'MORTGAGED';

export function resolveTitleStatus(
  disputed: boolean,
  caveated: boolean
): TitleStatus {

  if (disputed) {
    return 'DISPUTED';
  }

  if (caveated) {
    return 'CAVEATED';
  }

  return 'CLEAN';
}