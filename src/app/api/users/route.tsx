export async function GET(request: Request) {
  // For example, fetch data from your DB here
  const users = [
    {   
        id: 1, 
        email: "temp@email.com",
        password_hash: "",
        display_name: "Pongte",
        avartar_url: "",
        bio: "Biology",
        created_at: "",
        update_at: ""
    },
    {   
        id: 2, 
        email: "temp@email.com",
        password_hash: "",
        display_name: "Aek Khaomunkhai",
        avartar_url: "",
        bio: "Biometrics",
        created_at: "",
        update_at: ""
    },
  ];
  return new Response(JSON.stringify(users), {
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