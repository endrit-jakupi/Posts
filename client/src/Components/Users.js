import React, { useState } from "react";
import '../App.css'
import { Modal, Button, Table, Space, Input, message, Select } from 'antd';
import { useQuery, useMutation, gql } from '@apollo/client'

const ALL_USERS = gql`
       query  {
          users{
            id
            name
            email
            posts{
              id
            }
          }
        
      }
 `;

const DELETE_USER = gql`
      mutation ($id: ID!) {
        deleteUser( id: $id)
        {
          id
          name
          email
        }
      }
  `;


const UPDATE_USER = gql`
mutation ($id: ID!, $name: String, $email: String){
  updateUser(
    id: $id,
    data:{
      name: $name
      email: $email
    }
  )
  {
    id
    name
    email
  }
}
`;

const CREATE_USER = gql`
 mutation($name: String!, $email: String!){
  createUser(data:{
    name: $name,
    email: $email
    
  }){
    id
    name
    email
  }
}
`




function Users() {

  const [userId, setUserId] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModalVisible2, setIsModalVisible2] = useState(false);
  const [isModalVisible3, setIsModalVisible3] = useState(false);
  const [createUserError, setCreateUserError] = useState('');


  // onCompleted: () => {
  //   message.success('User DElete succesfully')
  // }

  const { data, loading, error } = useQuery(ALL_USERS);


  const [deleteUser] = useMutation(DELETE_USER,{
      update(cache, { data: { deleteUser } }) {
        const existingUsers = cache.readQuery({ query: ALL_USERS });
        const newUsers = existingUsers.users.filter((users) => (users.id !== deleteUser.id));
        cache.writeQuery({
          query: ALL_USERS,
          data: { users: newUsers }
        });
      },
      onCompleted: () => {
        message.success('user deleted succesfully')
      }
  }

    // {
    //   refetchQueries: [
    //     { query: ALL_USERS }
    //  ]
    // }
  );



  const [updateUser] = useMutation(UPDATE_USER, {
    onCompleted: () => {
      setIsModalVisible(false);
      message.success("User updated succesfully")
    }
  });

  const [createUser] = useMutation(CREATE_USER, {
    update(cache, { data: { createUser } }) {
      cache.modify({
        fields: {
          users(existingUsers = []) {
            const newTodoRef = cache.writeFragment({
              data: createUser,
              fragment: gql`
                fragment NewUser on User {
                  name
                  email
                }`
            });
            return [...existingUsers, newTodoRef];
          }
        }
      });
    },

    onCompleted: () => {
      setIsModalVisible2(false);
      setCreateUserError('');
      message.success("User created succesfully")
    },
    onError: (e) => {
      if ((e.message) === "A unique constraint would be violated on User. Details: Field name = email") {
        setIsModalVisible2(true);
        setCreateUserError('This email is unique please choose another one');
        console.log(e.message);
      }
    }
  });




  if (loading) { return 'Loading.....' }
  if (error) { return `Error! ${error.message}` }
  // const usersData = data.users;
  console.log(data);


  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <a href="www.google.com">{text}</a>,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    }, {
      title: "Number of Posts",
      dataIndex: 'nrOfPosts',
      render: (_, record) => (
        <Button>{record.posts.length}</Button>
      ),
      align: 'center'
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button type="error"
            onClick={() => {
              setUserId(record.id);
              setIsModalVisible3(true);
            }}> Delete</Button>
          <Button onClick={() => {
            setUserId(record.id);
            setName(record.name);
            setEmail(record.email);
            setIsModalVisible(true);
            console.log(userId, name, email);
          }}>Update</Button>
        </Space>
      ),
      width: '15%'
    },
  ];


  const showModal = () => {
    setIsModalVisible(true);
  };

  const createUserModal = () => {
    setName('');
    setEmail('');
    setIsModalVisible2(true);
  };

  const updateUserData = () => {
    updateUser({
      variables: {
        id: userId,
        name: name,
        email: email
      }
    })
    setIsModalVisible(false);
  };

  const handleOk2 = () => {
    createUser({
      variables: {
        name: name,
        email: email
      }
    })


    setIsModalVisible2(false);
  };


  const deleteUserData = () => {
    setIsModalVisible3(false);
    deleteUser({
      variables: {
        id: userId
      }
    })
  };



  const handleCancel = () => {
    setIsModalVisible(false);
    setIsModalVisible2(false);
    setIsModalVisible3(false)
  };


  function handleSubmit() {
    console.log('you have clicked submit');
    console.log(userId);
  }

  return (
    <div className="App">
      <Table columns={columns} dataSource={data.users} />
      <Button type="primary" onClick={createUserModal}>+    Create New User</Button>


      {/* For UPDATING A USER  */}
      <Modal title={`Updating data for ${name}`} visible={isModalVisible} onOk={updateUserData} onCancel={handleCancel}>
        <label htmlFor="">Id: </label>
        <Input type='text' onChange={(e) => setEmail(e.target.value)} placeholder="Company" value={email} style={{ marginTop: '10px', marginBottom: "15px" }} />
        <label htmlFor="" style={{ marginTop: '30px' }}>Name</label>
        <Input type='tezt' placeholder="Age" value={name} style={{ marginTop: '10px' }} onChange={(e) => setName(e.target.value)} />
      </Modal>

      <Modal title={`Are you sure you want to delete ${email}`} visible={isModalVisible3} onOk={deleteUserData} onCancel={handleCancel}>
        <p>By accepting the delete button you will delete the data about this record</p>
      </Modal>




      {  /* For creating a new User */}
      <Modal title={`Creating a new User `} visible={isModalVisible2} onOk={handleOk2} onCancel={handleCancel}>
        <label htmlFor="">Email: </label>
        <Input type='text' onChange={(e) => setEmail(e.target.value)} placeholder="email" value={email} style={{ marginTop: '10px', marginBottom: "15px" }} />
        <p style={{ color: "red" }}>
          {
            createUserError ? createUserError : ""
          }
        </p>

        <label htmlFor="" style={{ marginTop: '30px' }}>Name</label>
        <Input type='tezt' placeholder="Name" value={name} style={{ marginTop: '10px' }} onChange={(e) => setName(e.target.value)} />
      </Modal>


      {/* <Form onFinish={handleSubmit}>
           <Input type="text" placeholder="Post title"/>
           <Input type="text" placeholder="Post body"/>

           <Select onChange={(e) => setUserId(e)}>
           {
             data.users.map((user) => (
              <Option value={user.id} id={user.id}>{user.name}</Option>
             ))
           }
           </Select>
           <Button htmlType="submit">SUBMIT</Button>
        </Form> */}

    </div>


  );
}

export default Users;
