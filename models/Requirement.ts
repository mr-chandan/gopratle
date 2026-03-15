import mongoose, { Model, Schema } from "mongoose";

type HireType = "planner" | "performer" | "crew";

interface RequirementDocument {
  event: {
    name: string;
    type: string;
    dateMode: "single" | "range";
    startDate: string;
    endDate?: string | null;
    location: string;
    venue?: string | null;
  };
  hireType: HireType;
  requirementDetails: {
    planner?: {
      plannerScope: "full-service" | "day-coordination" | "consultation";
      planningBudget: string;
    };
    performer?: {
      performerCategory: "dj" | "live-band" | "singer" | "other";
      performerCount: number;
    };
    crew?: {
      crewCategory: "photography" | "videography" | "catering" | "decor";
      crewSize: number;
    };
  };
  createdAt: Date;
  updatedAt: Date;
}

const requirementSchema = new Schema<RequirementDocument>(
  {
    event: {
      name: { type: String, required: true, trim: true },
      type: { type: String, required: true, trim: true },
      dateMode: { type: String, enum: ["single", "range"], required: true },
      startDate: { type: String, required: true },
      endDate: { type: String, default: null },
      location: { type: String, required: true, trim: true },
      venue: { type: String, default: null, trim: true },
    },
    hireType: {
      type: String,
      enum: ["planner", "performer", "crew"],
      required: true,
      index: true,
    },
    requirementDetails: {
      planner: {
        plannerScope: {
          type: String,
          enum: ["full-service", "day-coordination", "consultation"],
        },
        planningBudget: { type: String, trim: true },
      },
      performer: {
        performerCategory: {
          type: String,
          enum: ["dj", "live-band", "singer", "other"],
        },
        performerCount: { type: Number, min: 1 },
      },
      crew: {
        crewCategory: {
          type: String,
          enum: ["photography", "videography", "catering", "decor"],
        },
        crewSize: { type: Number, min: 1 },
      },
    },
  },
  { timestamps: true }
);

const RequirementModel: Model<RequirementDocument> =
  (mongoose.models.Requirement as Model<RequirementDocument>) ||
  mongoose.model<RequirementDocument>("Requirement", requirementSchema);

export default RequirementModel;
