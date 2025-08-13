import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios";
import toast from "react-hot-toast";
import { BASE_URL } from '../App.js'; // Ensure correct path

const Signup = () => {
  const [user, setUser] = useState({
    fullName: "",
    username: "",
    password: "",
    confirmPassword: "",
    gender: "male", // default
  });

  const navigate = useNavigate();

  const handleGenderChange = (gender) => {
    setUser({ ...user, gender });
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if(user.password !== user.confirmPassword){
      toast.error("Passwords do not match!");
      return;
    }

    try {
      const res = await axios.post(`${BASE_URL}/api/v1/user/register`, user, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true
      });

      if (res.data?.success) {
        toast.success(res.data.message);
        navigate("/login");
        setUser({
          fullName: "",
          username: "",
          password: "",
          confirmPassword: "",
          gender: "male",
        });
      }

    } catch (error) {
      const msg = error?.response?.data?.message || "Something went wrong!";
      toast.error(msg);
      console.log(error);
    }
  };

  return (
    <div className="min-w-96 mx-auto">
      <div className='w-full p-6 rounded-lg shadow-md bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-md bg-opacity-10 border border-gray-100'>
        <h1 className='text-3xl font-bold text-center'>Signup</h1>
        <form onSubmit={onSubmitHandler}>
          <div>
            <label className='label p-2'><span className='text-base label-text'>Full Name</span></label>
            <input
              value={user.fullName}
              onChange={(e) => setUser({ ...user, fullName: e.target.value })}
              className='w-full input input-bordered h-10'
              type="text"
              placeholder='Full Name' />
          </div>

          <div>
            <label className='label p-2'><span className='text-base label-text'>Username</span></label>
            <input
              value={user.username}
              onChange={(e) => setUser({ ...user, username: e.target.value })}
              className='w-full input input-bordered h-10'
              type="text"
              placeholder='Username' />
          </div>

          <div>
            <label className='label p-2'><span className='text-base label-text'>Password</span></label>
            <input
              value={user.password}
              onChange={(e) => setUser({ ...user, password: e.target.value })}
              className='w-full input input-bordered h-10'
              type="password"
              placeholder='Password' />
          </div>

          <div>
            <label className='label p-2'><span className='text-base label-text'>Confirm Password</span></label>
            <input
              value={user.confirmPassword}
              onChange={(e) => setUser({ ...user, confirmPassword: e.target.value })}
              className='w-full input input-bordered h-10'
              type="password"
              placeholder='Confirm Password' />
          </div>

          <div className='flex items-center my-4'>
            <label className='flex items-center mr-4'>
              <input
                type="radio"
                name="gender"
                checked={user.gender === "male"}
                onChange={() => handleGenderChange("male")}
                className="radio mr-2" />
              Male
            </label>
            <label className='flex items-center'>
              <input
                type="radio"
                name="gender"
                checked={user.gender === "female"}
                onChange={() => handleGenderChange("female")}
                className="radio mr-2" />
              Female
            </label>
          </div>

          <p className='text-center my-2'>Already have an account? <Link to="/login">Login</Link></p>
          <div>
            <button type='submit' className='btn btn-block btn-sm mt-2 border border-slate-700'>Signup</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Signup;
