import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";
export async function GET() {
  const supbaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
  try {
    let { data: total } = await supbaseAdmin.from("responses").select();
    let { data: males } = await supbaseAdmin
      .from("responses")
      .select()
      .eq("gender", "Male");
    let { data: females } = await supbaseAdmin
      .from("responses")
      .select()
      .eq("gender", "Female");
    let { data: prosthetic_need_for_classes } = await supbaseAdmin
      .from("responses")
      .select("prosthetic_need,socio_economic_class");
    const association_of_prosthetic_needs_with_class: any = {};
    if (prosthetic_need_for_classes)
      prosthetic_need_for_classes.forEach((item: any) => {
        const socioEconomicClass = item.socio_economic_class;
        const prostheticNeed = item.prosthetic_need;

        if (!association_of_prosthetic_needs_with_class[socioEconomicClass]) {
          association_of_prosthetic_needs_with_class[socioEconomicClass] = {
            total: 0,
            counts: {},
          };
        }
        if (
          !association_of_prosthetic_needs_with_class[socioEconomicClass]
            .counts[prostheticNeed]
        ) {
          association_of_prosthetic_needs_with_class[socioEconomicClass].counts[
            prostheticNeed
          ] = 0;
        }

        association_of_prosthetic_needs_with_class[socioEconomicClass].total++;
        association_of_prosthetic_needs_with_class[socioEconomicClass].counts[
          prostheticNeed
        ]++;
      });

    let { data: prosthetic_status_for_classes } = await supbaseAdmin
      .from("responses")
      .select("prosthetic_status,socio_economic_class");
    const association_of_prosthetic_status_with_class: any = {};
    if (prosthetic_status_for_classes)
      prosthetic_status_for_classes.forEach((item: any) => {
        const socioEconomicClass = item.socio_economic_class;
        const prostheticStatus = item.prosthetic_status;

        if (!association_of_prosthetic_status_with_class[socioEconomicClass]) {
          association_of_prosthetic_status_with_class[socioEconomicClass] = {
            total: 0,
            counts: {},
          };
        }
        if (
          !association_of_prosthetic_status_with_class[socioEconomicClass]
            .counts[prostheticStatus]
        ) {
          association_of_prosthetic_status_with_class[
            socioEconomicClass
          ].counts[prostheticStatus] = 0;
        }

        association_of_prosthetic_status_with_class[socioEconomicClass].total++;
        association_of_prosthetic_status_with_class[socioEconomicClass].counts[
          prostheticStatus
        ]++;
      });

    let { data: non_replacement_reason_for_classes } = await supbaseAdmin
      .from("responses")
      .select("non_replacement_reason,socio_economic_class");
    const association_of_non_replacement_reason_for_classes: any = {};
    if (non_replacement_reason_for_classes)
      non_replacement_reason_for_classes.forEach((item: any) => {
        const socioEconomicClass = item.socio_economic_class;
        const non_replacement_reason = item.non_replacement_reason;

        if (
          !association_of_non_replacement_reason_for_classes[socioEconomicClass]
        ) {
          association_of_non_replacement_reason_for_classes[
            socioEconomicClass
          ] = {
            total: 0,
            counts: {},
          };
        }
        if (
          !association_of_non_replacement_reason_for_classes[socioEconomicClass]
            .counts[non_replacement_reason]
        ) {
          association_of_non_replacement_reason_for_classes[
            socioEconomicClass
          ].counts[non_replacement_reason] = 0;
        }

        association_of_non_replacement_reason_for_classes[socioEconomicClass]
          .total++;
        association_of_non_replacement_reason_for_classes[socioEconomicClass]
          .counts[non_replacement_reason]++;
      });

    //   Association between Prosthetic Need and Reason for Non-replacement

    let { data: prosthetic_need_for_non_replacement_reason } =
      await supbaseAdmin
        .from("responses")
        .select("prosthetic_need,non_replacement_reason");
    const association_of_prosthetic_need_for_non_replacement_reason: any = {};
    if (prosthetic_need_for_non_replacement_reason)
      prosthetic_need_for_non_replacement_reason.forEach((item: any) => {
        const prosthethic_need = item.prosthetic_need;
        const non_replacement_reason = item.non_replacement_reason;

        if (
          !association_of_prosthetic_need_for_non_replacement_reason[
            prosthethic_need
          ]
        ) {
          association_of_prosthetic_need_for_non_replacement_reason[
            prosthethic_need
          ] = {
            total: 0,
            counts: {},
          };
        }
        if (
          !association_of_prosthetic_need_for_non_replacement_reason[
            prosthethic_need
          ].counts[non_replacement_reason]
        ) {
          association_of_prosthetic_need_for_non_replacement_reason[
            prosthethic_need
          ].counts[non_replacement_reason] = 0;
        }

        association_of_prosthetic_need_for_non_replacement_reason[
          prosthethic_need
        ].total++;
        association_of_prosthetic_need_for_non_replacement_reason[
          prosthethic_need
        ].counts[non_replacement_reason]++;
      });

    // Association between replacement need and gender

    let { data: replacement_need_for_gender } = await supbaseAdmin
      .from("responses")
      .select("replacement_reason,gender");
    const association_of_replacement_need_for_gender: any = {};
    if (replacement_need_for_gender)
      replacement_need_for_gender.forEach((item: any) => {
        const replacement_need = item.replacement_reason;
        const gender = item.gender;

        if (!association_of_replacement_need_for_gender[replacement_need]) {
          association_of_replacement_need_for_gender[replacement_need] = {
            total: 0,
            counts: {},
          };
        }
        if (
          !association_of_replacement_need_for_gender[replacement_need].counts[
            gender
          ]
        ) {
          association_of_replacement_need_for_gender[replacement_need].counts[
            gender
          ] = 0;
        }

        association_of_replacement_need_for_gender[replacement_need].total++;
        association_of_replacement_need_for_gender[replacement_need].counts[
          gender
        ]++;
      });

    //   Association between Replacement Criteria and SES

    let { data: replacement_need_for_class } = await supbaseAdmin
      .from("responses")
      .select("replacement_reason,socio_economic_class");
    const association_of_replacement_need_for_class: any = {};
    if (replacement_need_for_class)
      replacement_need_for_class.forEach((item: any) => {
        const replacement_need = item.replacement_reason;
        const socio_economic_class = item.socio_economic_class;

        if (!association_of_replacement_need_for_class[replacement_need]) {
          association_of_replacement_need_for_class[replacement_need] = {
            total: 0,
            counts: {},
          };
        }
        if (
          !association_of_replacement_need_for_class[replacement_need].counts[
            socio_economic_class
          ]
        ) {
          association_of_replacement_need_for_class[replacement_need].counts[
            socio_economic_class
          ] = 0;
        }

        association_of_replacement_need_for_class[replacement_need].total++;
        association_of_replacement_need_for_class[replacement_need].counts[
          socio_economic_class
        ]++;
      });

    //   Association between Replacement criteria and Age

    let { data: replacement_need_for_age } = await supbaseAdmin
      .from("responses")
      .select("replacement_reason,age");
    const association_of_replacement_need_for_age: any = {};
    if (replacement_need_for_age)
      replacement_need_for_age.forEach((item: any) => {
        const replacement_need = item.replacement_reason;
        const age = item.age;

        if (!association_of_replacement_need_for_age[replacement_need]) {
          association_of_replacement_need_for_age[replacement_need] = {
            total: 0,
            counts: {},
          };
        }
        if (
          !association_of_replacement_need_for_age[replacement_need].counts[age]
        ) {
          association_of_replacement_need_for_age[replacement_need].counts[
            age
          ] = 0;
        }

        association_of_replacement_need_for_age[replacement_need].total++;
        association_of_replacement_need_for_age[replacement_need].counts[age]++;
      });

    //   Association between Replacement Criteria and Prosthesis

    let { data: replacement_need_for_posthetic_type_need } = await supbaseAdmin
      .from("responses")
      .select("replacement_reason,posthetic_type_need");
    const association_of_replacement_need_for_posthetic_type_need: any = {};
    if (replacement_need_for_posthetic_type_need)
      replacement_need_for_posthetic_type_need.forEach((item: any) => {
        const replacement_need = item.replacement_reason;
        const posthetic_type_need = item.posthetic_type_need;

        if (
          !association_of_replacement_need_for_posthetic_type_need[
            replacement_need
          ]
        ) {
          association_of_replacement_need_for_posthetic_type_need[
            replacement_need
          ] = {
            total: 0,
            counts: {},
          };
        }
        if (
          !association_of_replacement_need_for_posthetic_type_need[
            replacement_need
          ].counts[posthetic_type_need]
        ) {
          association_of_replacement_need_for_posthetic_type_need[
            replacement_need
          ].counts[posthetic_type_need] = 0;
        }

        association_of_replacement_need_for_posthetic_type_need[
          replacement_need
        ].total++;
        association_of_replacement_need_for_posthetic_type_need[
          replacement_need
        ].counts[posthetic_type_need]++;
      });

    //   Distribution of study population according to SES

    let { data: total_for_class } = await supbaseAdmin
      .from("responses")
      .select("socio_economic_class");
    const distribution_of_total_to_class: any = {};
    if (total_for_class)
      total_for_class.forEach((item: any) => {
        const socio_economic_class = item.socio_economic_class;

        if (!distribution_of_total_to_class[socio_economic_class]) {
          distribution_of_total_to_class[socio_economic_class] = {
            total: 0,
          };
        }

        distribution_of_total_to_class[socio_economic_class].total++;
      });

    //   Association between Prosthodontic Need and Age

    let { data: prosthetic_need_for_age } = await supbaseAdmin
      .from("responses")
      .select("prosthetic_need,age");
    const association_of_prosthetic_need_for_age: any = {};
    if (prosthetic_need_for_age)
      prosthetic_need_for_age.forEach((item: any) => {
        const prosthetic_need = item.prosthetic_need;
        const age = item.age;

        if (!association_of_prosthetic_need_for_age[prosthetic_need]) {
          association_of_prosthetic_need_for_age[prosthetic_need] = {
            total: 0,
            counts: {},
          };
        }
        if (
          !association_of_prosthetic_need_for_age[prosthetic_need].counts[age]
        ) {
          association_of_prosthetic_need_for_age[prosthetic_need].counts[
            age
          ] = 0;
        }

        association_of_prosthetic_need_for_age[prosthetic_need].total++;
        association_of_prosthetic_need_for_age[prosthetic_need].counts[age]++;
      });

    const response = {
      total: total?.length,
      males: males?.length,
      females: females?.length,
      association_of_prosthetic_needs_with_class:
        association_of_prosthetic_needs_with_class,
      association_of_prosthetic_status_with_class:
        association_of_prosthetic_status_with_class,
      association_of_non_replacement_reason_for_classes:
        association_of_non_replacement_reason_for_classes,
      association_of_prosthetic_need_for_non_replacement_reason:
        association_of_prosthetic_need_for_non_replacement_reason,
      association_of_replacement_need_for_gender:
        association_of_replacement_need_for_gender,
      association_of_replacement_need_for_class:
        association_of_replacement_need_for_class,
      association_of_replacement_need_for_age:
        association_of_replacement_need_for_age,
      association_of_replacement_need_for_posthetic_type_need:
        association_of_replacement_need_for_posthetic_type_need,
      distribution_of_total_to_class: distribution_of_total_to_class,
      association_of_prosthetic_need_for_age:
        association_of_prosthetic_need_for_age,
    };

    return NextResponse.json({ response }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error }, { status: 400 });
  }
}
