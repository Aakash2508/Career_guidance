const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../db");
const nodemailer = require("nodemailer");
require("dotenv").config();
const axios = require("axios");
const router = express.Router();
const authMiddleware=require("../middleware/authMiddleware")
// Nodemailer Transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASSWORD,
  },
});

const authenticateToken = require("../middleware/authMiddleware"); // Import middleware

router.get("/user", authenticateToken, async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT full_name, email, role FROM "Users" WHERE id = $1`,
            [req.user.id] // Use authenticated user ID
        );

        if (result.rows.length === 0) return res.status(404).json({ message: "User not found." });

        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch user data." });
    }
});



// 📌 Send OTP
router.post("/request-otp", async (req, res) => {
  const { email } = req.body;
  const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
  const expiry = new Date(Date.now() + 10 * 60 * 1000); // 10 min expiry

  try {
    await pool.query("INSERT INTO OTP (email, otp_code, expires_at) VALUES ($1, $2, $3) ON CONFLICT (email) DO UPDATE SET otp_code = $2, expires_at = $3", [email, otpCode, expiry]);

    await transporter.sendMail({
      from: process.env.SMTP_EMAIL,
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP code is ${otpCode}. It is valid for 10 minutes.`,
    });

    res.json({ message: "OTP sent successfully." });
  } catch (error) {
    res.status(500).json({ message: "Error sending OTP." });
  }
});

// 📌 Verify OTP
router.post("/verify-otp", async (req, res) => {
  const { email, otp } = req.body;

  try {
    const result = await pool.query("SELECT * FROM OTP WHERE email = $1 AND otp_code = $2 AND expires_at > NOW()", [email, otp]);

    if (result.rows.length === 0) {
      return res.status(400).json({ message: "Invalid or expired OTP." });
    }

    res.json({ success: true, message: "OTP verified successfully." });
  } catch (error) {
    res.status(500).json({ message: "OTP verification failed." });
  }
});

// 📌 Register User
router.post("/register", async (req, res) => {
    const { fullName, email, password, role } = req.body;
  
    try {
      // Check if the user already exists
      const existingUser = await pool.query(`SELECT * FROM "Users" WHERE email = $1`, [email]);
      if (existingUser.rows.length > 0) {
        return res.status(400).json({ message: "Email already registered!" });
      }
  
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Insert user into the database
      await pool.query(
        `INSERT INTO "Users" (full_name, email, password_hash, role) VALUES ($1, $2, $3, $4)`,
        [fullName, email, hashedPassword, role]
      );
  
      res.json({ message: "User registered successfully!" });
    } catch (error) {
      console.error("Registration Error:", error);
      res.status(500).json({ message: "Registration failed.", error: error.message });
    }
  });
  

// 📌 Login User

router.post("/login", async (req, res) => {
    const { email, password } = req.body;
  // Inside your parent-child linking endpoint

    try {
      // Check if the user exists
      const userQuery = await pool.query(`SELECT * FROM "Users" WHERE email = $1`, [email]);
  
      if (userQuery.rows.length === 0) {
        return res.status(401).json({ message: "Invalid email or password" });
      }
  
      const user = userQuery.rows[0];

      // Check if the password matches
      const passwordMatch = await bcrypt.compare(password, user.password_hash);
      if (!passwordMatch) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      // Generate JWT token
      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.SECRET_KEY, // Store in .env file
        { expiresIn: "1h" } // Token expires in 1 hour
      );

      res.json({
        message: "Login successful",
        token, // Send token to the frontend
        user: {
          id: user.id,
          fullName: user.full_name,
          email: user.email,
          role: user.role
        }
      });

    } catch (error) {
      console.error("Login Error:", error);
      res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
});

  
  

// 📌 Fetch User Data (Protected Route)
// router.get("/user/:id", async (req, res) => {
//   const userId = req.params.id;

//   try {
//     const result = await pool.query(`SELECT full_name, email, role FROM "Users" WHERE id = $1`, [userId]);
//     if (result.rows.length === 0) return res.status(404).json({ message: "User not found." });

//     res.json(result.rows[0]);
//   } catch (error) {
//     res.status(500).json({ message: "Failed to fetch user data." });
//   }
// });

router.get("/user", async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ error: "Access Denied: No Token Provided" });
        }

        const token = authHeader.split(" ")[1]; // Extract token
        const decoded = jwt.verify(token, process.env.SECRET_KEY); // Verify token

        const userQuery = await pool.query(
            `SELECT id, full_name, email, role FROM "Users" WHERE id = $1`, 
            [decoded.id]
        );

        if (userQuery.rows.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }

        res.json(userQuery.rows[0]); // Return user data
    } catch (error) {
        return res.status(401).json({ error: "Invalid or Expired Token" });
    }
});
// router.get("/user-details/:userId", async (req, res) => {
//   const { userId } = req.params;

