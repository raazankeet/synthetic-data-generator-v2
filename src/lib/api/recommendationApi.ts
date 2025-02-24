import { TableMetadataResponse } from '@/lib/types';

export const fetchGeneratorRecommendations = async (metadata: TableMetadataResponse) => {
  try {
    console.log('API Request Body:', JSON.stringify(metadata, null, 2));
    
    const response = await fetch('http://localhost:5003/ask', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(metadata)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('API Response:', JSON.stringify(data, null, 2));
    return data;
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    throw error;
  }
}; 