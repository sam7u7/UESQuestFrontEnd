import React, { useState, useEffect, useMemo } from 'react';
import axiosClient from '../axiosClient';
import Card from '../components/Card';
import Button from '../components/Button';
import InputField from '../components/InputField';
import AlertMessage from '../components/AlertMessage';
import { useNavigate } from 'react-router-dom';

function EstadoUsuariosPage() {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [alert, setAlert] = useState({ message: '', type: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const getAuthHeader = () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      setAlert({ message: 'No estás autenticado. Por favor, inicia sesión.', type: 'error' });
      navigate('/login');
      return {};
    }
    return {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    };
  };

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      navigate('/login');
    } else {
      fetchRoles();
      fetchUsers();
    }
  }, []);

  const fetchRoles = async () => {
    try {
      const response = await axiosClient.get('/api/roles', getAuthHeader());
      const rolesData = Array.isArray(response.data.data)
        ? response.data.data
        : Array.isArray(response.data)
        ? response.data
        : [];

      if (!rolesData.length) {
        throw new Error('La respuesta de roles no tiene el formato esperado.');
      }

      setRoles(rolesData);
    } catch (error) {
      console.error('Error al cargar roles:', error);
      setRoles([]);
      setAlert({
        message: 'Error al cargar los roles. Verifica la API y tus permisos.',
        type: 'error',
      });
    }
  };

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await axiosClient.get('/api/usuarios/estado-usuarios', getAuthHeader());
      const usersData = Array.isArray(response.data)
        ? response.data
        : response.data?.data || [];

      if (!usersData.length) {
        throw new Error('La respuesta de usuarios no tiene el formato esperado.');
      }

      setUsers(usersData);
      setAlert({ message: 'Usuarios cargados correctamente.', type: 'success' });
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
      setUsers([]);
      setAlert({
        message: 'Error al cargar los usuarios. Verifica la API y tus permisos.',
        type: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleUserStatus = async (user) => {
    const isCurrentlyInactive = user.deleted_at !== null;
    const confirmMessage = isCurrentlyInactive
      ? `¿Rehabilitar al usuario ${user.nombre} ${user.apellido}?`
      : `¿Inhabilitar al usuario ${user.nombre} ${user.apellido}?`;

    if (!window.confirm(confirmMessage)) return;

    setIsLoading(true);
    try {
      const endpoint = isCurrentlyInactive
        ? `/api/usuarios/${user.id}/restaurar`
        : `/api/usuarios/${user.id}/inhabilitar`;

      const method = isCurrentlyInactive ? 'post' : 'delete';
      const response = await axiosClient[method](endpoint, {}, getAuthHeader());

      setUsers((prev) =>
        prev.map((u) => (u.id === user.id ? response.data : u))
      );

      setAlert({
        message: isCurrentlyInactive
          ? 'Usuario rehabilitado exitosamente.'
          : 'Usuario inhabilitado exitosamente.',
        type: 'success',
      });
    } catch (error) {
      console.error('Error al cambiar el estado:', error);
      setAlert({
        message:
          error.response?.data?.message ||
          'Ocurrió un error al actualizar el estado del usuario.',
        type: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const rolNombre = roles.find((r) => r.id === user.id_rol)?.nombre_rol || 'Desconocido';
      const estado = user.deleted_at === null ? 'activo' : 'inactivo';
      return (
        user.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.correo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.telefono || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        rolNombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        estado.includes(searchTerm.toLowerCase())
      );
    });
  }, [users, searchTerm, roles]);

  return (
    <div className="min-h-screen bg-gray-100 pt-24 p-4 sm:p-6 lg:p-8">
  <div className="max-w-7xl mx-auto">
    <h1 className="text-2xl font-bold mb-6 text-center">Estado de Usuarios</h1>

    <Card title="Gestión de Estado de Usuarios">
      {alert.message && <AlertMessage message={alert.message} type={alert.type} />}

      <div className="mb-4">
        <InputField
          label="Buscar Usuario"
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          disabled={isLoading}
          className="w-full border border-gray-300 rounded-md p-2"
        />
      </div>

      {isLoading && filteredUsers.length === 0 ? (
        <p className="text-center text-gray-600 mt-4">Cargando usuarios...</p>
      ) : filteredUsers.length === 0 ? (
        <p className="text-center text-gray-600 mt-4">
          No hay usuarios registrados que coincidan con la búsqueda.
        </p>
      ) : (
        <div className="overflow-x-auto mt-6 shadow-md rounded-lg">
          <table className="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-lg text-xs sm:text-sm md:text-base">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left font-medium text-gray-500 uppercase">ID</th>
                <th className="px-4 py-2 text-left font-medium text-gray-500 uppercase">Rol</th>
                <th className="px-4 py-2 text-left font-medium text-gray-500 uppercase">Nombre</th>
                <th className="px-4 py-2 text-left font-medium text-gray-500 uppercase">Correo</th>
                <th className="px-4 py-2 text-left font-medium text-gray-500 uppercase">Estado</th>
                <th className="px-4 py-2 text-left font-medium text-gray-500 uppercase">Inhabilitado Desde</th>
                <th className="px-4 py-2 text-left font-medium text-gray-500 uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 whitespace-nowrap">{user.id}</td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    {roles.find(role => role.id === user.id_rol)?.nombre_rol || 'Desconocido'}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">{user.nombre} {user.apellido}</td>
                  <td className="px-4 py-2 whitespace-nowrap">{user.correo}</td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs font-semibold rounded-full ${user.deleted_at === null ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {user.deleted_at === null ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    {user.deleted_at ? new Date(user.deleted_at).toLocaleDateString('es-SV') : ''}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    <button
                      onClick={() => handleToggleUserStatus(user)}
                      disabled={isLoading}
                      className={`w-full sm:w-auto py-2 px-4 rounded-md font-semibold text-white transition duration-200 
                        ${user.deleted_at === null 
                          ? 'bg-red-600 hover:bg-red-700 focus:ring-2 focus:ring-red-300' 
                          : 'bg-green-600 hover:bg-green-700 focus:ring-2 focus:ring-green-300'}
                        ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {user.deleted_at === null ? 'Inhabilitar' : 'Rehabilitar'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  </div>
</div>

  );
}

export default EstadoUsuariosPage;
