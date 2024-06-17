
const Mutation = {
    async createUser(parent, args, { prisma }, info) {
        const emailTaken = await prisma.exists.User({
            id:  args.data.email
        });

        if (emailTaken) {
            throw new Error('email taken');
        }

        const user = await prisma.mutation.createUser({data: args.data}, info); 

        return user;

        },

    async deleteUser(parent, args, { prisma }, info) {
         const userExists = await prisma.exists.User({
             id: args.id
         });
         if (!userExists) {
             throw new Error("This user doesnt exist");
         }

         const deletedUser = prisma.mutation.deleteUser({
             where: {
                 id: args.id
             }
         })

         return deletedUser;
       
    },
    async updateUser(parent, args, { prisma }, info) {
        return prisma.mutation.updateUser({
            where:{
                id: args.id
            },
            data: args.data
        }, info)
    },
    createPost(parent, args, { prisma }, info) {
       return prisma.mutation.createPost({
           data: {
               title: args.data.title,
               body: args.data.body,
               published: args.data.published,
               author: {
                   connect: {
                       id: args.data.author
                   }
               }
           } 
       },info)
    },

    async deletePost(parent, args, { prisma }, info) {
      return prisma.mutation.deletePost({
          where: {
              id: args.id
          }
      }, info)
    },
    updatePost(parent, args, { prisma }, info){
        return prisma.mutation.updatePost({
            where: {
                id: args.id
            },
            data: args.data
        })  
      },

    createComent(parent, args, { prisma }, info) {
        return prisma.mutation.createComent({
            data: {
                text: args.data.text,
                author: {
                    connect: {
                        id: args.data.author
                    }
                },
                post: {
                    connect: {
                        id: args.data.post
                    }
                }
            }
        }, info)

    },
    deleteComent(parent, args, { prisma }, info) {
        return prisma.mutation.deletePost({
            where: {
                id: args.id
            }
        })
    },
    
    updateComent(parent, args, { prisma }, info) {
             return prisma.mutation.updateComent({
                 where: {
                     id: args.id
                 }, 
                 data: args.data
             }, info)
      }

}

export { Mutation as default }