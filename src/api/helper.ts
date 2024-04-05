export const stall = async (stallTime = 3000): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, stallTime));
};
