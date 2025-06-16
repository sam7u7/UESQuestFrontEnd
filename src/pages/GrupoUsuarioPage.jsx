import React, { useState, useEffect, useMemo } from 'react';
import axiosClient from '../axiosClient';
import InputField from '../components/InputField';
import Card from '../components/Card';
import Button from '../components/Button';
import AlertMessage from '../components/AlertMessage';
import { useNavigate } from 'react-router-dom';

function GrupoUsuarioPage() {
  const [grupoUsuarios, setGrupoUsuarios] = useState([]);
  const [grupos, setGrupos] = useState([]);
  const [usuarios, setUsuarios] = useState([]);

  const [grupoMetaId, setGrupoMetaId] = useState('');
  const [usuarioId, setUsuarioId] = useState('');
  const [editGrupoUsuario, setEditGrupoUsuario] = useState(null);

  const [alert, setAlert] = useState({ message: '', type: '' });
  const [isLoading, setIsLoading] = useState(false);
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
        Accept: 'application/json',
      },
    };
  };

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      navigate('/login');
    } else {
      fetchGrupoUsuarios();
      fetchGrupos();
      fetchUsuarios();
    }
  }, []);

  const fetchGrupoUsuarios = async () => {
    setIsLoading(true);
    setAlert({ message: '', type: 'info' });
    try {
      const response = await axiosClient.get('/api/grupoUsuario', getAuthHeader());
      setGrupoUsuarios(response.data.data || response.data);
    } catch (error) {
      console.error('Error al obtener grupo-usuarios:', error);
      setAlert({ message: 'Error al cargar los grupos de usuarios.', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchGrupos = async () => {
    try {
      const response = await axiosClient.get('/api/grupoMeta', getAuthHeader()); // Asegúrate que esta ruta es correcta
      setGrupos(response.data.data || response.data);
    } catch (error) {
      console.error('Error al obtener grupos:', error);
      setAlert({ message: 'Error al cargar los grupos.', type: 'error' });
    }
  };

  const fetchUsuarios = async () => {
    try {
      const response = await axiosClient.get('/api/usuarios', getAuthHeader());
      setUsuarios(response.data.data || response.data);
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
      setAlert({ message: 'Error al cargar los usuarios.', type: 'error' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!grupoMetaId || !usuarioId) {
      setAlert({ message: 'Debe seleccionar grupo y usuario.', type: 'error' });
      return;
    }

    setIsLoading(true);
    try {
      if (editGrupoUsuario) {
        await axiosClient.put(
          `/api/grupoUsuario/${editGrupoUsuario.id}`,
          { grupo_id: grupoMetaId, usuario_id: usuarioId },
          getAuthHeader()
        );
        setAlert({ message: 'Relación actualizada exitosamente.', type: 'success' });
      } else {
        await axiosClient.post(
          '/api/grupoUsuario',
          { grupo_id: grupoMetaId, usuario_id: usuarioId },
          getAuthHeader()
        );
        setAlert({ message: 'Relación creada exitosamente.', type: 'success' });
      }
      setGrupoMetaId('');
      setUsuarioId('');
      setEditGrupoUsuario(null);
      fetchGrupoUsuarios();
    } catch (error) {
      console.error('Error al guardar relación:', error);
      setAlert({ message: 'Error al guardar la relación.', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (relacion) => {
    setGrupoMetaId(relacion.grupo_id);
    setUsuarioId(relacion.usuario_id);
    setEditGrupoUsuario(relacion);
    setAlert({ message: 'Editando relación...', type: 'info' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar esta relación?')) return;
    setIsLoading(true);
    try {
      await axiosClient.delete(`/api/grupoUsuario/${id}`, getAuthHeader());
      setAlert({ message: 'Relación eliminada exitosamente.', type: 'success' });
      fetchGrupoUsuarios();
    } catch (error) {
      console.error('Error al eliminar relación:', error);
      setAlert({ message: 'Error al eliminar la relación.', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const filteredGrupoUsuarios = useMemo(() => {
    return grupoUsuarios.filter((item) => {
      const grupo = grupos.find(g => g.id === item.grupo_id);
      const usuario = usuarios.find(u => u.id === item.usuario_id);

      const grupoText = grupo ? (grupo.nombre_grupo + ' ' + grupo.descripcion_grupo).toLowerCase() : '';
      const usuarioText = usuario ? (usuario.nombre + ' ' + usuario.apellido).toLowerCase() : '';

      return (
        grupoText.includes(searchTerm.toLowerCase()) ||
        usuarioText.includes(searchTerm.toLowerCase())
      );
    });
  }, [grupoUsuarios, grupos, usuarios, searchTerm]);

  return (
    <div className="min-h-screen bg-gray-100 pt-24 flex flex-col items-center justify-center p-4">
  <h1 className="text-2xl font-bold mb-6 text-center">Grupo del Usuario</h1>

  <Card title="Gestión de Grupo - Usuario" className="w-full max-w-4xl">
    {alert.message && <AlertMessage message={alert.message} type={alert.type} />}

    <form onSubmit={handleSubmit} className="mb-4 space-y-4">
      <div>
        <label htmlFor="grupoMeta" className="block font-medium mb-1">Grupo Meta</label>
        <select
          id="grupoMeta"
          value={grupoMetaId}
          onChange={(e) => setGrupoMetaId(e.target.value)}
          disabled={isLoading}
          required
          className="w-full border rounded p-2"
        >
          <option value="">-- Seleccione un Grupo --</option>
          {grupos.map((grupo) => (
            <option key={grupo.id} value={grupo.id}>
              {grupo.nombre_grupo + ' - ' + grupo.descripcion_grupo}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="usuario" className="block font-medium mb-1">Usuario</label>
        <select
          id="usuario"
          value={usuarioId}
          onChange={(e) => setUsuarioId(e.target.value)}
          disabled={isLoading}
          required
          className="w-full border rounded p-2"
        >
          <option value="">-- Seleccione un Usuario --</option>
          {usuarios.map((user) => (
            <option key={user.id} value={user.id}>
              {user.nombre + ' ' + user.apellido}
            </option>
          ))}
        </select>
      </div>

      <div className="flex justify-end">
        <Button type="submit" size="sm" variant="primary" disabled={isLoading}>
          {editGrupoUsuario ? 'Actualizar Relación' : 'Asignar Usuario'}
        </Button>
      </div>
    </form>

    <InputField
      label="Buscar Grupo o Usuario"
      type="text"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
    />

    {!isLoading && filteredGrupoUsuarios.length === 0 ? (
      <p className="mt-4 text-gray-600">No hay relaciones disponibles.</p>
    ) : (
      <table className="w-full border-collapse mt-4 text-sm sm:text-base">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2 text-left font-normal text-gray-700">Grupo Meta</th>
            <th className="border p-2 text-left font-normal text-gray-700">Usuario</th>
            <th className="border p-2 text-left font-normal text-gray-700">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filteredGrupoUsuarios.map((item) => {
            const grupo = grupos.find(g => g.id === item.grupo_id);
            const usuario = usuarios.find(u => u.id === item.usuario_id);

            return (
              <tr key={item.id} className="hover:bg-gray-50 border-t">
                <td className="border p-2">
                  {grupo ? grupo.nombre_grupo + ' - ' + grupo.descripcion_grupo : 'N/D'}
                </td>
                <td className="border p-2">
                  {usuario ? usuario.nombre + ' ' + usuario.apellido : 'N/D'}
                </td>
                <td className="border p-2 space-x-2">
                  <Button size="sm" onClick={() => handleEdit(item)}>Editar</Button>
                  <Button size="sm" variant="danger" onClick={() => handleDelete(item.id)}>Eliminar</Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    )}
  </Card>
</div>

  );
}

export default GrupoUsuarioPage;
