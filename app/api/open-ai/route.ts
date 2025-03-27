import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { GoogleAIFileManager, FileState } from '@google/generative-ai/server';
import * as fs from 'fs';
import * as file from 'fs/promises'
import * as path from 'path';
import * as os from 'os';
import OpenAI from 'openai';

export async function POST(request: NextRequest) {
    try {
        const openai = new OpenAI({
            apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
        });
        const formData = await request.formData();
        const audioFile = formData.get('audio') as File;

        if (!audioFile) {
            return NextResponse.json({ error: 'No audio file provided' }, { status: 400 });
        }

        // Create a temporary file
        const tempDir = os.tmpdir();
        const tempFilePath = path.join(tempDir, `audio_${Date.now()}.mp3`);

        // Convert File to ArrayBuffer and then to Buffer
        const arrayBuffer = await audioFile.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Write to temporary file
        await file.writeFile(tempFilePath, buffer);


        const transcription = await openai.audio.transcriptions.create({
            file: fs.createReadStream(tempFilePath),
            model: "whisper-1",
        });



        // Clean up temporary file
        await file.unlink(tempFilePath);
        // Return the processed file data
        return NextResponse.json(transcription.text);
    } catch (error) {
        console.error('Error processing audio:', error);
        return NextResponse.json({
            error: 'Failed to process audio',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}