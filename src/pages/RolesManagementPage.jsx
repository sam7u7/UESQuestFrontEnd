import React, { useState, useEffect, useMemo } from 'react';
import axiosClient from '../axiosClient'; 
import Card from '../components/Card';
import Button from '../components/Button';
import InputField from '../components/InputField';
import AlertMessage from '../components/AlertMessage';


function RolesManagementPage() {
  const [roles, setRoles] = useState([]);
  const [newRoleName, setNewRoleName] = useState('');
  const [editRole, setEditRole] = useState(null);
  const [alert, setAlert] = useState({ message: '', type: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    console.log(token);
    return {
      headers:{
        Authorization: `Bearer ${token}`
      }
      
    };
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    setIsLoading(true);
    setAlert({ message: '', type: 'info' });
    try {
      //const response = await axios.get(`${API_BASE_URL}/roles`, getAuthHeader());
      const response = await axiosClient.get('/api/roles');
      // Laravel devuelve directamente el array de roles
      if (Array.isArray(response.data)) {
        setRoles(response.data);
      } else if (response.data.data) {
        // Por si acaso la API devuelve { data: [...] }
        setRoles(response.data.data);
      } else {
        setRoles([]);
      }
    } catch (error) {
      console.error('Error al obtener roles:', error);
      setAlert({
        message: error.response?.data?.message || 'Error al cargar los roles.',
        type: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAlert({ message: '', type: 'info' });

    if (!newRoleName.trim()) {
      setAlert({ message: 'El nombre del rol no puede estar vacío.', type: 'error' });
      return;
    }

    setIsLoading(true);
    try {
      if (editRole) {
        await axiosClient.put(`/api/roles/${editRole.id}`, {
          nombre_rol: newRoleName,
        }, getAuthHeader());
        setAlert({ message: 'Rol actualizado exitosamente.', type: 'success' });
        setEditRole(null);
      } else {
        await axiosClient.post(`/api/roles`, {
          nombre_rol: newRoleName,
        }, getAuthHeader());
        setAlert({ message: 'Rol creado exitosamente.', type: 'success' });
      }
      setNewRoleName('');
      fetchRoles();
    } catch (error) {
      console.error('Error al guardar rol:', error);
      const errorMessage = error.response?.data?.message || 'Error al guardar el rol.';
      setAlert({ message: errorMessage, type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (role) => {
    setNewRoleName(role.nombre_rol);
    setEditRole(role);
    setAlert({ message: 'Editando rol...', type: 'info' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar este rol?')) return;
    setIsLoading(true);
    try {
      await axiosClient.delete(`/api/roles/${id}`, getAuthHeader());
      setAlert({ message: 'Rol eliminado exitosamente.', type: 'success' });
      fetchRoles();
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Error al eliminar el rol.';
      setAlert({ message: errorMessage, type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const filteredRoles = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return roles.filter(role =>
      role.nombre_rol.toLowerCase().includes(term) ||
      (role.created_by?.toLowerCase?.() || '').includes(term)
    );
  }, [roles, searchTerm]);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <Card title="Gestión de Roles">
        {alert.message && <AlertMessage message={alert.message} type={alert.type} />}

        <form onSubmit={handleSubmit} className="mb-6">
          <InputField
            label={editRole ? "Editar Nombre del Rol" : "Nuevo Nombre del Rol"}
            type="text"
            value={newRoleName}
            onChange={(e) => setNewRoleName(e.target.value)}
            placeholder="Ej. Administrador"
            required
            disabled={isLoading}
          />
          <div className="flex space-x-2 mt-4">
            <Button type="submit" variant="primary" disabled={isLoading}>
              {isLoading ? (editRole ? 'Actualizando...' : 'Creando...') : (editRole ? 'Actualizar Rol' : 'Crear Rol')}
            </Button>
            {editRole && (
              <Button type="button" variant="secondary" onClick={() => { setEditRole(null); setNewRoleName(''); }} disabled={isLoading}>
                Cancelar
              </Button>
            )}
          </div>
        </form>

        <InputField
          label="Buscar Rol"
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar por nombre o creador..."
        />

        {isLoading && !roles.length ? (
          <p className="text-center text-gray-500">Cargando roles...</p>
        ) : filteredRoles.length === 0 ? (
          <p className="text-center text-gray-500">No hay roles registrados o que coincidan con la búsqueda.</p>
        ) : (
          <div className="overflow-x-auto w-full mt-4">
            <table className="min-w-full divide-y divide-gray-200 shadow-md rounded-lg overflow-hidden">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Creador</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Creado</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actualizado</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredRoles.map((role) => (
                  <tr key={role.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{role.nombre_rol}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{role.created_by || 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{role.created_at ? new Date(role.created_at).toLocaleString() : 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{role.updated_at ? new Date(role.updated_at).toLocaleString() : 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      <div className="flex space-x-2 justify-end">
                        <Button variant="info" size="small" onClick={() => handleEdit(role)} disabled={isLoading}>
                          Editar
                        </Button>
                        <Button variant="danger" size="small" onClick={() => handleDelete(role.id)} disabled={isLoading}>
                          Eliminar
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}

export default RolesManagementPage;
