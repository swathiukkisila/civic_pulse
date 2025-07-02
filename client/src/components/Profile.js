import React, { useState, useEffect } from 'react';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState('');
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [alert, setAlert] = useState({ type: '', message: '' });
  const [editMode, setEditMode] = useState(false);

  const API_BASE_URL = process.env.REACT_APP_BASE_URL;

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      try {
        const res = await fetch(`${API_BASE_URL}/api/users/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error('Failed to fetch profile');

        const data = await res.json();

        if (!data || !data.name) throw new Error('Profile data is incomplete');

        setProfile(data);
        setName(data.name);
        if (data.avatar) setAvatarPreview(`${API_BASE_URL}/uploads/${data.avatar}`);
      } catch (err) {
        console.error('Fetch profile error:', err);
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [API_BASE_URL]);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    setAvatar(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setAvatarPreview(profile?.avatar ? `${API_BASE_URL}/uploads/${profile.avatar}` : '');
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setUpdating(true);
    setAlert({ type: '', message: '' });

    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('name', name);
    if (avatar) formData.append('avatar', avatar);

    try {
      const res = await fetch(`${API_BASE_URL}/api/users/profile`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        setProfile(data.user);
        setAlert({ type: 'success', message: data.message || 'Profile updated successfully!' });
        setEditMode(false);
      } else {
        setAlert({ type: 'danger', message: data.message || 'Update failed.' });
      }
    } catch (error) {
      console.error(error);
      setAlert({ type: 'danger', message: 'An error occurred. Please try again.' });
    } finally {
      setUpdating(false);
    }
  };

  if (loading)
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: '80vh', backgroundColor: '#E6E6FA' }}
      >
        <div className="spinner-border text-secondary" role="status" aria-label="Loading profile...">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );

  if (!profile)
    return (
      <div className="alert alert-danger text-center mt-5" style={{ backgroundColor: '#E6E6FA' }}>
        Unable to load profile. Please try again later.
      </div>
    );

  return (
    <div style={{ backgroundColor: '#E6E6FA', minHeight: '100vh', paddingTop: '50px', paddingBottom: '50px' }}>
      <div className="container d-flex justify-content-center">
        <div
          className="card shadow-sm rounded-4 p-4"
          style={{ maxWidth: '450px', width: '100%', backgroundColor: '#F8F8FF', border: '1px solid #d6d6f0' }}
        >
          <h3 className="mb-4 text-center fw-bold" style={{ color: '#4B3F72' }}>
            My Profile
          </h3>

          {alert.message && (
            <div className={`alert alert-${alert.type} alert-dismissible fade show`} role="alert">
              {alert.message}
              <button
                type="button"
                className="btn-close"
                onClick={() => setAlert({ type: '', message: '' })}
              ></button>
            </div>
          )}

          <div className="d-flex flex-column align-items-center gap-3 mb-4">
            <div className="position-relative" style={{ width: '120px', height: '120px' }}>
              <img
                src={
                  avatarPreview ||
                  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRKaiKiPcLJj7ufrj6M2KaPwyCT4lDSFA5oog&s'
                }
                alt="Avatar"
                className="rounded-circle border border-2"
                style={{
                  width: '120px',
                  height: '120px',
                  objectFit: 'cover',
                  borderColor: '#7367F0',
                  transition: 'all 0.3s ease',
                }}
              />
            </div>

            {!editMode ? (
              <>
                <h4 className="mb-1" style={{ color: '#362c60' }}>
                  {profile.name}
                </h4>
                <p className="text-secondary mb-3" style={{ fontSize: '0.9rem' }}>
                  <strong>Email:</strong> {profile.email}
                </p>

                <button
                  className="btn"
                  style={{
                    backgroundColor: '#7367F0',
                    color: 'white',
                    padding: '8px 20px',
                    borderRadius: '25px',
                    fontWeight: '600',
                    boxShadow: '0 4px 8px rgba(115, 103, 240, 0.4)',
                    transition: 'background-color 0.3s ease',
                  }}
                  onClick={() => setEditMode(true)}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#5a4ecc')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#7367F0')}
                >
                  Update Profile
                </button>
              </>
            ) : (
              <form className="w-100" onSubmit={handleUpdate}>
                <div className="form-floating mb-3">
                  <input
                    type="text"
                    id="name"
                    className="form-control"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    disabled={updating}
                    style={{ borderRadius: '12px' }}
                  />
                  <label htmlFor="name">Name</label>
                </div>

                <label className="form-label fw-semibold">Upload Avatar</label>
                <input
                  type="file"
                  className="form-control mb-4"
                  id="avatarUpload"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  disabled={updating}
                  style={{ borderRadius: '12px' }}
                />

                <div className="d-flex gap-3 justify-content-center">
                  <button
                    className="btn"
                    type="submit"
                    disabled={updating}
                    style={{
                      backgroundColor: '#7367F0',
                      color: 'white',
                      padding: '8px 30px',
                      borderRadius: '25px',
                      fontWeight: '600',
                      boxShadow: '0 4px 8px rgba(115, 103, 240, 0.4)',
                      transition: 'background-color 0.3s ease',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#5a4ecc')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#7367F0')}
                  >
                    {updating ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                          aria-hidden="true"
                        ></span>
                        Updating...
                      </>
                    ) : (
                      'Save Changes'
                    )}
                  </button>
                  <button
                    className="btn btn-outline-secondary"
                    type="button"
                    onClick={() => {
                      setEditMode(false);
                      setName(profile.name);
                      setAvatar(null);
                      setAvatarPreview(profile.avatar ? `${API_BASE_URL}/uploads/${profile.avatar}` : '');
                      setAlert({ type: '', message: '' });
                    }}
                    disabled={updating}
                    style={{ borderRadius: '25px', padding: '8px 30px' }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
