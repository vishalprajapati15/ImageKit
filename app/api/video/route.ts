import { authOptions } from "@/lib/auth";
import { connectionToDB } from "@/lib/db";
import Video, { Ivideo } from "@/models/video.models";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
    try {
        await connectionToDB();
        const videos = await Video.find({}).sort({ createdAt: -1 }).lean();
        if (!videos || videos.length === 0) {
            return NextResponse.json(
                {
                    success: true,
                    videos: [],
                    message: "Videos Not found!!"
                }, { status: 200 }
            );
        }
        return NextResponse.json(
            {
                success: true,
                videos,
                message: "Videos fetched successfully!!"
            },
            { status: 200 }
        );
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            {
                success: false,
                error: "Failed to fetch videos!!"
            },
            { status: 500 }
        );
    }
}


export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Unauthorized !!"
                },
                { status: 401 }
            );
        }

        await connectionToDB();

        const body: Ivideo = await request.json();

        if (
            !body.title ||
            !body.description ||
            !body.videoUrl ||
            !body.thumbnailUrl
        ) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Missing required fields!!"
                },
                { status: 400 }
            );
        }

        const videoData = {
            ...body,
            controls: body?.controls ?? true,
            transformation: {
                height: 1920,
                width: 1080,
                quality: body.transformation?.quality ?? 100
            }
        }

        const newVideo = await Video.create(videoData);

        return NextResponse.json(
            {
                success: true,
                newVideo,
                message: "Video uploaded successfully!!"
            },
            { status: 201 }
        );

    } catch (error) {
        console.error(error);
        return NextResponse.json(
            {
                success: false,
                error: "Failed to create video!!"
            },
            { status: 500 }
        );
    }
}