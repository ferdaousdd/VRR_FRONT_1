import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

// Define a service using a base URL and expected endpoints
export const userAuthApi = createApi({
  reducerPath: 'userAuthApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://127.0.0.1:8000/api/user/' }),
  endpoints: (builder) => ({

    
    registerUser: builder.mutation({
      query: (user) => {
        return {
          url: 'register/',
          method: 'POST',
          body: user,
          headers: {
            'Content-type': 'application/json',
          }
        }
      }
    }),
    loginUser: builder.mutation({
      query: (user) => {
        return {
          url: 'login/',
          method: 'POST',
          body: user,
          headers: {
            'Content-type': 'application/json',
          }
        }
      }
    }),
    getLoggedUser: builder.query({
      query: (access_token) => {
        return {
          url: 'profile/',
          method: 'GET',
          headers: {
            'authorization': `Bearer ${access_token}`,
          }
        }
      }
    }),


    UpdateProfile: builder.mutation({
      query: ({ actualData, access_token })  => {
        return {
          url: 'profile/',
          method: 'PUT',
          body: actualData,
          headers: {
            'authorization': `Bearer ${access_token}`,
          }
        }
      }
    }),

    DeleteUser: builder.mutation({
      query: ({access_token ,id}) => {
        return {
          url: `delete/${id}/`,
          method: 'DELETE',
          headers: {
            'Content-type': 'application/json',
            'authorization': `Bearer ${access_token}`,

          }
        }
      }
    }),

    UpdateUsers: builder.mutation({
      query: ({id,userEditData}) => {
        return {
          url: `update/${id}/`, 
          method: 'PUT',
          body: userEditData,
          headers: {
            // 'Content-Type': 'multipart/form-data',
            'Content-type': 'application/json',
          }
        }
      }
    }),

    changeUserPassword: builder.mutation({
      query: ({ actualData, access_token }) => {
        return {
          url: 'changepassword/',
          method: 'POST',
          body: actualData,
          headers: {
            'authorization': `Bearer ${access_token}`,
          }
        }
      }
    }),
    sendPasswordResetEmail: builder.mutation({
      query: (user) => {
        return {
          url: 'send-reset-password-email/',
          method: 'POST',
          body: user,
          headers: {
            'Content-type': 'application/json',
          }
        }
      }
    }),
    resetPassword: builder.mutation({
      query: ({ actualData, id, token }) => {
        return {
          url: `/reset-password/${id}/${token}/`,
          method: 'POST',
          body: actualData,
          headers: {
            'Content-type': 'application/json',
          }
        }
      }
    }),
  }),
})



export const { useRegisterUserMutation, useLoginUserMutation, useGetLoggedUserQuery,useUpdateProfileMutation, useChangeUserPasswordMutation, useSendPasswordResetEmailMutation, useResetPasswordMutation,useDeleteUserMutation ,useUpdateUsersMutation} = userAuthApi