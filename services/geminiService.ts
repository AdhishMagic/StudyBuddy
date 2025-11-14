import { GoogleGenAI, Modality, Type } from "@google/genai";
import type { StudyPlanRequest, StudyPlan } from '../types';

export const generateStudyPlan = async (request: StudyPlanRequest): Promise<StudyPlan> => {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set. Please configure it.");
  }
  
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const subjectList = request.subjects.map(s => s.name).join(', ');
  const today = new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD format
  
  const responseSchema = {
    type: Type.OBJECT,
    properties: {
        summary: { type: Type.STRING, description: "A brief, motivational summary of the plan, including total days and hours." },
        schedule: {
            type: Type.ARRAY,
            description: "The week-by-week and day-by-day study schedule.",
            items: {
                type: Type.OBJECT,
                properties: {
                    week: { type: Type.INTEGER, description: "The week number of the study plan." },
                    day: { type: Type.STRING, description: "The day of the week (e.g., 'Monday')." },
                    date: { type: Type.STRING, description: "The specific date in YYYY-MM-DD format." },
                    tasks: {
                        type: Type.ARRAY,
                        description: "A list of tasks or topics for the day.",
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                subject: { type: Type.STRING, description: "The subject for this study block." },
                                topic: { type: Type.STRING, description: "The specific topic or activity for this block (e.g., 'Chapter 1 Review', 'Practice Problems')." },
                            },
                             required: ['subject', 'topic']
                        }
                    }
                },
                required: ['week', 'day', 'date', 'tasks']
            }
        },
        studyTips: { type: Type.STRING, description: "A bulleted list of 3-5 actionable study tips." },
        detailedPlanText: { type: Type.STRING, description: "The full, original, detailed study plan formatted in Markdown. This should be comprehensive and well-structured." }
    },
    required: ['summary', 'schedule', 'studyTips', 'detailedPlanText']
  };

  const prompt = `
    You are an expert academic planner called StudyBuddy. Your task is to create a detailed, personalized, and realistic study plan for a student and return it as a JSON object matching the provided schema.

    **Student's Input:**
    - **Exam Name:** ${request.examName}
    - **Exam Date:** ${request.examDate}
    - **Subjects to Study:** ${subjectList}
    - **Available Study Hours Per Day:** ${request.studyHoursPerDay} hours

    **Your Task:**
    Generate a complete JSON object that fulfills the following requirements:
    1.  **summary**: Write a motivational opening and a summary of the plan (total days, total hours).
    2.  **schedule**: Create a structured, week-by-week, day-by-day schedule.
        - Calculate the total number of days available from today (${today}) until the day before the exam.
        - For each day in the plan, create an object with the week number, day of the week, date, and a list of tasks.
        - Each task should be an object with a 'subject' and 'topic'.
        - Allocate daily study hours among 1-2 subjects for deep focus. Ensure all subjects get adequate coverage.
        - The final week should be dedicated to revision, mock tests, and past papers.
    3.  **studyTips**: Provide a concise, bullet-point list of actionable study tips.
    4.  **detailedPlanText**: Generate a separate, comprehensive study plan formatted using Markdown. This text version should be well-structured with headings, subheadings, and bullet points, explaining the schedule in a human-readable format, including the summary, weekly breakdown, daily tasks, revision strategy, and study tips. This is a separate deliverable from the structured schedule data.

    Please generate the complete JSON object now.
    `;

  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema,
        }
    });
    const jsonText = response.text.trim();
    // Validate that the response is not empty
    if (!jsonText) {
        throw new Error("The AI model returned an empty response.");
    }
    // The response text should already be a valid JSON string
    return JSON.parse(jsonText) as StudyPlan;

  } catch (error) {
    console.error("Error generating or parsing study plan:", error);
    if (error instanceof SyntaxError) {
        throw new Error("The AI model returned a malformed plan. Please try generating it again.");
    }
    if (error instanceof Error && error.message.includes('API key not valid')) {
        throw new Error("The provided API key is invalid. Please check your configuration.");
    }
    throw new Error("Failed to communicate with the AI model. Please try again later.");
  }
};

export const generateMotivationalSpeech = async (): Promise<string> => {
    if (!process.env.API_KEY) {
        throw new Error("API_KEY environment variable not set. Please configure it.");
    }

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const model = "gemini-2.5-flash-preview-tts";
    
    const prompt = 'Say a short, uplifting motivational quote for a student who is studying hard. Be cheerful and encouraging.';

    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: [{ parts: [{ text: prompt }] }],
            config: {
                responseModalities: [Modality.AUDIO],
                speechConfig: {
                    voiceConfig: {
                        prebuiltVoiceConfig: { voiceName: 'Kore' },
                    },
                },
            },
        });
        
        const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
        if (!base64Audio) {
            throw new Error("No audio data received from the API.");
        }
        return base64Audio;

    } catch (error) {
        console.error("Error generating motivational speech:", error);
        if (error instanceof Error && error.message.includes('API key not valid')) {
            throw new Error("The provided API key is invalid. Please check your configuration.");
        }
        throw new Error("Failed to generate motivational speech. Please try again later.");
    }
};
