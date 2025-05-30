import React, { useEffect, useState } from 'react';
import axios from 'axios';

function GrupoMeta() {
  const [grupos, setGrupos] = useState([]);
  const [form, setForm] = useState({
    nombre_grupo: '',
    descripcion_grupo: '',
    created_by: 1,
  });
  const [editId, setEditId] = useState(null);

  const apiURL = 'http://localhost:8000/api/grupoMeta';

  const fetchGrupos = () => {
    axios.get(apiURL)
      .then(res => setGrupos(res.data))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchGrupos();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editId) {
      axios.put(`${apiURL}/${editId}`, form)
        .then(() => {
          fetchGrupos();
          setEditId(null);
          setForm({ nombre_grupo: '', descripcion_grupo: '', created_by: 1 });
        })
        .catch(err => console.error(err));
    } else {
      axios.post(apiURL, form)
        .then(() => {
          fetchGrupos();
          setForm({ nombre_grupo: '', descripcion_grupo: '', created_by: 1 });
        })
        .catch(err => console.error(err));
    }
  };

  const handleDelete = (id) => {
    axios.delete(`${apiURL}/${id}`)
      .then(() => fetchGrupos())
      .catch(err => console.error(err));
  };

  const handleEdit = (grupo) => {
    setEditId(grupo.id);
    setForm({
      nombre_grupo: grupo.nombre_grupo,
      descripcion_grupo: grupo.descripcion_grupo,
      created_by: grupo.created_by,
    });
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-10">
      <h2 className="text-3xl font-bold mb-6 text-center text-indigo-700">Gestión de Grupo Meta</h2>

      <form onSubmit={handleSubmit} className="flex flex-col space-y-4 mb-8">
        <input
          type="text"
          name="nombre_grupo"
          placeholder="Nombre del Grupo"
          value={form.nombre_grupo}
          onChange={handleChange}
          required
          className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <input
          type="text"
          name="descripcion_grupo"
          placeholder="Descripción"
          value={form.descripcion_grupo}
          onChange={handleChange}
          className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button
          type="submit"
          className="bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition-colors font-semibold"
        >
          {editId ? 'Actualizar' : 'Crear'}
        </button>
      </form>

      <ul className="space-y-4">
        {grupos.map((grupo) => (
          <li
            key={grupo.id}
            className="flex justify-between items-center bg-indigo-50 rounded-md p-4 shadow-sm"
          >
            <div>
              <strong className="text-indigo-900 text-lg">{grupo.nombre_grupo}</strong>
              <p className="text-indigo-700">{grupo.descripcion_grupo}</p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => handleEdit(grupo)}
                className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded-md transition-colors"
              >
                Editar
              </button>
              <button
                onClick={() => handleDelete(grupo.id)}
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md transition-colors"
              >
                Eliminar
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default GrupoMeta;
