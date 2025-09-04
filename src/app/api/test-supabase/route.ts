import { NextRequest, NextResponse } from "next/server";
import { supabase } from "../../../lib/supabaseClient";
import { requireAuth } from "../../../lib/requireAuth";

export async function GET() {
  // Require authentication
  const user = requireAuth(arguments[0]);
  if (!user || user instanceof NextResponse) return user;
  const { data, error } = await supabase
    .from("test_table")
    .select("*");
  if (error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  return NextResponse.json(data, { status: 200 });
}

export async function POST(request: NextRequest) {
  // Require authentication
  const user = requireAuth(request);
  if (!user || user instanceof NextResponse) return user;
  const { name } = await request.json();
  const { data, error } = await supabase
    .from("test_table")
    .insert([{ name }])
    .select();
  if (error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  return NextResponse.json(data, { status: 201 });
}

export async function PUT(request: NextRequest) {
  // Require authentication
  const user = requireAuth(request);
  if (!user || user instanceof NextResponse) return user;
  const { id, name } = await request.json();
  const { data, error } = await supabase
    .from("test_table")
    .update({ name })
    .eq("id", id)
    .select();
  if (error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  return NextResponse.json(data, { status: 200 });
}

export async function DELETE(request: NextRequest) {
  // Require authentication
  const user = requireAuth(request);
  if (!user || user instanceof NextResponse) return user;
  const { id } = await request.json();
  const { data, error } = await supabase
    .from("test_table")
    .delete()
    .eq("id", id)
    .select();
  if (error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  return NextResponse.json(data, { status: 200 });
}
