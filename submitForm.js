// submitForm.js

const fetch = require('node-fetch');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { name, lastName, email } = JSON.parse(event.body);

    const databaseId = 'ba11163b1dea48b7a8add9b0a39bc9d6'; // Replace with your Notion database ID
    const notionEndpoint = `https://api.notion.com/v1/pages`;

    const response = await fetch(notionEndpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer YOUR_NOTION_API_TOKEN`, // Replace with your Notion API token
        'Content-Type': 'application/json',
        'Notion-Version': '2022-06-13', // Update with the latest Notion API version
      },
      body: JSON.stringify({
        parent: { database_id: databaseId },
        properties: {
          First: {
            title: [
              {
                text: {
                  content: name,
                },
              },
            ],
          },
          Last: {
            title: [
              {
                text: {
                  content: lastName,
                },
              },
            ],
          },
          Email: {
            email: email,
          },
        },
      }),
    });

    if (!response.ok) {
      console.error('Error posting to Notion:', response.statusText);
      return { statusCode: response.status, body: 'Error posting to Notion' };
    }

    const data = await response.json();
    console.log('Notion response:', data);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Form data submitted to Notion successfully' }),
    };
  } catch (error) {
    console.error('Error processing form submission:', error.message);
    return { statusCode: 500, body: 'Internal Server Error' };
  }
};
