"use client"
import { NextRequest } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
    try {
        const supabase = await createSupabaseServerClient();
        const {
        data: { user },
        error: authError,
        } = await supabase.auth.getUser();

        if (authError || !user) {
        return { success: false, error: "Not authenticated" };
        }
        
    } catch (error) {
        
    }
}