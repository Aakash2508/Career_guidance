const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
const axios = require('axios');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Simple test endpoint
app.get('/user/:id', (req, res) => {
  res.send(`User ID is ${req.params.id}`);
});

// Generate roadmap endpoint
app.post('/generate', async (req, res) => {
  const { current, desired } = req.body;

  try {
    const response = await axios.post(
      'https://api.together.xyz/v1/chat/completions',
      {
        model: 'meta-llama/Llama-3.3-70B-Instruct-Turbo-Free',
        messages: [
          {
            role: 'user',
            content: `Generate a 5 to 7 step roadmap from a "${current}" to become a "${desired}". Respond ONLY with a valid JSON array (no intro text) where each item has "step" and "description". Example format: [{"step": "Step 1", "description": "Learn X"}, ...]`,
          },
        ],
        max_tokens: 700,
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.TOGETHER_AI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    // Extract the output text
    const aiMessage = response.data.choices[0]?.message?.content || '';

    console.log('Raw AI response:', aiMessage);

    // Try to extract valid JSON even if wrapped in code block
    const match = aiMessage.match(/\[.*\]/s);
    if (!match) throw new Error("No valid JSON array found in response.");

    const roadmap = JSON.parse(match[0]);

    // Optional: sanitize step titles and descriptions
    const sanitized = roadmap.map((step, i) => ({
      step: step.step || `Step ${i + 1}`,
      description: step.description?.trim() || '',
    }));

    res.json({ roadmap: sanitized });
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({
      error: 'Failed to generate roadmap',
      details: err.message,
    });
  }
});

app.listen(5007, () => {
  console.log('✅ Backend server running on http://localhost:5007');
});
