// api.js
const handleApiRequest = async (url, method, body) => {
    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });
      return response;
    } catch (error) {
      console.error(`Error performing ${method} request:`, error);
    }
  };
  
  export const api = {
    fetchData: async (url, method, body, successCallback) => {
      const response = await handleApiRequest(url, method, body);
      if (response) {
        successCallback();
      }
    },
  };
  