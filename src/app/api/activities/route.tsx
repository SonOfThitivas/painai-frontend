export async function GET(request: Request) {
  // For example, fetch data from your DB here
  const actvities = [
    {   
        id: 1, 
        creator_id: 1,
        title: "Let's play futsal",
        description: "Nostrud labore laboris elit aute aliquip laborum sint pariatur incididunt magna id voluptate. Ipsum sint non cillum exercitation nisi minim nulla deserunt excepteur ullamco. Cupidatat quis ea non minim aliquip. Exercitation eu nulla do dolor adipisicing qui veniam irure laborum aute in. Magna id sunt qui consectetur excepteur veniam.Duis ipsum eu nostrud amet ipsum occaecat. Nulla exercitation non officia ut non do voluptate officia cupidatat exercitation deserunt non veniam voluptate. Esse deserunt commodo amet et officia adipisicing Lorem consequat ipsum Lorem sint ex aliquip non. Culpa consectetur sint adipisicing ut nostrud sit nostrud consequat commodo ea sint veniam in. Irure qui consectetur quis qui ipsum irure sint elit.",
        start_time: "",
        end_time: "",
        max_participants: 12,
        visibility: "",
        location: {
            lat: 0,
            lng: 0,
        },
        created_at: "",
        updated_at: ""
    },
   {   
        id: 2, 
        creator_id: 2,
        title: "Let's eat Teenoi!",
        description: "Nostrud labore laboris elit aute aliquip laborum sint pariatur incididunt magna id voluptate. Ipsum sint non cillum exercitation nisi minim nulla deserunt excepteur ullamco. Cupidatat quis ea non minim aliquip. Exercitation eu nulla do dolor adipisicing qui veniam irure laborum aute in. Magna id sunt qui consectetur excepteur veniam.Duis ipsum eu nostrud amet ipsum occaecat. Nulla exercitation non officia ut non do voluptate officia cupidatat exercitation deserunt non veniam voluptate. Esse deserunt commodo amet et officia adipisicing Lorem consequat ipsum Lorem sint ex aliquip non. Culpa consectetur sint adipisicing ut nostrud sit nostrud consequat commodo ea sint veniam in. Irure qui consectetur quis qui ipsum irure sint elit.",
        start_time: "",
        end_time: "",
        max_participants: 5,
        visibility: "",
        location: {
            lat: 0,
            lng: 0,
        },
        created_at: "",
        updated_at: ""
    },
  ];
  return new Response(JSON.stringify(actvities), {
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