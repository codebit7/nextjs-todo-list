import { PrismaClient } from "@prisma/client";



const prisma = new PrismaClient();

export async function  POST(req){

   const body =  await req.json();

   if(!body.title  || !body.description){
    return Response.json(
        {
            error:"Please fill the Title and description"
        },
        {status: 400}
    );
   }


    const newTodo = await prisma.todo.create({
        data:{
            title: body.title,
            description : body.description,
            dueDate : body.dueDate ? new Date(body.dueDate) : null,
        }
     })

   return  Response.json({todo: newTodo, message: "successfully added"});

}



// all todos
export async function GET(){

    const todos = await prisma.todo.findMany();
    if(!todos || todos.length === 0){
        return Response.json({error: "Not Found"}, {status: 404});
    }

    return Response.json(todos)

}
