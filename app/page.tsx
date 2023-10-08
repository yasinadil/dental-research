"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "@/components/ui/use-toast";
import { useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const FormSchema = z.object({
  institute: z.enum(["UCD"], {
    required_error:
      "You need to select the institution (for some reason, eventhough there is just 1).",
  }),
  Gender: z.enum(["Male", "Female"], {
    required_error: "You need to select the patient gender.",
  }),
  Age: z.enum(["15-24", "25-34", "35-44", "45-54", "55-64", "≥65"], {
    required_error: "You need to select the patient's age group.",
  }),
  Education: z.enum(
    ["Uneducated", "Primary", "Secondary", "Graduate/Postgraduate"],
    {
      required_error: "You need to select the patient's education level.",
    }
  ),
  Ocupation: z.enum(
    [
      "Professional",
      "Semi-professional",
      "Cleric",
      "Skilled worker",
      "Semi-skilled worker",
      "Unskilled worker",
      "Unemployed",
    ],
    {
      required_error:
        "You need to select the patient's head of family's occupation.",
    }
  ),
  Income: z.enum(
    [
      "<35,000",
      "35,000 - 75,000",
      "75,001 - 100,000",
      "100,001 - 125,000",
      "125,001 - 150,000",
      "150,001 - 200,000",
      ">200,000",
    ],
    {
      required_error:
        "You need to select the patient's family's monthly income.",
    }
  ),
  Visited: z.enum(["Yes", "No"], {
    required_error:
      "You need to select if the patient has visited before or not.",
  }),
  Reason: z.enum(["Toothache", "Esthetic", "Mastication", "TMJ Disorders"], {
    required_error: "You need to select the patient's reason of last visit.",
  }),
  Toothloss: z
    .enum([
      "Dental Caries",
      "Trauma",
      "Ortho extraction",
      "Impaction",
      "Don't  Know",
    ])
    .optional(),
  ProstheticStatus: z
    .enum([
      "No prosthesis",
      "Bridge",
      "More than 1 bridge",
      "Partial denture",
      "Complete denture",
      "Not recorded",
    ])
    .optional(),
  ProstheticNeed: z
    .enum(["No need", "1-unit", "Multi-unit", "Combined", "Full-Mouth"])
    .optional(),
  ReplacementReason: z
    .enum(["Asthetic", "Speech", "Function", "Combination"])
    .optional(),
  NonReplacementReason: z
    .enum(["Financial Reason", "Didn't feel need", "No time", "Other reason"])
    .optional(),
  ProsthesisTypeRequired: z
    .enum(["Fixed prosthesis", "Removable prosthesis"])
    .optional(),
});

export default function Home() {
  const [submitted, isSubmitted] = useState(false);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  const classCalculator = (score: number) => {
    // Upper class 26-29
    // Upper Middle 16-25
    // Lower Middle 11-15
    // Upper Lower 5-10
    // Lower below 5
    if (score >= 26 && score <= 29) {
      return "Upper class";
    } else if (score >= 16 && score <= 25) {
      return "Upper Middle";
    } else if (score >= 11 && score <= 15) {
      return "Lower Middle";
    } else if (score >= 5 && score <= 10) {
      return "Upper Lower";
    } else if (score < 5) {
      return "Lower";
    }
  };
  async function onSubmit(data: z.infer<typeof FormSchema>) {
    let sociEconmicClass = 0;
    switch (data.Education) {
      case "Uneducated":
        sociEconmicClass += 1;
        break;
      case "Primary":
        sociEconmicClass += 2;
        break;

      case "Secondary":
        sociEconmicClass += 3;
        break;
      case "Graduate/Postgraduate":
        sociEconmicClass += 6;
        break;
      default:
        break;
    }

    switch (data.Ocupation) {
      case "Professional":
        sociEconmicClass += 10;
        break;
      case "Semi-professional":
        sociEconmicClass += 6;
        break;
      case "Cleric":
        sociEconmicClass += 5;
        break;
      case "Skilled worker":
        sociEconmicClass += 4;
        break;
      case "Semi-skilled worker":
        sociEconmicClass += 3;
        break;
      case "Unskilled worker":
        sociEconmicClass += 2;
        break;
      case "Unemployed":
        sociEconmicClass += 1;
        break;

      default:
        break;
    }

    switch (data.Income) {
      case "<35,000":
        sociEconmicClass += 1;
        break;
      case "35,000 - 75,000":
        sociEconmicClass += 2;
        break;
      case "75,001 - 100,000":
        sociEconmicClass += 3;
        break;
      case "100,001 - 125,000":
        sociEconmicClass += 4;
        break;
      case "125,001 - 150,000":
        sociEconmicClass += 6;
        break;
      case "150,001 - 200,000":
        sociEconmicClass += 10;
        break;
      case ">200,000":
        sociEconmicClass += 12;
        break;

      default:
        break;
    }

    console.log(data, sociEconmicClass);
    const classCalculated = classCalculator(sociEconmicClass);

    try {
      const response = await fetch("/api/addResponse", {
        method: "POST",
        cache: "no-store",
        body: JSON.stringify({
          age: data.Age,
          education: data.Education,
          gender: data.Gender,
          income: data.Income,
          institute: data.institute,
          non_replacement_reason: data.NonReplacementReason,
          ocupation: data.Ocupation,
          posthetic_type_need: data.ProstheticNeed,
          prosthetic_need: data.ProstheticNeed,
          prosthetic_status: data.ProstheticStatus,
          reason: data.Reason,
          replacement_reason: data.ReplacementReason,
          socio_economic_class: classCalculated,
          toothloss: data.Toothloss,
          visited: data.Visited,
        }),
      });
    } catch (error) {}

    isSubmitted(true);
  }

  if (submitted) {
    return (
      <div>
        <Alert>
          <AlertTitle>Response Recorded!</AlertTitle>
          <AlertDescription className="mb-4">
            Your response has been successfully recorded.
          </AlertDescription>

          <a className=" py-1 rounded-lg underline" href="/">
            Submit another response
          </a>
        </Alert>
      </div>
    );
  }

  return (
    <div className="px-4 pb-10">
      <Form {...form}>
        <h1 className="text-xl font-medium mt-3 mb-3">Data collection</h1>
        <a className="underline" href="/response">
          View Raw Responses
        </a>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-6 mt-4"
        >
          <FormField
            control={form.control}
            name="institute"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>Institute</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col space-y-1"
                  >
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="UCD" />
                      </FormControl>
                      <FormLabel className="font-normal">UCD</FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="Gender"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>Gender</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col space-y-1"
                  >
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="Male" />
                      </FormControl>
                      <FormLabel className="font-normal">Male</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="Female" />
                      </FormControl>
                      <FormLabel className="font-normal">Female</FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="Age"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>Age</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col space-y-1"
                  >
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="15-24" />
                      </FormControl>
                      <FormLabel className="font-normal">15-24</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="25-34" />
                      </FormControl>
                      <FormLabel className="font-normal">25-34</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="35-44" />
                      </FormControl>
                      <FormLabel className="font-normal">35-44</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="45-54" />
                      </FormControl>
                      <FormLabel className="font-normal">45-54</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="55-64" />
                      </FormControl>
                      <FormLabel className="font-normal">55-64</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="≥65" />
                      </FormControl>
                      <FormLabel className="font-normal">≥ 65</FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="Education"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>Education</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col space-y-1"
                  >
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="Uneducated" />
                      </FormControl>
                      <FormLabel className="font-normal">Uneducated</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="Primary" />
                      </FormControl>
                      <FormLabel className="font-normal">Primary</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="Secondary" />
                      </FormControl>
                      <FormLabel className="font-normal">Secondary</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="Graduate/Postgraduate" />
                      </FormControl>
                      <FormLabel className="font-normal">
                        Graduate / Postgraduate
                      </FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="Ocupation"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>Ocupation of (Head of family)</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col space-y-1"
                  >
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="Professional" />
                      </FormControl>
                      <FormLabel className="font-normal">
                        Professional (White-collar)
                      </FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="Semi-professional" />
                      </FormControl>
                      <FormLabel className="font-normal">
                        Semi-professional
                      </FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="Cleric" />
                      </FormControl>
                      <FormLabel className="font-normal">
                        Clerical (shop owner, farm)
                      </FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="Skilled worker" />
                      </FormControl>
                      <FormLabel className="font-normal">
                        Skilled worker
                      </FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="Semi-skilled worker" />
                      </FormControl>
                      <FormLabel className="font-normal">
                        Semi-skilled worker
                      </FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="Unskilled worker" />
                      </FormControl>
                      <FormLabel className="font-normal">
                        Unskilled worker
                      </FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="Unemployed" />
                      </FormControl>
                      <FormLabel className="font-normal">Unemployed</FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="Income"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>Monthly family income</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col space-y-1"
                  >
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="<35,000" />
                      </FormControl>
                      <FormLabel className="font-normal">{"<35,000"}</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="35,000 - 75,000" />
                      </FormControl>
                      <FormLabel className="font-normal">
                        35,000 - 75,000
                      </FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="75,001 - 100,000" />
                      </FormControl>
                      <FormLabel className="font-normal">
                        75,001 - 100,000
                      </FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="100,001 - 125,000" />
                      </FormControl>
                      <FormLabel className="font-normal">
                        100,001 - 125,000
                      </FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="125,001 - 150,000" />
                      </FormControl>
                      <FormLabel className="font-normal">
                        125,001 - 150,000
                      </FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="150,001 - 200,000" />
                      </FormControl>
                      <FormLabel className="font-normal">
                        150,001 - 200,000
                      </FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value=">200,000" />
                      </FormControl>
                      <FormLabel className="font-normal">
                        {">200,000"}
                      </FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="Visited"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>Have you visited dentist before ?</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col space-y-1"
                  >
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="Yes" />
                      </FormControl>
                      <FormLabel className="font-normal">Yes</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="No" />
                      </FormControl>
                      <FormLabel className="font-normal">No</FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="Reason"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>If Yes Reason of dental visit?</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col space-y-1"
                  >
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="Toothache" />
                      </FormControl>
                      <FormLabel className="font-normal">Toothache</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="Esthetic" />
                      </FormControl>
                      <FormLabel className="font-normal">Esthetic</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="Mastication" />
                      </FormControl>
                      <FormLabel className="font-normal">Mastication</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="TMJ Disorders" />
                      </FormControl>
                      <FormLabel className="font-normal">
                        TMJ Disorders
                      </FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="Toothloss"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>Reasons for tooth loss</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col space-y-1"
                  >
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="Dental Caries" />
                      </FormControl>
                      <FormLabel className="font-normal">
                        Dental Caries
                      </FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="Trauma" />
                      </FormControl>
                      <FormLabel className="font-normal">Trauma</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="Ortho extraction" />
                      </FormControl>
                      <FormLabel className="font-normal">
                        Ortho extraction
                      </FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="Impaction" />
                      </FormControl>
                      <FormLabel className="font-normal">Impaction</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="Don't  Know" />
                      </FormControl>
                      <FormLabel className="font-normal">
                        Don&apos;t Know
                      </FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="ProstheticStatus"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>Prosthetic status of patient</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col space-y-1"
                  >
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="No prosthesis" />
                      </FormControl>
                      <FormLabel className="font-normal">
                        No prosthesis
                      </FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="Bridge" />
                      </FormControl>
                      <FormLabel className="font-normal">Bridge</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="More than 1 bridge" />
                      </FormControl>
                      <FormLabel className="font-normal">
                        More than 1 bridge
                      </FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="Partial denture" />
                      </FormControl>
                      <FormLabel className="font-normal">
                        Partial denture
                      </FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="Complete denture" />
                      </FormControl>
                      <FormLabel className="font-normal">
                        Complete denture
                      </FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="Not recorded" />
                      </FormControl>
                      <FormLabel className="font-normal">
                        Not recorded
                      </FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="ProstheticNeed"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>Prosthetic need</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col space-y-1"
                  >
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="No need" />
                      </FormControl>
                      <FormLabel className="font-normal">No need</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="1-unit" />
                      </FormControl>
                      <FormLabel className="font-normal">1-unit</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="Multi-unit" />
                      </FormControl>
                      <FormLabel className="font-normal">Multi-unit</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="Combined" />
                      </FormControl>
                      <FormLabel className="font-normal">Combined</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="Full-Mouth" />
                      </FormControl>
                      <FormLabel className="font-normal">Full-Mouth</FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="ReplacementReason"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>Reason for Replacement</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col space-y-1"
                  >
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="Asthetic" />
                      </FormControl>
                      <FormLabel className="font-normal">Asthetic</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="Speech" />
                      </FormControl>
                      <FormLabel className="font-normal">Speech</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="Function" />
                      </FormControl>
                      <FormLabel className="font-normal">Function</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="Combination" />
                      </FormControl>
                      <FormLabel className="font-normal">Combination</FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="NonReplacementReason"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>Reason for non-replacement</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col space-y-1"
                  >
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="Financial Reason" />
                      </FormControl>
                      <FormLabel className="font-normal">
                        Financial Reason
                      </FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="Didn't feel need" />
                      </FormControl>
                      <FormLabel className="font-normal">
                        Didn&apos;t feel need
                      </FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="No time" />
                      </FormControl>
                      <FormLabel className="font-normal">No time</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="Any other reason" />
                      </FormControl>
                      <FormLabel className="font-normal">
                        Any other reason
                      </FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="ProsthesisTypeRequired"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>Prosthesis type required by patient</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col space-y-1"
                  >
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="Fixed prosthesis" />
                      </FormControl>
                      <FormLabel className="font-normal">
                        Fixed prosthesis
                      </FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="Removable prosthesis" />
                      </FormControl>
                      <FormLabel className="font-normal">
                        Removable prosthesis
                      </FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </div>
  );
}
