import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const { name, email, password } = formData;
  const navigate = useNavigate();

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/users/register', formData);
      
      if (response.data) {
        localStorage.setItem('user', JSON.stringify(response.data));
        toast.success('Registration successful!');
        navigate('/'); 
      }
    } catch (error) {
      const message = 
        error.response?.data?.error?.message || 
        error.message || 
        'Registration failed';
      toast.error(message);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-8 bg-white rounded-xl shadow-lg border border-gray-100">
      <section className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Register</h1>
        <p className="text-gray-500">Please create an account</p>
      </section>

      <section>
        <form onSubmit={onSubmit} className="flex flex-col gap-5">
          <div>
            <input 
              type="text" 
              name="name" 
              value={name} 
              placeholder="Enter your name" 
              onChange={onChange} 
              required 
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
          <div>
            <input 
              type="email" 
              name="email" 
              value={email} 
              placeholder="Enter your email" 
              onChange={onChange} 
              required 
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
          <div>
            <input 
              type="password" 
              name="password" 
              value={password} 
              placeholder="Enter password" 
              onChange={onChange} 
              required 
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
          <button 
            type="submit" 
            className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition-colors mt-2 shadow-md hover:shadow-lg"
          >
            Submit
          </button>
        </form>
      </section>
    </div>
  );
}

export default Register;