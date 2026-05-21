const validTransitions = [
  ['draft', 'pending_verification'],
  ['pending_verification', 'verified'],
  ['verified', 'listed'],
  ['listed', 'under_offer'],
  ['under_offer', 'sold'],
  ['under_offer', 'listed']
];

const invalidTransitions = [
  ['sold', 'draft'],
  ['listed', 'draft'],
  ['verified', 'sold']
];

function canTransition(from: string, to: string): boolean {
  return validTransitions.some(([f, t]) => f === from && t === to);
}

test('valid lifecycle transitions', () => {
  for (const [from, to] of validTransitions) {
    expect(canTransition(from, to)).toBe(true);
  }
});

test('invalid lifecycle transitions blocked', () => {
  for (const [from, to] of invalidTransitions) {
    expect(canTransition(from, to)).toBe(false);
  }
});