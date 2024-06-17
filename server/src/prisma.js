// The whole code where we connect the Node.JS back end to the 
// Prisma GraphQL API
import { Prisma } from 'prisma-binding'

const prisma = new Prisma({
    typeDefs: 'src/generated/prisma.graphql',
    endpoint: 'http://98.71.25.213:4467/prisma/dev',
});

export { prisma as default }














//prisma binding methods

    // prisma.exists.Post({
    //     id: "cl5koy9a900240802u74qs5uh"
    // }).then((exists) => {
    //     console.log(exists);
    // })







// ------------------- NEW WAY (better) ----------------------------- //

        // const createPostForUser = async (authorID, data) => {

        //     const userExists = await prisma.exists.User({
        //         id: authorID
        //     });

        //     if (!userExists) {
        //         throw new Error('This user doesnt exist')
        //     }
            
        // const post = await prisma.mutation.createPost({
        //         data: {
        //             ...data,
        //             author: { 
        //                 connect: {
        //                     id: authorID
        //                 }
        //             }
        //         }

        //     }, ' { author { id name email posts { id title published}}}');
            
        //     return post;
        // }

                       // |
                       // |
                       // |
                       // |
                       // ↓


        // createPostForUser('cl5i2t2ui010a0802qwf4drxz', {
        //     title: "First async post title",
        //     body: 'Async body post content',
        //     published: true  
        // }).then((user) => {
        //     console.log(JSON.stringify(user, undefined, 2));
        // }).catch((error) => console.log(error.message));


// ......... calling abovve function createPostForUser......... //













// const updatePostForUser = async (postID, data) => {

//     const postExists = await prisma.exists.Post({
//         id: postID
//     })

//     if (!postExists) {
//         throw new Error('This post doesnt exists ')
//     }

//     const updatedPost = await prisma.mutation.updatePost({
//         where: {
//             id: postID
//         },
//         data
//     }, '{ author { id name email posts { id title published} } }');
 
//     return updatedPost;
// };

// updatePostForUser('cl5krmssm00kh0802pfl9yiqm', { title: 'NEW TITLEurfytf' }).catch((error) =>{
//     console.log(error.message);
// }).then((data) => console.log(JSON.stringify(data, undefined, 2)))


