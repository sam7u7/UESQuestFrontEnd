import React, { useState, useEffect, useMemo } from 'react';
import axiosClient from '../axiosClient';
import Card from '../components/Card';
import Button from '../components/Button';
import InputField from '../components/InputField';
import AlertMessage from '../components/AlertMessage';
import { useNavigate } from 'react-router-dom';

function UserManagementPage() {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [formData, setFormData] = useState({
    id: null,
    id_rol: '',
    nombre: '',
    apellido: '',
    telefono: '',
    correo: '',
    password: '',
    created_by: '',
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [alert, setAlert] = useState({ message: '', type: '' });
  const [searchTerm, setSearchTerm] = useState('');

  const navigate = useNavigate();

  const getAuthHeader = () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      setAlert({ message: 'No estás autenticado.', type: 'error' });
      navigate('/login');
      return {};
    }
    return {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json'
      }
    };
  };

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      navigate('/login');
    } else {
      fetchRoles();
      fetchUsers();
      fetchLoggedInUser();
    }
  }, []);

  const fetchLoggedInUser = async () => {
    setIsLoading(true);
    setAlert({ message: '', type: '' });
    try {
      const response = await axiosClient.get('/api/me', getAuthHeader());
      const user = response.data?.correo ? response.data : response.data?.data;

      if (user?.correo) {
        setLoggedInUser(user);
        setFormData(prev => ({ ...prev, created_by: user.correo }));
        setAlert({ message: 'Usuario logueado encontrado.', type: 'success' });
      } else {
        setLoggedInUser(null);
        setAlert({ message: 'Error: No se pudo obtener el correo del usuario logueado.', type: 'error' });
      }
    } catch (error) {
      console.error('Error al obtener el usuario logueado:', error);
      setAlert({ message: 'Error al obtener los datos del usuario logueado.', type: 'error' });
      setLoggedInUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchRoles = async () => {
    setIsLoading(true);
    setAlert({ message: '', type: '' });
    try {
      const response = await axiosClient.get('/api/roles', getAuthHeader());
      const data = Array.isArray(response.data.data) ? response.data.data : response.data;
      if (Array.isArray(data)) {
        setRoles(data);
        setAlert({ message: 'Roles cargados correctamente.', type: 'success' });
      } else {
        setRoles([]);
        setAlert({ message: 'Error: La respuesta de roles no tiene el formato esperado.', type: 'error' });
      }
    } catch (error) {
      console.error('Error al cargar roles:', error);
      setAlert({ message: 'Error al cargar los roles.', type: 'error' });
      setRoles([]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUsers = async () => {
    setIsLoading(true);
    setAlert({ message: '', type: '' });
    try {
      const response = await axiosClient.get('/api/usuarios', getAuthHeader());
      const data = Array.isArray(response.data.data) ? response.data.data : response.data;
      if (Array.isArray(data)) {
        setUsers(data);
        setAlert({ message: 'Usuarios cargados correctamente.', type: 'success' });
      } else {
        setUsers([]);
        setAlert({ message: 'Error: La respuesta de usuarios no tiene el formato esperado.', type: 'error' });
      }
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
      setAlert({ message: 'Error al cargar los usuarios.', type: 'error' });
      setUsers([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "password" && value !== '') {
      const passwordRegex = /^[A-Za-z][A-Za-z0-9!@#$%^&*()_+=-]{7,}$/;
      const hasUpperCase = /[A-Z]/.test(value);
      const hasLowerCase = /[a-z]/.test(value);
      const hasSpecialChar = /[!@#$%^&*()_+=-]/.test(value);

      if (!passwordRegex.test(value) || !hasUpperCase || !hasLowerCase || !hasSpecialChar) {
        setErrors(prev => ({
          ...prev,
          password: "La contraseña debe iniciar con una letra, contener mayúsculas, minúsculas y un símbolo especial.",
        }));
      } else {
        setErrors(prev => ({ ...prev, password: undefined }));
      }
    }

    setFormData({ ...formData, [name]: value });
    setAlert({ message: '', type: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});
    setAlert({ message: '', type: '' });

    const shouldValidatePassword = !formData.id || formData.password !== '';
    const passwordRegex = /^[A-Za-z][A-Za-z0-9!@#$%^&*()_+=-]{7,}$/;
    const hasUpperCase = /[A-Z]/.test(formData.password);
    const hasLowerCase = /[a-z]/.test(formData.password);
    const hasSpecialChar = /[!@#$%^&*()_+=-]/.test(formData.password);

    if (shouldValidatePassword && (!passwordRegex.test(formData.password) || !hasUpperCase || !hasLowerCase || !hasSpecialChar)) {
      setErrors(prev => ({
        ...prev,
        password: "La contraseña debe iniciar con una letra, contener mayúsculas, minúsculas y un símbolo especial.",
      }));
      setAlert({
        message: "La contraseña debe cumplir con:\n- Iniciar con una letra\n- Una mayúscula\n- Una minúscula\n- Un símbolo (!@#$%^&*()_+=-)\n- Mínimo 8 caracteres",
        type: 'error'
      });
      setIsLoading(false);
      return;
    }

    try {
      if (formData.id) {
        const dataToSend = { ...formData };
        if (formData.password === '') delete dataToSend.password;

        const response = await axiosClient.put(`/api/usuarios/${formData.id}`, dataToSend, getAuthHeader());
        setUsers(users.map(u => (u.id === formData.id ? response.data : u)));
        setAlert({ message: 'Usuario actualizado exitosamente.', type: 'success' });
      } else {
        const response = await axiosClient.post('/api/usuarios', formData, getAuthHeader());
        setUsers([...users, response.data]);
        setAlert({ message: 'Usuario creado exitosamente.', type: 'success' });
      }

      setFormData({
        id: null,
        id_rol: '',
        nombre: '',
        apellido: '',
        telefono: '',
        correo: '',
        password: '',
        created_by: loggedInUser?.correo || '',
      });
    } catch (error) {
      console.error('Error al guardar usuario:', error);
      if (error.response?.status === 400 || error.response?.status === 422) {
        setErrors(error.response.data);
        setAlert({ message: error.response.data.message || 'Errores de validación.', type: 'error' });
      } else {
        setAlert({ message: 'Error al guardar el usuario.', type: 'error' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (user) => {
    setFormData({
      id: user.id,
      id_rol: user.id_rol,
      nombre: user.nombre,
      apellido: user.apellido,
      telefono: user.telefono,
      correo: user.correo,
      password: '',
      created_by: user.created_by,
    });
    setErrors({});
    setAlert({ message: 'Editando usuario...', type: 'info' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar este usuario?')) return;

    setIsLoading(true);
    try {
      await axiosClient.delete(`/api/usuarios/${id}`, getAuthHeader());
      setUsers(users.filter(u => u.id !== id));
      setAlert({ message: 'Usuario eliminado exitosamente.', type: 'success' });
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      setAlert({ message: 'Error al eliminar el usuario.', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const filteredUsers = useMemo(() => {
    return users.filter(user =>
      user.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.correo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.telefono && user.telefono.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (roles.find(role => role.id === user.id_rol)?.nombre_rol || '').toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [users, searchTerm, roles]);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <Card title="Gestión de Usuarios" className="w-full max-w-lg md:max-w-2xl">
        {alert.message && <AlertMessage message={alert.message} type={alert.type} />}
        <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-gray-800 text-center">
          {formData.id ? 'Editar Usuario' : 'Crear Nuevo Usuario'}
        </h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="id_rol" className="block text-sm font-medium text-gray-700 mb-1">Rol</label>
            <select
              id="id_rol"
              name="id_rol"
              value={formData.id_rol}
              onChange={handleChange}
              className={`block w-full p-2 border ${errors.id_rol ? 'border-red-500' : 'border-gray-300'} rounded-md bg-gray-50 text-gray-900`}
              required
              disabled={isLoading}
            >
              <option value="">Selecciona un rol</option>
              {roles.map(role => (
                <option key={role.id} value={role.id}>{role.nombre_rol}</option>
              ))}
            </select>
            {errors.id_rol && <p className="text-xs text-red-600">{errors.id_rol}</p>}
          </div>

          <InputField label="Nombre" type="text" name="nombre" value={formData.nombre} onChange={handleChange} required disabled={isLoading} error={errors.nombre} />
          <InputField label="Apellido" type="text" name="apellido" value={formData.apellido} onChange={handleChange} required disabled={isLoading} error={errors.apellido} />
          <InputField label="Teléfono" type="text" name="telefono" value={formData.telefono} onChange={handleChange} disabled={isLoading} error={errors.telefono} />
          <InputField label="Correo" type="email" name="correo" value={formData.correo} onChange={handleChange} required disabled={isLoading} error={errors.correo} />
          <InputField
            label="Contraseña"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required={!formData.id}
            disabled={isLoading}
            error={errors.password}
          />

          <div className="md:col-span-2 flex justify-end space-x-2 mt-4">
            <Button type="submit" variant="primary" disabled={isLoading}>
              {isLoading ? "Cargando..." : formData.id ? 'Actualizar Usuario' : 'Crear Usuario'}
            </Button>
            {formData.id && (
              <Button type="button" variant="secondary" onClick={() => setFormData({
                id: null, id_rol: '', nombre: '', apellido: '', telefono: '', correo: '', password: '', created_by: ''
              })} disabled={isLoading}>
                Cancelar
              </Button>
            )}
          </div>
        </form>

        <InputField
          label="Buscar Usuario"
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          disabled={isLoading}
          className="w-full mt-4 border border-gray-400 rounded-md focus:ring-2 focus:ring-gray-500 focus:border-gray-600"
        />

        <div className="overflow-x-auto mt-4">
          <table className="w-full min-w-max border border-gray-200 rounded-lg text-sm">
            <thead className="bg-gray-50 text-xs sm:text-sm">
              <tr>
                <th className="px-2 sm:px-4 py-2">ID</th>
                <th className="px-2 sm:px-4 py-2">Rol</th>
                <th className="px-2 sm:px-4 py-2">Nombre</th>
                <th className="px-2 sm:px-4 py-2">Teléfono</th>
                <th className="px-2 sm:px-4 py-2">Correo</th>
                <th className="px-2 sm:px-4 py-2">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="text-xs sm:text-sm">
                  <td className="px-2 sm:px-4 py-2">{user.id}</td>
                  <td className="px-2 sm:px-4 py-2">{roles.find(role => role.id === user.id_rol)?.nombre_rol || 'Desconocido'}</td>
                  <td className="px-2 sm:px-4 py-2">{user.nombre} {user.apellido}</td>
                  <td className="px-2 sm:px-4 py-2">{user.telefono}</td>
                  <td className="px-2 sm:px-4 py-2">{user.correo}</td>
                  <td className="px-2 sm:px-4 py-2 flex flex-wrap justify-center gap-1">
                    <Button onClick={() => handleEdit(user)} variant="tertiary" disabled={isLoading}>Editar</Button>
                    <Button onClick={() => handleDelete(user.id)} variant="danger" disabled={isLoading}>Eliminar</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

export default UserManagementPage;
