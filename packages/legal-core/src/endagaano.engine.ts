/**
 * ENDAGAANO ENGINE
 *
 * Local sale agreements.
 */

export interface EndagaanoAgreement {
	sellerName: string;

	buyerName: string;

	witnesses: string[];

	signedAt: Date;

	lc1Stamped: boolean;
}

export function isValidEndagaano(
	agreement: EndagaanoAgreement
): boolean {

	return (
		agreement.witnesses.length >= 2 &&
		agreement.lc1Stamped
	);
}
