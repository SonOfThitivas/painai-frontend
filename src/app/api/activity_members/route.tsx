export async function GET(request: Request) {
  // For example, fetch data from your DB here
  const actvity_members = [
    {   
        activity_id: 1,
        user_id:1,
        role: "host",
        joined_at: "",
    },
   {   
        activity_id: 1,
        user_id:2,
        role: "participant",
        joined_at: "",
    },
    {   
        activity_id: 2,
        user_id:2,
        role: "host",
        joined_at: "",
    },
    {   
        activity_id: 2,
        user_id:1,
        role: "participant",
        joined_at: "",
    },
  ];
  return new Response(JSON.stringify(actvity_members), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}
 
// export async function POST(request: Request) {
//   // Parse the request body
//   const body = await request.json();
//   const { name } = body;
 
//   // e.g. Insert new user into your DB
//   const newUser = { id: Date.now(), name };
 
//   return new Response(JSON.stringify(newUser), {
//     status: 201,
//     headers: { 'Content-Type': 'application/json' }
//   });
// }