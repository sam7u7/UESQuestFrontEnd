import React, { useState, useEffect, useMemo } from 'react';
import axiosClient from '../axiosClient';
import Card from '../components/Card';
import Button from '../components/Button';
import InputField from '../components/InputField';
import AlertMessage from '../components/AlertMessage';
import { useNavigate } from 'react-router-dom';

function RolesManagementPage() {
  const [roles, setRoles] = useState([]);
  const [newRoleName, setNewRoleName] = useState('');
  const [editRole, setEditRole] = useState(null);
  const [alert, setAlert] = useState({ message: '', type: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate(); // Para redireccionar si no hay sesión

  // Obtener token de autenticación
  const getAuthHeader = () => {
    const token = localStorage.getItem('authToken'); 
    if (!token) {
      setAlert({ message: 'No estás autenticado.', type: 'error' });
      navigate('/login'); // Redirigir si no hay token
      return {};
    }

    return {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json'
      }
    };
  };

  // Verificar autenticación al montar el componente
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      navigate('/login'); // Redirigir a login si no está autenticado
    } else {
      fetchRoles();
    }
  }, []);

  // Obtener lista de roles
  const fetchRoles = async () => {
    setIsLoading(true);
    setAlert({ message: '', type: 'info' });

    try {
      const response = await axiosClient.get('/api/roles', getAuthHeader());
      setRoles(response.data.data || response.data);
    } catch (error) {
      console.error('Error al obtener roles:', error);
      setAlert({ message: 'Error al cargar los roles.', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  // Guardar o actualizar rol
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newRoleName.trim()) {
      setAlert({ message: 'El nombre del rol no puede estar vacío.', type: 'error' });
      return;
    }

    setIsLoading(true);
    try {
      if (editRole) {
        await axiosClient.put(`/api/roles/${editRole.id}`, { nombre_rol: newRoleName }, getAuthHeader());
        setAlert({ message: 'Rol actualizado exitosamente.', type: 'success' });
      } else {
        await axiosClient.post('/api/roles', { nombre_rol: newRoleName }, getAuthHeader());
        setAlert({ message: 'Rol creado exitosamente.', type: 'success' });
      }
      
      setNewRoleName('');
      setEditRole(null);
      fetchRoles();
    } catch (error) {
      setAlert({ message: 'Error al guardar el rol.', type: 'error' ,error});
    } finally {
      setIsLoading(false);
    }
  };

  // Editar rol
  const handleEdit = (role) => {
    setNewRoleName(role.nombre_rol);
    setEditRole(role);
    setAlert({ message: 'Editando rol...', type: 'info' });
  };

  // Eliminar rol
  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar este rol?')) return;

    setIsLoading(true);
    try {
      await axiosClient.delete(`/api/roles/${id}`, getAuthHeader());
      setAlert({ message: 'Rol eliminado exitosamente.', type: 'success' });
      fetchRoles();
    } catch (error) {
      setAlert({ message: 'Error al eliminar el rol.', type: 'error' ,error});
    } finally {
      setIsLoading(false);
    }
  };

  // Filtrar roles
  const filteredRoles = useMemo(() => {
    return roles.filter(role => 
      role.nombre_rol.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [roles, searchTerm]);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <Card title="Gestión de Roles">
        {alert.message && <AlertMessage message={alert.message} type={alert.type} />}

        <form onSubmit={handleSubmit}>
          <InputField
            label={editRole ? "Editar Nombre del Rol" : "Nuevo Nombre del Rol"}
            type="text"
            value={newRoleName}
            onChange={(e) => setNewRoleName(e.target.value)}
            required
            disabled={isLoading}
          />
          <Button type="submit" variant="primary" disabled={isLoading}>
            {editRole ? 'Actualizar Rol' : 'Crear Rol'}
          </Button>
        </form>

        <InputField
          label="Buscar Rol"
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {!isLoading && filteredRoles.length === 0 ? (
          <p>No hay roles disponibles.</p>
        ) : (
          <table>
            <thead>
              <tr><th>Nombre</th><th>Acciones</th></tr>
            </thead>
            <tbody>
              {filteredRoles.map(role => (
                <tr key={role.id}>
                  <td>{role.nombre_rol}</td>
                  <td>
                    <Button onClick={() => handleEdit(role)}>Editar</Button>
                    <Button onClick={() => handleDelete(role.id)}>Eliminar</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>
    </div>
  );
}

export default RolesManagementPage;