//   try {
//     const userRes = await pool.query(
//       `SELECT id, full_name, email, role, assessment_completed FROM "Users" WHERE id = $1`,
//       [userId]
//     );
//     if (userRes.rows.length === 0)
//       return res.status(404).json({ message: "User not found" });

//     const user = userRes.rows[0];
//     const { assessment_completed, ...userBasic } = user;

//     let details = null;
//     let verifiedParent = null;
//     let verifiedChild = null;
//     let careerInterests = [];
//     let subjectInterests = [];

//     if (user.role === "student") {
//       const detailsRes = await pool.query(
//         `SELECT * FROM StudentDetails WHERE user_id = $1`,
//         [userId]
//       );
//       if (detailsRes.rows.length > 0) details = detailsRes.rows[0];

//       const careerRes = await pool.query(
//         `SELECT ci.id, ci.name FROM StudentCareerInterests sci
//          JOIN Career_interests ci ON sci.career_id = ci.id WHERE sci.user_id = $1`,
//         [userId]
//       );
//       careerInterests = careerRes.rows;

//       const subjectRes = await pool.query(
//         `SELECT si.id, si.name FROM StudentSubjectInterests ssi
//          JOIN Subject_interests si ON ssi.subject_id = si.id WHERE ssi.user_id = $1`,
//         [userId]
//       );
//       subjectInterests = subjectRes.rows;

//       const parentRes = await pool.query(
//         `SELECT u.full_name, u.email FROM ParentChildLinks p
//          JOIN "Users" u ON p.parent_id = u.id
//          WHERE p.child_id = $1 AND p.status = 'approved'`,
//         [userId]
//       );
//       if (parentRes.rows.length > 0) verifiedParent = parentRes.rows[0];
//     } else if (user.role === "parent") {
//       const detailsRes = await pool.query(
//         `SELECT * FROM ParentDetails WHERE user_id = $1`,
//         [userId]
//       );
//       if (detailsRes.rows.length > 0) details = detailsRes.rows[0];

//       const childRes = await pool.query(
//         `SELECT u.full_name, u.email FROM ParentChildLinks p
//          JOIN "Users" u ON p.child_id = u.id
//          WHERE p.parent_id = $1 AND p.status = 'approved'`,
//         [userId]
//       );
//       if (childRes.rows.length > 0) verifiedChild = childRes.rows[0];
//     } else if (user.role === "teacher") {
//       const detailsRes = await pool.query(
//         `SELECT * FROM TeacherDetails WHERE user_id = $1`,
//         [userId]
//       );
//       if (detailsRes.rows.length > 0) details = detailsRes.rows[0];
//     }

//     res.json({
//       user: userBasic,
//       details: {
//         ...details,
//         career_interest: careerInterests.map((ci) => ci.name),
//         subject_interest: subjectInterests.map((si) => si.name),
//         assessment_completed: assessment_completed, // ✅ Added here
//       },
//       verifiedParent,
//       verifiedChild,
//     });
//   } catch (error) {
//     console.error("Error fetching user details:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// });




