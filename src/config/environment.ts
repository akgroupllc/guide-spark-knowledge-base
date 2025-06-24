
interface Environment {
  production: boolean;
  apiBaseUrl: string;
}

const getEnvironment = (): Environment => {
  const isProduction = import.meta.env.PROD;
  
  return {
    production: isProduction,
    apiBaseUrl: isProduction 
      ? 'https://your-domain.com/api' // Update this to your production backend URL
      : 'http://localhost:3001/api' // Development backend URL
  };
};

export const env = getEnvironment();
