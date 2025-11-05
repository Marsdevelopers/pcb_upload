import React, { useState, useEffect } from 'react';
import { Upload, Send, LogIn, LogOut, FileText, User, Mail, Phone, CheckCircle, AlertCircle, Loader } from 'lucide-react';

// Main App Component
export default function PCBUploadApp() {
  const [view, setView] = useState('home');
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  useEffect(() => {
    const adminToken = sessionStorage.getItem('adminToken');
    if (adminToken) {
      setIsAdminLoggedIn(true);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Header 
        view={view} 
        setView={setView} 
        isAdminLoggedIn={isAdminLoggedIn}
        setIsAdminLoggedIn={setIsAdminLoggedIn}
      />
      
      {view === 'home' && <UploadForm setView={setView} />}
      {view === 'admin' && !isAdminLoggedIn && <AdminLogin setIsAdminLoggedIn={setIsAdminLoggedIn} setView={setView} />}
      {view === 'admin' && isAdminLoggedIn && <AdminPanel />}
      {view === 'success' && <SuccessMessage setView={setView} />}
    </div>
  );
}

function Header({ view, setView, isAdminLoggedIn, setIsAdminLoggedIn }) {
  const handleLogout = () => {
    sessionStorage.removeItem('adminToken');
    setIsAdminLoggedIn(false);
    setView('home');
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
        <div 
          className="flex items-center space-x-2 cursor-pointer"
          onClick={() => setView('home')}
        >
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
            <FileText className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">PCB Upload</h1>
            <p className="text-xs text-gray-500">Gerber File Submission</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          {isAdminLoggedIn ? (
            <>
              <button
                onClick={() => setView('admin')}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition"
              >
                Dashboard
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <button
              onClick={() => setView('admin')}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
            >
              <LogIn className="w-4 h-4" />
              <span>Admin Login</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

function UploadForm({ setView }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    notes: ''
  });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const validExtensions = ['.gbr', '.zip', '.rar', '.gbl', '.gtl', '.gbs', '.gts'];
      const fileName = selectedFile.name.toLowerCase();
      const isValid = validExtensions.some(ext => fileName.endsWith(ext));
      
      if (isValid || selectedFile.type === 'application/zip' || selectedFile.type === 'application/x-rar-compressed') {
        setFile(selectedFile);
        setError('');
      } else {
        setError('Please upload a valid Gerber file (.gbr, .zip, .rar)');
        setFile(null);
      }
    }
  };

  const handleSubmit = async () => {
    setError('');
    
    if (!file) {
      setError('Please select a file to upload');
      return;
    }

    if (!formData.name || !formData.email || !formData.phone) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setFormData({ name: '', email: '', phone: '', notes: '' });
      setFile(null);
      setView('success');
    } catch (err) {
      setError('Upload failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-6">
          <h2 className="text-2xl font-bold text-white">Upload Your PCB Design</h2>
          <p className="text-blue-100 mt-1">Submit your Gerber files for manufacturing</p>
        </div>

        <div className="p-8 space-y-6">
          {error && (
            <div className="flex items-center space-x-2 p-4 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          <div>
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
              <User className="w-4 h-4" />
              <span>Full Name *</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              placeholder="John Doe"
            />
          </div>

          <div>
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
              <Mail className="w-4 h-4" />
              <span>Email Address *</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              placeholder="john@example.com"
            />
          </div>

          <div>
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
              <Phone className="w-4 h-4" />
              <span>Phone Number *</span>
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              placeholder="+91 98765 43210"
            />
          </div>

          <div>
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
              <FileText className="w-4 h-4" />
              <span>Additional Notes</span>
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              rows="3"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
              placeholder="Any special instructions or requirements..."
            />
          </div>

          <div>
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
              <Upload className="w-4 h-4" />
              <span>Gerber Files *</span>
            </label>
            <div className="relative">
              <input
                type="file"
                onChange={handleFileChange}
                accept=".gbr,.zip,.rar,.gbl,.gtl,.gbs,.gts"
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="flex items-center justify-center w-full px-4 py-8 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition"
              >
                <div className="text-center">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">
                    {file ? file.name : 'Click to upload Gerber files'}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Supports .gbr, .zip, .rar formats
                  </p>
                </div>
              </label>
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full flex items-center justify-center space-x-2 px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                <span>Uploading...</span>
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                <span>Submit PCB Design</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

function SuccessMessage({ setView }) {
  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-12 text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-12 h-12 text-green-600" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Upload Successful!</h2>
        <p className="text-gray-600 mb-8">
          Your PCB design has been submitted successfully. Our team will review it and contact you soon.
        </p>
        <button
          onClick={() => setView('home')}
          className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition"
        >
          Submit Another Design
        </button>
      </div>
    </div>
  );
}

function AdminLogin({ setIsAdminLoggedIn, setView }) {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setError('');
    setLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (credentials.username === 'admin' && credentials.password === 'admin123') {
        sessionStorage.setItem('adminToken', 'demo-token-12345');
        setIsAdminLoggedIn(true);
        setView('admin');
      } else {
        setError('Invalid username or password');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-6">
          <h2 className="text-2xl font-bold text-white">Admin Login</h2>
          <p className="text-blue-100 mt-1">Access the admin dashboard</p>
        </div>

        <div className="p-8 space-y-6">
          {error && (
            <div className="flex items-center space-x-2 p-4 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800 font-medium">Demo Credentials:</p>
            <p className="text-sm text-blue-600 mt-1">Username: admin</p>
            <p className="text-sm text-blue-600">Password: admin123</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Username
            </label>
            <input
              type="text"
              value={credentials.username}
              onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              placeholder="Enter username"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              value={credentials.password}
              onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              placeholder="Enter password"
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full flex items-center justify-center space-x-2 px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                <span>Logging in...</span>
              </>
            ) : (
              <>
                <LogIn className="w-5 h-5" />
                <span>Login</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

function AdminPanel() {
  const [submissions, setSubmissions] = useState([
    {
      id: 1,
      name: 'Rajesh Kumar',
      email: 'rajesh@example.com',
      phone: '+91 98765 43210',
      notes: 'Need 2-layer PCB, urgent delivery',
      fileName: 'pcb_design_v1.zip',
      fileUrl: '#',
      submittedAt: '2025-11-05 10:30 AM',
      status: 'new'
    },
    {
      id: 2,
      name: 'Priya Sharma',
      email: 'priya.s@example.com',
      phone: '+91 87654 32109',
      notes: 'Standard specifications, 4-layer board',
      fileName: 'gerber_files.zip',
      fileUrl: '#',
      submittedAt: '2025-11-04 03:15 PM',
      status: 'reviewed'
    }
  ]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadSubmissions();
  }, []);

  const loadSubmissions = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (err) {
      console.error('Failed to load submissions');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = (id, newStatus) => {
    setSubmissions(submissions.map(sub => 
      sub.id === id ? { ...sub, status: newStatus } : sub
    ));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-6">
          <h2 className="text-2xl font-bold text-white">Admin Dashboard</h2>
          <p className="text-blue-100 mt-1">Manage PCB submissions</p>
        </div>

        <div className="p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="px-4 py-2 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-600">Total Submissions</p>
                <p className="text-2xl font-bold text-blue-600">{submissions.length}</p>
              </div>
              <div className="px-4 py-2 bg-green-50 rounded-lg">
                <p className="text-sm text-gray-600">New</p>
                <p className="text-2xl font-bold text-green-600">
                  {submissions.filter(s => s.status === 'new').length}
                </p>
              </div>
            </div>
            <button
              onClick={loadSubmissions}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
            >
              Refresh
            </button>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <Loader className="w-8 h-8 animate-spin text-blue-600 mx-auto" />
              <p className="text-gray-600 mt-4">Loading submissions...</p>
            </div>
          ) : (
            <div className="space-y-4">
              {submissions.map(submission => (
                <div
                  key={submission.id}
                  className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {submission.name}
                        </h3>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            submission.status === 'new'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-blue-100 text-blue-700'
                          }`}
                        >
                          {submission.status}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                        <div className="flex items-center space-x-2">
                          <Mail className="w-4 h-4" />
                          <span>{submission.email}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Phone className="w-4 h-4" />
                          <span>{submission.phone}</span>
                        </div>
                      </div>
                      {submission.notes && (
                        <p className="mt-3 text-sm text-gray-600 bg-gray-50 p-3 rounded">
                          <strong>Notes:</strong> {submission.notes}
                        </p>
                      )}
                    </div>
                    <div className="text-right text-sm text-gray-500">
                      {submission.submittedAt}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <a
                      href={submission.fileUrl}
                      className="flex items-center space-x-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition"
                    >
                      <FileText className="w-4 h-4" />
                      <span>{submission.fileName}</span>
                    </a>
                    <select
                      value={submission.status}
                      onChange={(e) => updateStatus(submission.id, e.target.value)}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="new">New</option>
                      <option value="reviewed">Reviewed</option>
                      <option value="processing">Processing</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}