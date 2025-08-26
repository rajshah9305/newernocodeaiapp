const Cerebras = require('@cerebras/cerebras_cloud_sdk').default;

async function testCerebras() {
  try {
    const client = new Cerebras({
      apiKey: 'csk-62h6jy4fhepkxmmptxvf36kj6jn9mj3kffd6m6d6pr6x4de6'
    });

    console.log('🧪 Testing Cerebras API connection...');
    
    const response = await client.chat.completions.create({
      messages: [
        { role: 'user', content: 'Hello, respond with just "API Working"' }
      ],
      model: 'llama3.1-8b',
      max_completion_tokens: 10,
      temperature: 0.1
    });

    console.log('✅ API Response:', response.choices[0]?.message?.content);
    console.log('🎉 Cerebras API is working correctly!');
    
  } catch (error) {
    console.error('❌ Cerebras API Error:', error.message);
    console.error('📋 Error details:', error);
  }
}

testCerebras();