// Save user details route
router.post("/save-user-details", async (req, res) => {
  try {
    const { userId, dob, grade, school_board, school_name, career_interest, subject_interest } = req.body;

    // Validate required fields
    if (!userId || !dob || !grade || !school_board || !school_name || !career_interest || !subject_interest) {
      return res.status(400).json({ message: "Please fill all required fields." });
    }

    // Convert arrays to JSON strings (PostgreSQL JSONB format)
    const careerInterestJSON = JSON.stringify(career_interest);
    const subjectInterestJSON = JSON.stringify(subject_interest);

    // Check if user details already exist
    const existingDetails = await pool.query("SELECT * FROM StudentDetails WHERE user_id = $1", [userId]);

    if (existingDetails.rows.length > 0) {
      // If details exist, update them
      await pool.query(
        `UPDATE StudentDetails 
         SET dob = $1, grade = $2, school_board = $3, school_name = $4, career_interest = $5, subject_interest = $6
         WHERE user_id = $7`,
        [dob, grade, school_board, school_name, careerInterestJSON, subjectInterestJSON, userId]
      );
    } else {
      // Insert new details
      await pool.query(
        `INSERT INTO StudentDetails (user_id, dob, grade, school_board, school_name, career_interest, subject_interest)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [userId, dob, grade, school_board, school_name, careerInterestJSON, subjectInterestJSON]
      );
    }

    // Update is_DetailsFilled in Users table
    await pool.query(`UPDATE "Users" SET is_DetailsFilled = TRUE WHERE id = $1`, [userId]);

    return res.status(200).json({ message: "Details saved successfully." });
  } catch (error) {
    console.error("Error saving user details:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});


// // Fetch user details based on user ID
// router.get("/user-details/:userId", async (req, res) => {
//   const { userId } = req.params;

//   try {
//     // Check if user details are filled
//     const userResult = await pool.query(`SELECT is_DetailsFilled FROM "Users" WHERE id = $1`, [userId]);
    
//     if (userResult.rows.length === 0) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     if (!userResult.rows[0].is_DetailsFilled) {
//       return res.status(200).json({ is_DetailsFilled: false });
//     }

//     // Fetch student details if is_DetailsFilled is TRUE
//     const result = await pool.query(
//       "SELECT dob, grade, school_board, school_name, career_interest, subject_interest FROM StudentDetails WHERE user_id = $1",
//       [userId]
//     );

//     if (result.rows.length > 0) {
//       res.json({ is_DetailsFilled: true, ...result.rows[0] });
//     } else {
//       res.status(404).json({ message: "Details not found" });
//     }
//   } catch (error) {
//     console.error("Error fetching user details:", error);
//     res.status(500).json({ message: "Internal server error." });
//   }
// });















// Fetch all dropdown options
router.get('/dropdown-options', async (req, res) => {
  try {
    const careerInterests = await pool.query('SELECT name FROM teacher_career_interests');
    const guidanceAreas = await pool.query('SELECT name FROM guidance_areas');
    const interactionModes = await pool.query('SELECT name FROM interaction_modes');
    const mentorshipTopics = await pool.query('SELECT name FROM mentorship_topics');
    const contributedResources = await pool.query('SELECT name FROM contributed_resources');

    res.json({
      careerInterests: careerInterests.rows.map(row => row.name),
      guidanceAreas: guidanceAreas.rows.map(row => row.name),
      interactionModes: interactionModes.rows.map(row => row.name),
      mentorshipTopics: mentorshipTopics.rows.map(row => row.name),
      contributedResources: contributedResources.rows.map(row => row.name),
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// GET teacher details
router.get('/teacher-details', async (req, res) => {
  const email = req.query.email;
  if (!email) return res.status(400).json({ error: 'Email is required' });

  try {
    // 1. Get user basic info
    const userResult = await pool.query(
      'SELECT full_name, email, role FROM "Users" WHERE email = $1',
      [email]
    );
    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = userResult.rows[0];

    // 2. Get TeacherDetails
    const teacherResult = await pool.query(
      'SELECT * FROM TeacherDetails WHERE email = $1',
      [email]
    );

    const teacherDetails = teacherResult.rows[0] || {};

    // 3. Get CareerGuidanceDetails
    const guidanceResult = await pool.query(
      'SELECT * FROM CareerGuidanceDetails WHERE email = $1',
      [email]
    );

    const guidanceDetails = guidanceResult.rows[0] || {
      mentorship_areas: [],
      interaction_modes: [],
      topics_you_can_mentor: [],
      resources_you_can_contribute: [],
    };

    res.json({
      ...user,
      ...teacherDetails,
      ...guidanceDetails,
    });
  } catch (err) {
    console.error('Error:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});
// Save or update teacher details
router.post('/save-teacher-details', async (req, res) => {
  const {
    fullName,
    email,
    phoneNumber,
    highestEducation,
    subjects,
    yearsOfExperience,
    careerInterests,
    mentorshipInterest,
    connectWithPeers,
    guidanceAreas,
    interactionModes,
    mentorshipTopics,
    contributedResources,
  } = req.body;

  try {
    // 1. Get user ID from Users table
    const userRes = await pool.query(
      'SELECT id FROM "Users" WHERE email = $1',
      [email]
    );

    if (userRes.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const userId = userRes.rows[0].id;

    // 2. Check if teacher details already exist
    const teacherRes = await pool.query(
      'SELECT id FROM teacher_details WHERE email = $1',
      [email]
    );

    let teacherId;

    if (teacherRes.rows.length > 0) {
      // Existing teacher - Update
      teacherId = teacherRes.rows[0].id;

      // Update users table to mark details filled
      await pool.query(
        `UPDATE "Users" SET is_detailsfilled = true WHERE id = $1`,
        [userId]
      );

      // Update teacher_details
      await pool.query(
        `UPDATE teacher_details SET
          full_name = $1,
          phone_number = $2,
          highest_education = $3,
          subjects = $4,
          years_of_experience = $5
        WHERE id = $6`,
        [
          fullName,
          phoneNumber,
          highestEducation,
          subjects,
          yearsOfExperience,
          teacherId,
        ]
      );

      // Update career_guidance_details
      await pool.query(
        `UPDATE career_guidance_details SET
          career_interests = $1,
          mentorship_interest = $2,
          connect_with_peers = $3,
          guidance_areas = $4,
          interaction_modes = $5,
          mentorship_topics = $6,
          contributed_resources = $7
        WHERE user_id = $8`,
        [
          careerInterests,
          mentorshipInterest,
          connectWithPeers,
          guidanceAreas,
          interactionModes,
          mentorshipTopics,
          contributedResources,
          userId,
        ]
      );
    } else {
      // New teacher - Insert

      const newTeacher = await pool.query(
        `INSERT INTO teacher_details
        (full_name, email, phone_number, highest_education, subjects, years_of_experience)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING id`,
        [
          fullName,
          email,
          phoneNumber,
          highestEducation,
          subjects,
          yearsOfExperience,
        ]
      );

      teacherId = newTeacher.rows[0].id;

      // Mark user as details-filled
      await pool.query(
        `UPDATE users SET is_detailsfilled = true WHERE id = $1`,
        [userId]
      );

      // Insert into career_guidance_details
      await pool.query(
        `INSERT INTO career_guidance_details
        (user_id, career_interests, mentorship_interest, connect_with_peers, guidance_areas, interaction_modes, mentorship_topics, contributed_resources)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [
          userId,
          careerInterests,
          mentorshipInterest,
          connectWithPeers,
          guidanceAreas,
          interactionModes,
          mentorshipTopics,
          contributedResources,
        ]
      );
    }

    res.status(200).json({ message: 'Teacher details saved successfully' });
  } catch (err) {
    console.error('Error saving teacher details:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});


const TOGETHER_AI_URL = process.env.TOGETHER_AI_URL;
const TOGETHER_AI_API_KEY =process.env.TOGETHER_AI_API_KEY;

router.post("/ask", async (req, res) => {
    const { message } = req.body;
  
    if (!message || message.trim() === "") {
        return res.status(400).json({ error: "Message cannot be empty" });
    }
  
    try {
        const response = await axios.post(
            TOGETHER_AI_URL,
            {
                model: "meta-llama/Llama-3.3-70B-Instruct-Turbo",
                messages: [
                    {
                        role: "system",
                        content: "Provide short, clear, and accurate responses. Keep answers under 3 sentences based on the input.",
                    },
                    { role: "user", content: message },
                ],
                temperature: 0.7, // Lowered for accuracy and predictability
                max_tokens: 150, // Reduced for concise answers
                top_p: 0.9,
                frequency_penalty: 0.2,
                presence_penalty: 0,
            },
            {
                headers: {
                    Authorization: `Bearer ${TOGETHER_AI_API_KEY}`,
                    "Content-Type": "application/json",
                },
            }
        );
  
        let botResponse = response.data.choices[0]?.message?.content.trim() || "No response available";
  
        // Shortening response by limiting length
        const formattedResponse = botResponse
            .split("\n")
            .filter((line) => line.trim())
            .map((line) => `• ${line.trim()}`)
            .join("\n");
  
        res.json({ response: formattedResponse });
    } catch (error) {
        console.error("API Error:", error.response ? error.response.data : error.message);
        res.status(500).json({ error: "Failed to get a response from Together AI" });
    }
  });

// // POST /api/student/self-discovery
// router.post('/self-discovery', authMiddleware, async (req, res) => {
//   const { strengths, weaknesses, hobbies, motivationFactors, careerDreams, preferredWorkStyle } = req.body;
//   await SelfDiscovery.create({ userId: req.user.id, strengths, weaknesses, hobbies, motivationFactors, careerDreams, preferredWorkStyle });
//   res.json({ message: 'Saved' });
// });



// router.get('/details', authenticateToken, async (req, res) => {
//   try {
//     const userId = req.user.id;

//     // Fetch basic user details from Users table
//     const userResult = await pool.query(
//       `SELECT id, full_name, email, role, dob FROM "Users" WHERE id = $1`,
//       [userId]
//     );

//     if (userResult.rows.length === 0) {
//       return res.status(404).json({ error: 'User not found' });
//     }

//     const user = userResult.rows[0];

//     // Fetch additional fields if role is student
//     let careerInterest = [];
//     let subjectInterest = [];

//     if (user.role === 'Student') {
//       const studentResult = await pool.query(
//         `SELECT career_interest, subject_interest FROM StudentDetails WHERE user_id = $1`,
//         [userId]
//       );

//       if (studentResult.rows.length > 0) {
//         careerInterest = studentResult.rows[0].career_interest || [];
//         subjectInterest = studentResult.rows[0].subject_interest || [];
//       }
//     }

//     return res.json({
//       id: user.id,
//       fullName: user.full_name,
//       email: user.email,
//       role: user.role,
//       dob: user.dob,
//       career_interest: careerInterest,
//       subject_interest: subjectInterest,
//     });
//   } catch (error) {
//     console.error('Error fetching user details:', error);
//     return res.status(500).json({ error: 'Server error' });
//   }
// });

// Simple test endpoint
router.get('/user/:id', (req, res) => {
  res.send(`User ID is ${req.params.id}`);
});

// Generate roadmap endpoint
router.post('/generate-roadmap', async (req, res) => {
  const { current, desired } = req.body;

  try {
    const response = await axios.post(
      TOGETHER_AI_URL,
      {
        model: 'meta-llama/Llama-3.3-70B-Instruct-Turbo-Free',
        messages: [
          {
            role: 'user',
            content: `You are a career guidance AI assisting a student currently in "${current}" who wants to become a "${desired}" in the future.

Generate a 5 to 7 step roadmap tailored to a student’s journey — focusing on subject choices, foundational skills, courses taken, activities involved, and academic and curriculm ans well as exam based.

Respond only with a valid JSON array. Each item must include:

"step": Step number with a short title (e.g., "Step 1: Explore Interests")

"description": Clear, age-appropriate guidance for that step.

✨ Focus on:

Choosing relevant subjects

Building foundational skills

Exploring career paths

Developing hobbies or joining clubs

Participating in school projects or online courses

Setting academic goals

⚠️ No intro text, explanations, or summaries.`,
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



// Helper: Extract and parse clean JSON
const extractJSON = (content) => {
  try {
    // Remove markdown code blocks if any
    if (content.startsWith("```json") || content.startsWith("```")) {
      content = content.replace(/^```json|```$/g, "").trim();
    }

    // Try to find start and end of the JSON manually
    const startIndex = content.indexOf("[");
    const endIndex = content.lastIndexOf("]") + 1;

    if (startIndex === -1 || endIndex === -1) {
      throw new Error("JSON boundaries not found");
    }

    const jsonSubstring = content.substring(startIndex, endIndex);
    return JSON.parse(jsonSubstring);
  } catch (err) {
    console.error("❌ Failed to parse JSON from model response:\n", content);
    throw new Error("Invalid JSON format returned by AI");
  }
};

// Main Question Generator
const generateAllQuestionsSinglePrompt = async (difficulty) => {
  const prompt = `You are a helpful self-discovery test generator.

Generate a total of 20 multiple-choice questions, evenly split across the following 4 categories:
1. Self-Awareness
2. Learning Style
3. Career Interest
4. Subject Preference

Requirements:
- Each category must have exactly 5 questions.
- Each question must include:
  - "question": the question text
  - "options": an array of exactly 4 short answer options
  - "answer": one correct answer from the options

Format the output as a single valid JSON array with the following structure:

[
  {
    "category": "self-awareness",
    "questions": [
      {
        "question": "Sample question?",
        "options": ["A", "B", "C", "D"],
        "answer": "A"
      }
    ]
  },
  {
    "category": "learning-style",
    "questions": [
      ...
    ]
  },
  ...
]

❗Return only the final JSON array. Do not include any explanations, markdown, or extra text.
Ensure all questions are appropriate for difficulty level: ${difficulty}.
Ensure the JSON is valid and complete.
`;

  const response = await axios.post(
    TOGETHER_AI_URL,
    {
      model: "meta-llama/Llama-3.3-70B-Instruct-Turbo-Free",
      messages: [{ role: "system", content: prompt }],
      max_tokens: 2048,
      temperature: 0.8,
    },
    {
      headers: {
        Authorization: `Bearer ${TOGETHER_AI_API_KEY}`,
        "Content-Type": "application/json",
      },
    }
  );

  const content = response.data.choices?.[0]?.message?.content?.trim();

  if (!content) {
    throw new Error("Empty response from Together AI");
  }

  return extractJSON(content);
};

// Express Route
router.post("/generate-psychometric", async (req, res) => {
  try {
    const { dob } = req.body;

    if (!dob) {
      return res.status(400).json({ success: false, error: "DOB is required" });
    }

    const age = new Date().getFullYear() - new Date(dob).getFullYear();
    const difficulty = age + 2;

    const questions = await generateAllQuestionsSinglePrompt(difficulty);
    res.json({ success: true, message: "Questions generated successfully", questions });
  } catch (err) {
    console.error("🚨 Generation error:", err.message);
    res.status(500).json({ success: false, error: "Failed to generate questions" });
  }
});


// 🔍 Analyze Responses with AI
async function analyzeResponsesWithAI(responses) {
  const prompt = `
Analyze the following user responses to psychometric questions.
Generate a category-wise analysis in JSON format. Each category should include:
- category the generating categories for json should exactly be in this name (string) "Self awareness","Learning Style","Career interest","Subject preference"
- score (1-100, number) based on their ability
- description (string, simple and easy to understand)

User responses: ${JSON.stringify(responses)}
Respond strictly in JSON format:
[
  {
    "category": "",
    "score": number,
    "description": "string"
  }
]
  `;

  try {
    const response = await axios.post(
      TOGETHER_AI_URL,
      {
        model: "meta-llama/Llama-3.3-70B-Instruct-Turbo-Free",
        messages: [{ role: "system", content: prompt }],
        max_tokens: 1024,
        temperature: 0.7,
        top_p: 0.9,
      },
      {
        headers: {
          Authorization: `Bearer ${TOGETHER_AI_API_KEY}`,
        },
      }
    );

    const rawContent = response.data.choices[0].message.content.trim();
    const cleanContent = rawContent.replace(/^```json|```$/g, "").trim();

    return JSON.parse(cleanContent);
  } catch (error) {
    console.error("Error analyzing responses:", error?.response?.data || error);
    throw new Error("Failed to analyze responses");
  }
}

// 🧠 API: Analyze User Responses
router.post("/analyze-responses", async (req, res) => {
  const { responses } = req.body;

  if (!responses || Object.keys(responses).length === 0) {
    return res.status(400).json({ error: "No responses submitted" });
  }

  try {
    const analysisResult = await analyzeResponsesWithAI(responses);
    res.json({ report: analysisResult });
  } catch (error) {
    res.status(500).json({ error: "Failed to analyze responses" });
  }
});


router.post("/save-psychometric-results", async (req, res) => {
  const { user_id, analysis } = req.body;

  if (!user_id || !analysis) {
    return res.status(400).json({ success: false, error: "Missing data." });
  }

  try {
    const mapped = {};
    analysis.forEach((item) => {
      const key = item.category.toLowerCase().replace(/ /g, "_"); // e.g., "Self Awareness" -> "self_awareness"
      mapped[`${key}_score`] = item.score;
      mapped[`${key}_insight`] = item.description;
    });

    const existing = await pool.query(
      "SELECT * FROM psychometricresults WHERE user_id = $1",
      [user_id]
    );

    if (existing.rows.length > 0) {
      // Update existing results
      await pool.query(
        `UPDATE psychometricresults SET 
          self_awareness_score = $1,
          self_awareness_insight = $2,
          learning_style_score = $3,
          learning_style_insight = $4,
          career_interest_score = $5,
          career_interest_insight = $6,
          subject_preference_score = $7,
          subject_preference_insight = $8,
          completed = true
        WHERE user_id = $9`,
        [
          mapped.self_awareness_score,
          mapped.self_awareness_insight,
          mapped.learning_style_score,
          mapped.learning_style_insight,
          mapped.career_interest_score,
          mapped.career_interest_insight,
          mapped.subject_preference_score,
          mapped.subject_preference_insight,
          user_id,
        ]
      );
    } else {
      // Insert new results
      await pool.query(
        `INSERT INTO psychometricresults (
          user_id,
          self_awareness_score, self_awareness_insight,
          learning_style_score, learning_style_insight,
          career_interest_score, career_interest_insight,
          subject_preference_score, subject_preference_insight,
          completed
        ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
        [
          user_id,
          mapped.self_awareness_score,
          mapped.self_awareness_insight,
          mapped.learning_style_score,
          mapped.learning_style_insight,
          mapped.career_interest_score,
          mapped.career_interest_insight,
          mapped.subject_preference_score,
          mapped.subject_preference_insight,
          true,
        ]
      );
    }

    // Mark assessment completed in Users table
    await pool.query(
      `UPDATE "Users" SET assessment_completed = true WHERE id = $1`,
      [user_id]
    );

    // Fetch user info
    const userInfo = await pool.query(
      `SELECT id, full_name, role, email FROM "Users" WHERE id = $1`,
      [user_id]
    );

    return res.json({
      success: true,
      message: "Psychometric results saved successfully.",
      user: userInfo.rows[0],
    });
  } catch (err) {
    console.error("Error saving psychometric results:", err);
    res.status(500).json({ success: false, error: "Database error." });
  }
});

router.get("/user-details/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    // Fetch user from Users table
    const userRes = await pool.query(
      `SELECT id, full_name, email, role, assessment_completed, is_detailsfilled FROM "Users" WHERE id = $1`,
      [userId]
    );

    if (userRes.rows.length === 0)
      return res.status(404).json({ message: "User not found" });

    const user = userRes.rows[0];
    const { assessment_completed, is_detailsfilled, ...userBasic } = user;

    if (!is_detailsfilled) {
      return res.status(200).json({
        is_detailsfilled: false,
        user: userBasic,
      });
    }

    let details = null;
    let verifiedParent = null;
    let verifiedChild = null;

    if (user.role === "student") {
      // ✅ Get all student details including career/subject interests
      const detailsRes = await pool.query(
        `SELECT * FROM StudentDetails WHERE user_id = $1`,
        [userId]
      );
      if (detailsRes.rows.length > 0) details = detailsRes.rows[0];

      // ✅ Get parent info if approved
      const parentRes = await pool.query(
        `SELECT u.full_name, u.email FROM ParentChildLinks p
         JOIN "Users" u ON p.parent_id = u.id
         WHERE p.child_id = $1 AND p.status = 'approved'`,
        [userId]
      );
      if (parentRes.rows.length > 0) verifiedParent = parentRes.rows[0];
    }

    // You can keep parent and teacher logic unchanged
    else if (user.role === "parent") {
      const detailsRes = await pool.query(
        `SELECT * FROM ParentDetails WHERE user_id = $1`,
        [userId]
      );
      if (detailsRes.rows.length > 0) details = detailsRes.rows[0];

      const childRes = await pool.query(
        `SELECT u.full_name, u.email FROM ParentChildLinks p
         JOIN "Users" u ON p.child_id = u.id
         WHERE p.parent_id = $1 AND p.status = 'approved'`,
        [userId]
      );
      if (childRes.rows.length > 0) verifiedChild = childRes.rows[0];
    } else if (user.role === "teacher") {
      const detailsRes = await pool.query(
        `SELECT * FROM TeacherDetails WHERE user_id = $1`,
        [userId]
      );
      if (detailsRes.rows.length > 0) details = detailsRes.rows[0];
    }

    return res.status(200).json({
      is_detailsfilled: true,
      user: userBasic,
      details: {
        ...details,
        assessment_completed,
      },
      verifiedParent,
      verifiedChild,
    });
  } catch (error) {
    console.error("Error fetching user details:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Backend Route to fetch self-discovery analysis
router.get("/self-discovery/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const result = await pool.query(
      `SELECT 
         self_awareness_score, self_awareness_insight,
         learning_style_score, learning_style_insight,
         career_interest_score, career_interest_insight,
         subject_preference_score, subject_preference_insight,
         created_at
       FROM psychometricresults 
       WHERE user_id = $1 
       ORDER BY created_at DESC 
       LIMIT 1`,
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "No self-discovery analysis found for this student." });
    }

    return res.status(200).json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.error("Error fetching self-discovery analysis:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});



// 🧠 Function to call Together AI
const generateCareerPlan = async (subjects) => {
  const prompt = `
A student has selected these core subjects: ${subjects.join(", ")}.
Based on this, suggest the top 5 potential career paths.

For each career path, provide the following details:
- A simple reason why it's a good fit for the selected subjects
- The average salary (in INR per year, approximate)
- The exam eligibility (minimum qualification needed)
- The common entrance exams (if any)
- Some top companies that hire for this career
- Common roles or job titles in this field

Respond ONLY in the following JSON array format:
[
  {
    "career": "Career Title",
    "reason": "Simple reason why it's a good fit",
    "salary": "₹X,XX,XXX per year",
    "exam_eligibility": "Minimum qualification required",
    "entrance_exams": ["Exam 1", "Exam 2"],
    "companies": ["Company A", "Company B"],
    "roles": ["Role 1", "Role 2"]
  }
]

Only return a valid JSON array without any extra text or explanation.

`;

  try {
    const res = await axios.post(
      TOGETHER_AI_URL,
      {
        model: 'meta-llama/Llama-3.3-70B-Instruct-Turbo-Free',
        messages: [{ role: "user", content: prompt }],
        max_tokens: 2048,
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.TOGETHER_AI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const content = res.data.choices[0].message.content;

    // 🧼 Try to safely parse JSON even if it comes with extra characters
    const startIdx = content.indexOf("[");
    const endIdx = content.lastIndexOf("]");
    const jsonString = content.slice(startIdx, endIdx + 1);

    return JSON.parse(jsonString);
  } catch (err) {
    console.error("Error fetching from Together AI:", err.message);
    return [
      {
        career: "Error",
        reason: "Failed to generate career plan. Check API or try again.",
        steps: ["Ensure API key is correct", "Check internet", "Retry later"]
      }
    ];
  }
};

// 🚀 POST route to generate plan
router.post("/generate-dynamic-career-plan", async (req, res) => {
  const { subjects } = req.body;

  if (!subjects || !subjects.length) {
    return res.status(400).json({ message: "Subjects are required." });
  }

  try {
    const careers = await generateCareerPlan(subjects);
    res.json({ careers });
  } catch (err) {
    console.error("Route error:", err.message);
    res.status(500).json({ message: "Server error generating plan." });
  }
});



const NodeCache = require("node-cache");
const cache = new NodeCache({ stdTTL: 60 * 60 });

const getPrompt = (module, details) => {
  return `
You are a psychometric test creator for students. Based on the following student profile and test module, generate 5 unique multiple-choice questions. Each question should assess the student based on the module’s theme and include 4 meaningful options.

Student Profile:
- Name: ${details.full_name}
- Grade: ${details.grade}
- School Board: ${details.school_board}
- School Name: ${details.school_name}
- Subject Interests: ${details.subject_interest?.join(", ")}
- Career Interests: ${details.career_interest?.join(", ")}

Current Module: ${module}

Instructions:
- The questions should reflect the student's interests and background.
- Use a variety of cognitive, behavioral, and scenario-based formats.
- Each question must be unique and related to the module "${module}".
- Avoid repetition from past questions.
- Return the response in JSON format like:
[
  {
    "question": "string",
    "options": ["option1", "option2", "option3", "option4"]
  }
]
`;
};


const questionCache = {};
// Route: /api/generate-psychometric-new
router.post("/generate-psychometric-new", async (req, res) => {
  const { module, userId } = req.body;

  try {
    // Fetch student details from DB
    const userResponse = await axios.get(`http://localhost:5000/api/user-details/${userId}`);
    const details = userResponse.data.details;
    const key = `${userId}-${module}`;

    // If questions already exist, return them
    if (questionCache[key]) {
      return res.json({ questions: questionCache[key] });
    }

    const prompt = getPrompt(module, details);

    const aiResponse = await axios.post(
      TOGETHER_AI_URL, // or OpenAI endpoint
      {
        model: "meta-llama/Llama-3.3-70B-Instruct-Turbo-Free", // or your preferred Together AI model
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7
      },
      {
        headers: {
          Authorization: `Bearer ${TOGETHER_AI_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    const messageContent = aiResponse.data.choices[0].message.content;

    let questions = [];
    try {
      questions = JSON.parse(messageContent);
    } catch (err) {
      console.error("AI Response was not valid JSON:", messageContent);
      return res.status(400).json({ error: "Failed to parse AI response." });
    }

    if (!questions.length) {
      return res.status(400).json({ error: "No questions generated." });
    }

    // Cache to avoid duplicates
    questionCache[key] = questions;

    res.json({ questions });
  } catch (err) {
    console.error("Error generating questions:", err);
    res.status(500).json({ error: "No more unique questions available for this module." });
  }
});


// 💾 Save Module Responses
router.post("/save-module", async (req, res) => {
  const { module, responses } = req.body;
  if (!module || !Array.isArray(responses)) {
    return res.status(400).json({ error: "Module and responses are required" });
  }
  try {
    console.log(`✅ Saved responses for ${module}:`, responses);
    return res.json({ success: true });
  } catch (err) {
    console.error("Error saving responses:", err.message);
    return res.status(500).json({ error: "Failed to save responses" });
  }
});



// 📊 Analyze Results
router.post("/analyze-psychometric-results", async (req, res) => {
  const { moduleScores, studentName, userId } = req.body;

  if (!studentName || !userId || !Array.isArray(moduleScores)) {
    return res.status(400).json({ error: "Invalid input for analysis." });
  }

  const reportPrompt = `Generate a short and professional AI-based psychometric analysis report for a student named "${studentName}". 
Use the following module scores (out of 100) to describe their cognitive, personality, emotional ,problem-solving,decision making,leadership,stress management,risk taking, adaptability,subject interest, career interest, and softskill orientation traits:

${moduleScores.map(s => `${s.module}: ${s.score}`).join("\n")}

Return ONLY valid JSON like this (NO markdown formatting, NO explanation, NO triple backticks):
{
  "overall_analysis": "Brief paragraph analyzing the overall psychometric profile.",
  "categories": [
    {
      "module": "Module Name",
      "score": 87,
      "analysis": "Short paragraph about performance in this module."
    }
  ]
}
`;

  try {
    const response = await axios.post(
      TOGETHER_AI_URL,
      {
        model: "meta-llama/Llama-3.3-70B-Instruct-Turbo-Free",
        messages: [{ role: "user", content: reportPrompt }],
        max_tokens: 2048,
      },
      {
        headers: { Authorization: `Bearer ${TOGETHER_AI_API_KEY}` },
      }
    );

    let content = response.data.choices[0].message.content.trim();

    // 🔧 Remove triple backticks if present
    if (content.startsWith("```")) {
      content = content.replace(/```(?:json)?/g, "").trim();
    }

    const parsed = JSON.parse(content);

    await pool.query(
      `INSERT INTO PsychometricTestResults (user_id, overall_analysis, category_results) VALUES ($1, $2, $3)`,
      [userId, parsed.overall_analysis, JSON.stringify(parsed.categories)]
    );

    return res.json(parsed);
  } catch (err) {
    console.error("Error generating psychometric report:", err.message);
    if (err.response?.status === 429) {
      return res.status(429).json({ error: "Rate limit exceeded. Please try again later." });
    }
    return res.status(500).json({ error: "Failed to generate report" });
  }
});

module.exports = router;
