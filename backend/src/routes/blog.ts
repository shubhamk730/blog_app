import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";

import { decode, verify } from 'hono/jwt'
import { createBlogInput, updateBlogInput } from "@sk730/blog-common";


export const blogRouter = new Hono<{
    Bindings : {
        DATABASE_URL : string,
        JWT_SECRET: string
    },
    Variables : {
        userId: any
    }
}>();

blogRouter.use("/*", async (c, next) => {
    console.log("reached");
    const token = c.req.header("Authorization")||" ";
    // const token = c.req.header("Authorization") || "";
    const user = await verify(token, c.env.JWT_SECRET);

    if(user) {
        c.set("userId", user.id);
        await next();
    } else {
        return c.json({status: 403, error : "Unauthorized", data : null})
    }
})

blogRouter.post('/', async (c) => {
    const body = await c.req.json();
    const authorId = c.get("userId");

    const { success } = createBlogInput.safeParse(body);
    
    if(!success ) {
        c.status(411);
        return c.json({status: 411, error : "Invalid inputs", data : null})
    }

    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate()) 
    
    try {
        const blog = await prisma.post.create({
            data: {
                title: body.title,
                content: body.content,
                published: body.published,
                authorId: authorId
            }
        })

        return c.json({status: 200, error : null, data : blog})
    } catch (error) {
        return c.json({status: 500, error : error, data : null})
    }
})

blogRouter.put('/', async (c) => {
    const body = await c.req.json();

    const { success } = updateBlogInput.safeParse(body);
    
    if(!success ) {
        c.status(411);
        return c.json({status: 411, error : "Invalid inputs", data : null})
    }

    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate()) 
    
    try {
        const blog = await prisma.post.update({
            where : {
                id: body.id
            },
            data: {
                title: body.title,
                content: body.content,
            }
        })
        
        return c.json({status: 200, error : null, data : {
            ...blog
        }})
    } catch(error) {
        return c.json({status: 500, error : error, data : null})
    }
})

blogRouter.get('/bulk', async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate()) 
    
    try {
        const blogs = await prisma.post.findMany();
        
        return c.json({status: 200, error : null, data : {
            ...blogs
        }})
    } catch(error) {
        return c.json({status: 500, error : error, data : null})
    }
})

blogRouter.get('/:id', async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate()) 
    
    try {
        const blogs = await prisma.post.findFirst({
            where : {
                id: c.req.param("id")
            }
        });
        
        return c.json({status: 200, error : null, data : {
            ...blogs
        }})
    } catch(error) {
        return c.json({status: 500, error : error, data : null})
    }
})

