import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
export const runtime="nodejs";
export async function GET(){
  const token=process.env.INTERNAL_ACCESS_TOKEN;
  const cookie=(await import("next/headers")).cookies;
  const c=(await cookie()).get("acjl-internal-access")?.value;
  if(!token||c!==token)return NextResponse.json({error:"Não autorizado"},{status:401});
  const url=process.env.NEXT_PUBLIC_SUPABASE_URL, key=process.env.SUPABASE_SERVICE_ROLE_KEY;
  if(!url||!key)return NextResponse.json({error:"Supabase não configurado"},{status:500});
  const supabase=createClient(url,key,{auth:{persistSession:false}});
  const {data,error}=await supabase.from("diagnostic_submissions").select("*").order("submitted_at",{ascending:false});
  if(error)return NextResponse.json({error:error.message},{status:500});
  return NextResponse.json({data});
}
