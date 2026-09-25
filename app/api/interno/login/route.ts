import { NextResponse } from "next/server";
export const runtime="nodejs";
export async function POST(request:Request){
  const {password}=await request.json().catch(()=>({}));
  const expected=process.env.INTERNAL_ACCESS_PASSWORD;
  const token=process.env.INTERNAL_ACCESS_TOKEN;
  if(!expected||!token||password!==expected) return NextResponse.json({error:"Acesso negado"},{status:401});
  const response=NextResponse.json({ok:true});
  response.cookies.set("acjl-internal-access",token,{httpOnly:true,secure:process.env.NODE_ENV==="production",sameSite:"lax",path:"/",maxAge:60*60*8});
  return response;
}
