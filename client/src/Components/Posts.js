import React from 'react'
import { Button, Card, Divider, Input, Modal, Select, message } from 'antd'
import Comment from './Comment'
import { useQuery, useMutation, gql } from '@apollo/client';
import { Link } from 'react-router-dom';
const { Option } = Select;

const USERS = gql`
    query {
        users{
            name
            id
        }
    }
`;

const ALL_POSTS = gql`
    query {
         posts{
            title
            body
            published
            
            author{
              name
            }
            
            comments{
            text
            
            author{
                name
              }
           }
       }
     }
  `;

const CREATE_POST = gql` 
  mutation($title: String!, $body: String!, $published: Boolean, $author: ID! ) {
  createPost(data:{
    title: $title,
    body: $body,
    published: $published,
    author: $author
  }){
    id
    title
    body
    published
  }
}
  `

function Posts() {
    const { data: postsData, loading: postsLoading, error: postsError } = useQuery(ALL_POSTS, { fetchPolicy:"network-only"});
    const { data: usersData, loading: usersLoading, error: usersError } = useQuery(USERS, { fetchPolicy: "cache-first" });
    const [createPostFunction] = useMutation(CREATE_POST,{
        onCompleted: () => {
          message.success("Post created succesfully")
        }
    });
    const [isCreatePostModalVisible, setisCreatePostModalVisible] = React.useState(false);
    const [createPostData, setCreatePostData] = React.useState({
        title: "",
        body: "",
        published: false,
        author: ""
    });

    if (postsLoading || usersLoading) { return 'Loading.....' }
    if (postsError || usersError) { return `Error! ${postsError.message}` }
    let posts, users;
    posts = postsData.posts;
    users = usersData.users;

    const handleOk = () => {
        createPostFunction({
        variables:{
            title: createPostData.title,
            body: createPostData.body,
            published: createPostData.published,
            author: createPostData.author
        }, refetchQueries: [{query: ALL_POSTS}]})
        setisCreatePostModalVisible(false);
        setCreatePostData({ title:"", body:"", published:false, author:"" })
    }

    const handleCancel = () => {
        setisCreatePostModalVisible(false)

    }

    const usersOptions = (
        users.map((data) => (
            <Option value={data.id} key={data.id}>{data.name}</Option>
        ))
    )

    return (
        <>
            <Button style={{ marginRight: "15px" }} onClick={(e) => { setisCreatePostModalVisible(true) }}>Create a new post</Button>
            <Button style={{ marginBottom: "15px" }} type="primary"><Link to="/users">Find all Users</Link></Button>
            <div id='postContent'>
                {posts.map((data) => (
                    <Card style={{ width: 400 }}>
                        <h1>{data.title}</h1>
                        <h3>Post author: <b>{data.author.name}</b></h3>
                        <p>{data.body}</p>
                        <Divider />
                        {
                            data.comments.map((data) => (
                                <Comment text={data.text} author={data.author.name} />
                            ))
                        }
                    </Card>
                ))}
            </div>

            <Modal title={`Creating a new post`} visible={isCreatePostModalVisible} onOk={handleOk} onCancel={handleCancel}>
                <label htmlFor="">Title of the post: </label>
                <Input type='text' placeholder="title" style={{ marginTop: '10px', marginBottom: "15px" }}
                    onChange={(e) => setCreatePostData({ ...createPostData, title: e.target.value })} />

                <label htmlFor="" style={{ marginTop: '30px' }}>Content of post</label>
                <Input type='text' placeholder="Post content.." style={{ marginTop: '10px', marginBottom: "20px" }}
                    onChange={(e) => setCreatePostData({ ...createPostData, body: e.target.value })}
                />

                <label htmlFor="" style={{ marginBottom: '100px' }}> Author of the post</label> <br />
                <Select placeholder="Choose the author" style={{ width: 470, marginTop: "10px" }}
                    onChange={(e) => setCreatePostData({ ...createPostData, author: e })}
                >
                    {usersOptions}
                </Select>
            </Modal>

        </>
    )
}

export default Posts