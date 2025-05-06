export const Given = (description: string, callback: () => void): void => {
  describe(`Given ${description}`, callback);
};

export const When = (description: string, callback: () => void): void => {
  describe(`When ${description}`, callback);
};

export const Then = (description: string, callback: () => void): void => {
  it(`Then ${description}`, callback);
};

export const Scenario = (description: string, callback: () => void): void => {
  describe(`Scenario: ${description}`, callback);
};

export const context = (description: string, callback: () => void): void => {
  describe(`Context: ${description}`, callback);
};
