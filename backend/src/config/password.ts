interface StrongPasswordOptions {
  minLength: number;
  minLowercase: number;
  minUppercase: number;
  minNumbers: number;
  minSymbols: number;
  returnScore: boolean;
  pointsPerUnique: number;
  pointsPerRepeat: number;
  pointsForContainingLower: number;
  pointsForContainingUpper: number;
  pointsForContainingNumber: number;
  pointsForContainingSymbol: number;
}

const developmentPasswordConfig: StrongPasswordOptions = {
  minLength: 4,
  minLowercase: 0,
  minUppercase: 0,
  minNumbers: 0,
  minSymbols: 0,
  returnScore: false,
  pointsPerUnique: 1,
  pointsPerRepeat: 0.5,
  pointsForContainingLower: 10,
  pointsForContainingUpper: 10,
  pointsForContainingNumber: 10,
  pointsForContainingSymbol: 10,
};

const productionPasswordConfig: StrongPasswordOptions = {
  minLength: 8,
  minLowercase: 1,
  minUppercase: 1,
  minNumbers: 1,
  minSymbols: 1,
  returnScore: false,
  pointsPerUnique: 1,
  pointsPerRepeat: 0.5,
  pointsForContainingLower: 10,
  pointsForContainingUpper: 10,
  pointsForContainingNumber: 10,
  pointsForContainingSymbol: 10,
};

export const getPasswordConfig = (): StrongPasswordOptions => {
  const isDevelopment = process.env.NODE_ENV === 'development';
  return isDevelopment ? developmentPasswordConfig : productionPasswordConfig;
};