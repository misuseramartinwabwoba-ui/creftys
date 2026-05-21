describe('Busulu System (Buganda Reality)', () => {

  it('should support ground rent collector', () => {
    const property = {
      legal: {
        ownership: {
          busuluCollector: 'Local Elder'
        }
      }
    };

    expect(property.legal.ownership.busuluCollector).toBeDefined();
  });

});