import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// age: string | null
//           created_at: string
//           education: string | null
//           gender: string | null
//           id: number
//           income: string | null
//           institute: string | null
//           non_replacement_reason: string | null
//           ocupation: string | null
//           posthetic_type_need: string | null
//           prosthetic_need: string | null
//           prosthetic_status: string | null
//           reason: string | null
//           replacement_reason: string | null
//           socio_economic_class: string | null
//           toothloss: string | null
//           visited: string | null

export const dynamic = "force-dynamic";
export async function POST(request: Request) {
  const {
    age,
    education,
    gender,
    income,
    institute,
    non_replacement_reason,
    ocupation,
    posthetic_type_need,
    prosthetic_need,
    prosthetic_status,
    reason,
    replacement_reason,
    socio_economic_class,
    toothloss,
    visited,
  } = await request.json();

  const supbaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
  try {
    let { data: response, error } = await supbaseAdmin
      .from("responses")
      .insert({
        age,
        education,
        gender,
        income,
        institute,
        non_replacement_reason,
        ocupation,
        posthetic_type_need,
        prosthetic_need,
        prosthetic_status,
        reason,
        replacement_reason,
        socio_economic_class,
        toothloss,
        visited,
      });

    if (error) {
      return NextResponse.json({ message: error.message }, { status: 400 });
    } else {
      return NextResponse.json({ response }, { status: 200 });
    }
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error }, { status: 400 });
  }
}
