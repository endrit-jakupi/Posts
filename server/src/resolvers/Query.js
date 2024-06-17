const Query = {
    users(parent, args, { prisma }, info) {
        const opArgs = {
            first:  args.first,
            skip:   args.skip,
            after:  args.after
        };

        

        return prisma.query.users(opArgs, info);
    },
    findUserById(parent, args, { prisma }, info) {
        return prisma.query.user({
            where: {
                id: args.id
            }
        });
    },
    findUserPosts(parent, args, { prisma }, info){
          return prisma.query.posts({
              where: {
                  author: {
                      id: args.id
                  }
              }
          }, info);
    }
    ,
    posts(parent, args, { prisma }, info) {
            const opArgs = {
            first:  args.first,
            skip:   args.skip,
            after:  args.after
        };

        return prisma.query.posts(opArgs, info);
    }
    ,
    comments(parent, args, { prisma }, info) {
        return prisma.query.coments(null, info);
    }

}

export { Query as default }