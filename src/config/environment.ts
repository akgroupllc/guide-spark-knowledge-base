
interface Environment {
  production: boolean;
  apiBaseUrl: string;
}

const getEnvironment = (): Environment => {
  const isProduction = import.meta.env.PROD;
  
  return {
    production: isProduction,
    apiBaseUrl: isProduction 
      ? '/api' // Adjust this to your production API URL
      : 'http://localhost:3001/api' // Development API URL
  };
};

export const env = getEnvironment();
