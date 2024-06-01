import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'

const app = new Hono<{
  Bindings : {
    DATABASE_URL : string
  }
}>()

app.post('/api/vq/user/signup', (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate()) 

  return c.text('Hello user added!')
})

app.post('/api/vq/user/signin', (c) => {
  return c.text('Hello User logged in!')
})

app.post('/api/v1/blog', (c) => {
  return c.text("New blog created");
})

app.put('/api/v1/blog', (c) => {
  return c.text("Blog updated");
})

app.get('/api/v1/blog/bulk', (c) => {
  return c.text('All blogs');
})

app.get('/api/v1/blog/:id', (c) => {
  return c.text("Blod with id");
})



export default app
