import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { GoogleAIFileManager, FileState } from '@google/generative-ai/server';
import * as fs from 'fs/promises';
import * as path from 'path';
import * as os from 'os';

const fileManager = new GoogleAIFileManager(process.env.NEXT_PUBLIC_GA_KEY || "");
const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GA_KEY || "");

export async function POST(request: NextRequest) {
    try {
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
        await fs.writeFile(tempFilePath, buffer);

        // Upload to Google AI using the file path
        const uploadResult = await fileManager.uploadFile(
            tempFilePath,
            {
                mimeType: audioFile.type,
                displayName: `audio_${Date.now()}`,
            }
        );


        // Clean up temporary file
        await fs.unlink(tempFilePath);
        // Return the processed file data
        return NextResponse.json(uploadResult.file);
    } catch (error) {
        console.error('Error processing audio:', error);
        return NextResponse.json({
            error: 'Failed to process audio',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}