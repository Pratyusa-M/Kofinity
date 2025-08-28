// src/pages/admin/Login.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import eye from '../../assets/eye.svg';
import hideeye from '../../assets/hideeye.svg';
import { baseUrl } from '../../utils/baseUrl';
import { TailSpin } from 'react-loader-spinner';

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: '',
      password: ''
    },
    validationSchema: Yup.object({
      email: Yup.string().email('Invalid email address').required('Required'),
      password: Yup.string().min(5, 'Must be at least 5 characters').required('Required')
    }),
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const response = await axios.post(
          `${baseUrl}admin/admin-login`,
          {
            email: values.email,
            password: values.password
          }
        );
        console.log(response);
        localStorage.setItem('admin-token', response.data.data.token);
        toast.success('Login successful');
        setTimeout(() => {
        navigate('/admin-dashboard');
        }
        , 1000);
      } catch (error) {
        console.error(error);
        const msg =
          error.response?.data?.message ||
          'Login failed. Please check your credentials.';
        toast.error(msg);
      } finally {
        setSubmitting(false);
      }
    }
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-slate-900 to-slate-800 px-4">
      <ToastContainer position="top-right" />
      <div className="w-full max-w-md p-8 space-y-6 bg-slate-900/60 backdrop-blur-xl rounded-2xl border border-slate-800 shadow-xl">
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-yellow-400 rounded-xl" />
          </div>
          <h2 className="text-2xl font-bold text-white">Kofinity Admin</h2>
        </div>

        <form onSubmit={formik.handleSubmit} className="space-y-6">
          <div className="space-y-1">
            <label htmlFor="email" className="text-sm text-slate-400">Email ID</label>
            <input
              id="email"
              type="email"
              name="email"
              placeholder="admin@example.com"
              className="w-full bg-slate-800/50 border border-slate-700 text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.email}
            />
            {formik.touched.email && formik.errors.email && (
              <p className="text-sm text-red-500">{formik.errors.email}</p>
            )}
          </div>

          <div className="space-y-1">
            <label htmlFor="password" className="text-sm text-slate-400">Password</label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="••••••••"
                className="w-full bg-slate-800/50 border border-slate-700 text-white px-4 py-2 pr-10 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.password}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                <img
                  src={showPassword ? hideeye : eye}
                  alt={showPassword ? 'Hide password' : 'Show password'}
                  className="w-5 h-5"
                />
              </button>
            </div>
            {formik.touched.password && formik.errors.password && (
              <p className="text-sm text-red-500">{formik.errors.password}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={formik.isSubmitting}
            className="w-full bg-purple-600 flex justify-center items-center hover:bg-purple-700 transition-all duration-200 text-white py-2 rounded-md font-medium disabled:opacity-50"
          >
            {formik.isSubmitting ? (<TailSpin
        height="20"
        width="20"
        color="white"
        ariaLabel="tail-spin-loading"
        radius="1"
        wrapperStyle={{}}
        wrapperClass=""
        visible={true}
      /> ) : 'Login'}
          </button>
        </form>

        <div className="text-center text-xs text-slate-500 mt-4">
          © 2025 Kofinity. All rights reserved.
        </div>
      </div>
    </div>
  );
};

export default Login;
