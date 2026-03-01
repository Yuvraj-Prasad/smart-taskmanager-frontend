export interface User{
    _id: string,
    email: string,
    token: string
}

export interface Task{
    _id: string,
    title: string,
    description?: string,
    status: "Pending" | "In Progress" | "Completed"
}