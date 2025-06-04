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

  const fetchGrupos = () => {
    axiosClient.get('/api/grupoMeta', getAuthHeader())
      .then(res => setGrupos(res.data))
      .catch(err => setAlert({ message: 'Error al cargar grupos.', type: 'error' }));
  };

  useEffect(() => {
    fetchGrupos();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = { nombre_grupo: nombreGrupo, descripcion_grupo: descripcionGrupo, created_by: 1 };

    const request = editId
      ? axiosClient.put(`/api/grupoMeta/${editId}`, data, getAuthHeader())
      : axiosClient.post('/api/grupoMeta', data, getAuthHeader());

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

    axiosClient.delete(`/api/grupoMeta/${id}`, getAuthHeader())
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

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <Card title="Gestión de Grupo Meta">
        {alert.message && <AlertMessage message={alert.message} type={alert.type} />}

        <form onSubmit={handleSubmit}>
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
          <Button type="submit" variant="primary">
            {editId ? 'Actualizar' : 'Crear'}
          </Button>
        </form>

        <ul className="mt-6 space-y-4">
          {grupos.map((grupo) => (
            <li key={grupo.id} className="p-4 bg-white shadow rounded flex justify-between items-center">
              <div>
                <h3 className="font-bold">{grupo.nombre_grupo}</h3>
                <p>{grupo.descripcion_grupo}</p>
              </div>
              <div className="space-x-2">
                <Button onClick={() => handleEdit(grupo)}>Editar</Button>
                <Button onClick={() => handleDelete(grupo.id)} variant="danger">Eliminar</Button>
              </div>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}

export default GrupoMeta;
