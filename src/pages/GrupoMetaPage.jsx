import React, { useEffect, useState } from 'react';
import axiosClient from '../axiosClient';
import InputField from '../components/InputField';
import Button from '../components/Button';
import AlertMessage from '../components/AlertMessage';
import Card from '../components/Card';
import { useNavigate } from 'react-router-dom';

function GrupoMeta() {
  const [grupos, setGrupos] = useState([]);
  const [nombreGrupo, setNombreGrupo] = useState('');
  const [descripcionGrupo, setDescripcionGrupo] = useState('');
  const [editId, setEditId] = useState(null);
  const [alert, setAlert] = useState({ message: '', type: '' });
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const getAuthHeader = () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      setAlert({ message: 'No estás autenticado.', type: 'error' });
      navigate('/login');
      return null;
    }

    return {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    };
  };

  const fetchGrupos = () => {
    const headers = getAuthHeader();
    if (!headers) return;

    axiosClient.get('/api/grupoMeta', headers)
      .then(res => setGrupos(res.data.data || res.data))
      .catch(() => setAlert({ message: 'Error al cargar grupos.', type: 'error' }));
  };

  useEffect(() => {
    fetchGrupos();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const headers = getAuthHeader();
    if (!headers) return;

    const data = {
      nombre_grupo: nombreGrupo,
      descripcion_grupo: descripcionGrupo,
      created_by: 1,
    };

    const request = editId
      ? axiosClient.put(`/api/grupoMeta/${editId}`, data, headers)
      : axiosClient.post('/api/grupoMeta', data, headers);

    request
      .then(() => {
        fetchGrupos();
        setNombreGrupo('');
        setDescripcionGrupo('');
        setEditId(null);
        setAlert({ message: 'Guardado correctamente.', type: 'success' });
      })
      .catch(() => {
        setAlert({ message: 'Error al guardar.', type: 'error' });
      });
  };

  const handleDelete = (id) => {
    if (!window.confirm('¿Eliminar este grupo?')) return;

    const headers = getAuthHeader();
    if (!headers) return;

    axiosClient.delete(`/api/grupoMeta/${id}`, headers)
      .then(() => {
        fetchGrupos();
        setAlert({ message: 'Grupo eliminado.', type: 'success' });
      })
      .catch(() => {
        setAlert({ message: 'Error al eliminar grupo.', type: 'error' });
      });
  };

  const handleEdit = (grupo) => {
    setEditId(grupo.id);
    setNombreGrupo(grupo.nombre_grupo);
    setDescripcionGrupo(grupo.descripcion_grupo);
    setAlert({ message: 'Editando grupo...', type: 'info' });
  };

  const gruposFiltrados = grupos.filter((grupo) =>
    grupo.nombre_grupo.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <Card title="Gestión de Grupo Meta" className="w-full max-w-4xl">
        {alert.message && <AlertMessage message={alert.message} type={alert.type} />}

        <form onSubmit={handleSubmit} className="space-y-4">
          <InputField
            label="Nombre del Grupo"
            value={nombreGrupo}
            onChange={(e) => setNombreGrupo(e.target.value)}
            required
          />
          <InputField
            label="Descripción del Grupo"
            value={descripcionGrupo}
            onChange={(e) => setDescripcionGrupo(e.target.value)}
          />
          <Button type="submit" variant="primary" className="w-full sm:w-auto">
            {editId ? 'Actualizar' : 'Crear'}
          </Button>
        </form>

        <div className="mt-6">
          <InputField
            label="Buscar Grupo por Nombre"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar..."
          />
        </div>

        <div className="mt-6 w-full overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded shadow-sm text-sm sm:text-base">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left px-3 py-2 border font-normal text-gray-700">Nombre del Grupo</th>
                <th className="text-left px-3 py-2 border font-normal text-gray-700">Descripción</th>
                <th className="text-left px-3 py-2 border font-normal text-gray-700">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {gruposFiltrados.length > 0 ? (
                gruposFiltrados.map((grupo) => (
                  <tr key={grupo.id} className="border-t hover:bg-gray-50">
                    <td className="px-3 py-2 border break-words max-w-xs">{grupo.nombre_grupo}</td>
                    <td className="px-3 py-2 border break-words max-w-xs">{grupo.descripcion_grupo}</td>
                    <td className="px-3 py-2 border space-x-2">
                      <Button size="sm" onClick={() => handleEdit(grupo)}>Editar</Button>
                      <Button size="sm" variant="danger" onClick={() => handleDelete(grupo.id)}>Eliminar</Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="text-center px-3 py-4 text-gray-500">
                    No se encontraron grupos.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

export default GrupoMeta;


