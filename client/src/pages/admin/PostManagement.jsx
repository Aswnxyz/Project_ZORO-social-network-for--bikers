import React, { useEffect, useImperativeHandle, useState } from 'react'
import { useAdminGetPostsMutation, useHandlePostBlockMutation } from '../../utils/slices/adminApiSlice';
import Swal from "sweetalert2"
import AdminPostDetail from '../../components/AdminPostDetail';


const PostManagement = () => {
  const [postsList, setPostsList] = useState([]);
  const [selectedPost,setSelectedPost]=useState('')

  const [getPosts] = useAdminGetPostsMutation();
  const [blockPost] = useHandlePostBlockMutation()

  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(10); // You can change the number of posts per page
  const [totalPages,setTotalPages] = useState(0)

//  const handleOpenPostModal= (_id)=>{
//   setPostId(_id);

//  }

  const fetchData = async () => {
    try {
      const {posts,totalPages} = await getPosts({currentPage,postsPerPage}).unwrap();
      setPostsList(posts);
      setTotalPages(totalPages)

    } catch (error) {
      console.log(error);
    }
  }; 

  const hanldeBlock = async (postId)=>{
   const result = await Swal.fire({
     title: "Are you sure?",

     icon: "warning",
     showCancelButton: true,
     confirmButtonColor: "#3085d6",
     cancelButtonColor: "#d33",
     confirmButtonText: "Yes!",
   });

   if (result.isConfirmed) {
     try {
       const res = await blockPost({ postId }).unwrap();
       setPostsList((prevPosts) =>
         prevPosts.map((post) =>
           post._id === postId ? { ...post, isActive: !post.isActive } : post
         )
       );

     } catch (error) {
       console.log(error);
     }
   }
  }

  useEffect(() => {
    fetchData();
  }, [currentPage]);


  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <>
      <h1 className="text-white text-2xl font-bold">Posts</h1>
      <div class="my-5 relative overflow-x-auto shadow-md sm:rounded-lg">
        <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" class="px-6 py-3">
                Post ID
              </th>
              <th scope="col" class="px-6 py-3">
                User ID
              </th>
              <th scope="col" class="px-6 py-3">
                Created
              </th>
              <th scope="col" class="px-6 py-3">
                Reported
              </th>

              <th scope="col" class="px-6 py-3">
                Options
              </th>
            </tr>
          </thead>
          <tbody>
            {postsList?.map((post, index) => (
              <>
                <tr
                  key={post?._id}
                  class="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                >
                  <th
                    scope="row"
                    class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    {post?._id}
                  </th>
                  <td class="px-6 py-4">{post?.userId}</td>
                  <td class="px-6 py-4">
                    {new Date(post?.createdAt).toLocaleString()}
                  </td>
                  <td class="px-6 py-4">{post?.reported?.length}</td>

                  <td class="px-6 py-4">
                    <div className="text-white space-x-4">
                      <button
                      onClick={()=>setSelectedPost(post)}
                       className="bg-green-600 px-4 rounded-xl">
                        More
                      </button>
                      <button
                        onClick={() => hanldeBlock(post._id)}
                        className={`${
                          post.isActive ? "bg-red-600" : "bg-gray-600"
                        } px-4 rounded-xl`}
                      >
                        {post.isActive ? "Block" : "Unblock"}
                      </button>
                    </div>
                  </td>
                </tr>
              </>
            ))}
          </tbody>
        </table>
      </div>
      {/* Pagination controls */}
      <div className="flex justify-center mt-4">
        {[...Array(totalPages).keys()].map((page) => (
          <button
            key={page + 1}
            onClick={() => handlePageChange(page + 1)}
            className={`mx-1 px-3 py-1 rounded-md ${
              currentPage === page + 1
                ? "bg-blue-500 text-white"
                : "bg-gray-200"
            }`}
          >
            {page + 1}
          </button>
        ))}
      </div>
      {selectedPost &&  <AdminPostDetail post={selectedPost} onClose={()=> setSelectedPost("")} />}
    </>
  );
}

export default PostManagement




