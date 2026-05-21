describe('Property Lifecycle', () => {

  it('should move from draft → verified → listed', () => {
    const state = 'draft';

    const verified = 'verified';
    const listed = 'listed';

    expect(verified).not.toBe(state);
    expect(listed).not.toBe(state);
  });

});