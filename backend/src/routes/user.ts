import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { sign } from 'hono/jwt'
import { signinInput, signupInput } from "@sk730/blog-common";


export const userRouter = new Hono<{
    Bindings : {
        DATABASE_URL : string,
        JWT_SECRET: string
    }
}>(); 

userRouter.post('/signup', async (c) => {
    const body = await c.req.json();
    const { success } = signupInput.safeParse(body);
    
    if(!success ) {
        c.status(411);
        return c.json({status: 411, error : "Invalid inputs", data : null})
    }

    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate()) 
    
    try {
        const user = await prisma.user.create({
            data : {
                name: body.name,
                password: body.password,
                email: body.email
            }
        })
        
        const jwt = await sign({id : user.id}, c.env.JWT_SECRET);
        
        return c.json({status: 200, error : null, data : {
            token: jwt,
            name: user.name,
            email: user.email
        }})
        
    } catch (error) {
      return c.json({status: 500, error : error, data : null})
    }
    
})
  
userRouter.post('/signin', async (c) => {
    const body = await c.req.json();
    const { success } = signinInput.safeParse(body);
    
    if(!success ) {
        c.status(411);
        return c.json({status: 411, error : "Invalid inputs", data : null})
    }

    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate()) 

    try {
        const user = await prisma.user.findFirst({
        where: {
            email: body.email
        }
        })

        if(!user) {
        return c.json({status: 403, error : "User not found", data : null})
        }

        if(user.password !== body.password) {
        return c.json({status: 403, error : "User password invalid", data : null})
        }
        
        const jwt = await sign({id : user.id}, c.env.JWT_SECRET);

        return c.json({status: 200, error : null, data : {
            token: jwt,
            name: user.name,
            email: user.email
        }})
        
    } catch (error) {
        c.text("Failed");
    }
})