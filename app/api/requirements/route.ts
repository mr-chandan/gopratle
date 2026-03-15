import { NextResponse } from "next/server";

import { connectToDatabase } from "@/lib/mongodb";
import RequirementModel from "@/models/Requirement";

export const runtime = "nodejs";

type HireType = "planner" | "performer" | "crew";

type RequirementRequestBody = {
  event?: {
    name?: string;
    type?: string;
    dateMode?: "single" | "range";
    startDate?: string;
    endDate?: string | null;
    location?: string;
    venue?: string | null;
  };
  hireType?: HireType;
  requirementDetails?: Record<string, unknown>;
};

function badRequest(message: string) {
  return NextResponse.json({ success: false, error: message }, { status: 400 });
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as RequirementRequestBody;

    if (!body.event?.name || !body.event?.type) {
      return badRequest("Event name and event type are required.");
    }

    if (!body.event?.dateMode || !body.event?.startDate || !body.event?.location) {
      return badRequest("Event date and location are required.");
    }

    if (body.event.dateMode === "range" && !body.event.endDate) {
      return badRequest("End date is required for date range.");
    }

    if (!body.hireType) {
      return badRequest("hireType is required.");
    }

    const details = body.requirementDetails ?? {};
    const requirementDetails: {
      planner?: Record<string, unknown>;
      performer?: Record<string, unknown>;
      crew?: Record<string, unknown>;
    } = {};

    if (body.hireType === "planner") {
      requirementDetails.planner = details;
    }

    if (body.hireType === "performer") {
      requirementDetails.performer = {
        ...details,
        performerCount: Number(details.performerCount ?? 0),
      };
    }

    if (body.hireType === "crew") {
      requirementDetails.crew = {
        ...details,
        crewSize: Number(details.crewSize ?? 0),
      };
    }

    await connectToDatabase();

    const requirement = await RequirementModel.create({
      event: {
        name: body.event.name.trim(),
        type: body.event.type.trim(),
        dateMode: body.event.dateMode,
        startDate: body.event.startDate,
        endDate: body.event.dateMode === "range" ? body.event.endDate : null,
        location: body.event.location.trim(),
        venue: body.event.venue ?? null,
      },
      hireType: body.hireType,
      requirementDetails,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Requirement posted successfully.",
        data: {
          id: requirement._id,
          hireType: requirement.hireType,
        },
      },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { success: false, error: "Unable to save requirement." },
      { status: 500 }
    );
  }
}
