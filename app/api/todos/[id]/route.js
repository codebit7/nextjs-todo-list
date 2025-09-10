import { PrismaClient } from "@prisma/client";



const prisma = new PrismaClient();


export async function PUT(req, { params }) {
  try {

    const { id } = params;

    const { title, description, dueDate, isCompleted } = await req.json();

    if (!title && !description && !dueDate && typeof isCompleted === "undefined") {
      return Response.json(
        { error: "atleast provide one  field" },
        { status: 400 }
      );
    }

   const updatedTodo = await prisma.todo.update(
        {
            where: {id: Number(id)},
            data:{
                title,
                description,
                dueDate: dueDate ? new Date(dueDate) :null,
                isCompleted
            }
        }
    )
    

    return Response.json(updatedTodo);
  } catch (err) {

    return Response.json({ error: "Failed to update todo" }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const { id } = params;

    const deletedTodo = await prisma.todo.delete({
      where: { id: Number(id) },
    });

    return Response.json({
      todo: deletedTodo,
      message: "Deleted successfully",
    });
  } catch (err) {

    return Response.json({ error: "Failed to delete todo" }, { status: 500 });
  }
}
