import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import {
  DEFAULT_STORE_CUSTOMIZATIONS,
  StoreCustomizations,
} from "@/data/storeSettings";

const dataFilePath = path.join(
  process.cwd(),
  "data",
  "store-customizations.json"
);

function readCustomizations(): StoreCustomizations {
  try {
    if (!fs.existsSync(dataFilePath)) {
      fs.writeFileSync(
        dataFilePath,
        JSON.stringify(DEFAULT_STORE_CUSTOMIZATIONS, null, 2),
        "utf8"
      );
      return DEFAULT_STORE_CUSTOMIZATIONS;
    }
    const raw = fs.readFileSync(dataFilePath, "utf8");
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_STORE_CUSTOMIZATIONS,
      ...(parsed && typeof parsed === "object" ? parsed : {}),
    };
  } catch (err) {
    console.warn("Could not read store-customizations.json:", err);
    return DEFAULT_STORE_CUSTOMIZATIONS;
  }
}

function writeCustomizations(customizations: StoreCustomizations): void {
  try {
    fs.writeFileSync(
      dataFilePath,
      JSON.stringify(customizations, null, 2),
      "utf8"
    );
  } catch (err) {
    console.error("Failed to write store-customizations.json:", err);
  }
}

export async function GET() {
  try {
    const data = readCustomizations();
    return NextResponse.json({ success: true, customizations: data });
  } catch (err: any) {
    console.error("[Customizations GET Error]:", err);
    return NextResponse.json(
      { success: false, error: err?.message || "Failed to load store customizations" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (body.reset === true) {
      writeCustomizations(DEFAULT_STORE_CUSTOMIZATIONS);
      return NextResponse.json({
        success: true,
        customizations: DEFAULT_STORE_CUSTOMIZATIONS,
        message: "Reset to default factory settings",
      });
    }

    const current = readCustomizations();
    const updated: StoreCustomizations = {
      ...current,
      ...body,
    };

    writeCustomizations(updated);

    return NextResponse.json({
      success: true,
      customizations: updated,
      message: "Customizations saved successfully",
    });
  } catch (err: any) {
    console.error("[Customizations POST Error]:", err);
    return NextResponse.json(
      { success: false, error: err?.message || "Failed to save customizations" },
      { status: 500 }
    );
  }
}
