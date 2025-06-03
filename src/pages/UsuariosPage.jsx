import React, { useState, useEffect } from 'react';
import axiosClient from '../axiosClient';
import Card from '../components/Card';
import Button from '../components/Button';
import InputField from '../components/InputField';
import AlertMessage from '../components/AlertMessage';

function UsuariosPage() {
  const [usuarios, setUsuarios] = useState([]);
  const [roles, setRoles] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [alert, setAlert] = useState({ message: '', type: '' });
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    telefono: '',
    correo: '',
    password: '',
    id_rol: '',
    created_by: 1,
  });

  const getAuthHeader = () => {
    const token = localStorage.getItem('authToken');
    if (!token) return {};
    return { headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' } };
  };

  useEffect(() => {
    fetchUsuarios();
    fetchRoles();
  }, []);

  const fetchUsuarios = async () => {
    setIsLoading(true);
    try {
      const response = await axiosClient.get('/api/usuarios', getAuthHeader());
      setUsuarios(response.data);
      setAlert({ message: '', type: '' });
    } catch (error) {
      setAlert({ message: 'Error al obtener usuarios.', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchRoles = async () => {
    try {
      const response = await axiosClient.get('/api/roles', getAuthHeader());
      setRoles(response.data);
    } catch (error) {
      setAlert({ message: 'Error al obtener roles.', type: 'error' });
    }
  };

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { nombre, apellido, telefono, correo, password, id_rol } = formData;

    if (!nombre.trim() || !apellido.trim() || !telefono.trim() || !correo.trim() || (!editingUser && !password) || !id_rol) {
      setAlert({ message: 'Todos los campos son obligatorios.', type: 'error' });
      return;
    }

    setIsLoading(true);
    try {
      if (editingUser) {
        await axiosClient.put(
          `/api/usuarios/${editingUser.id}`,
          {
            nombre,
            apellido,
            telefono,
            correo,
            id_rol,
            created_by: formData.created_by,
          },
          getAuthHeader()
        );
        setAlert({ message: 'Usuario actualizado exitosamente.', type: 'success' });
      } else {
        await axiosClient.post(
          '/api/usuarios',
          formData,
          getAuthHeader()
        );
        setAlert({ message: 'Usuario creado exitosamente.', type: 'success' });
      }

      setEditingUser(null);
      setFormData({
        nombre: '',
        apellido: '',
        telefono: '',
        correo: '',
        password: '',
        id_rol: '',
        created_by: 1,
      });
      fetchUsuarios();
    } catch (error) {
      setAlert({ message: 'Error al guardar usuario.', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (usuario) => {
    setEditingUser(usuario);
    setFormData({
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      telefono: usuario.telefono,
      correo: usuario.correo,
      password: '',
      id_rol: usuario.id_rol,
      created_by: usuario.created_by || 1,
    });
    setAlert({ message: 'Editando usuario...', type: 'info' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Seguro que quieres eliminar este usuario?')) return;
    setIsLoading(true);
    try {
      await axiosClient.delete(`/api/usuarios/${id}`, getAuthHeader());
      setAlert({ message: 'Usuario eliminado exitosamente.', type: 'success' });
      fetchUsuarios();
    } catch (error) {
      setAlert({ message: 'Error al eliminar usuario.', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <Card title="Gestión de Usuarios">
        {alert.message && <AlertMessage message={alert.message} type={alert.type} />}

        <form onSubmit={handleSubmit} className="space-y-4 mb-6">
          <InputField
            label="Nombre"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            disabled={isLoading}
            required
          />
          <InputField
            label="Apellido"
            name="apellido"
            value={formData.apellido}
            onChange={handleChange}
            disabled={isLoading}
            required
          />
          <InputField
            label="Teléfono"
            name="telefono"
            value={formData.telefono}
            onChange={handleChange}
            disabled={isLoading}
            required
          />
          <InputField
            label="Correo Electrónico"
            type="email"
            name="correo"
            value={formData.correo}
            onChange={handleChange}
            disabled={isLoading}
            required
          />
          {!editingUser && (
            <InputField
              label="Contraseña"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              disabled={isLoading}
              required
            />
          )}
          <label className="block font-medium">
            Rol
            <select
              name="id_rol"
              value={formData.id_rol}
              onChange={handleChange}
              disabled={isLoading}
              className="w-full border rounded p-2 mt-1"
              required
            >
              <option value="">Seleccione un rol</option>
              {roles.map(role => (
                <option key={role.id} value={role.id}>
                  {role.nombre_rol || role.name}
                </option>
              ))}
            </select>
          </label>

          <Button type="submit" disabled={isLoading}>
            {editingUser ? 'Actualizar Usuario' : 'Crear Usuario'}
          </Button>
        </form>

        {usuarios.length === 0 ? (
          <p>No hay usuarios disponibles.</p>
        ) : (
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr>
                <th className="text-left p-2 border-b">Nombre</th>
                <th className="text-left p-2 border-b">Apellido</th>
                <th className="text-left p-2 border-b">Teléfono</th>
                <th className="text-left p-2 border-b">Correo</th>
                <th className="text-left p-2 border-b">Rol</th>
                <th className="text-left p-2 border-b">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map(usuario => (
                <tr key={usuario.id} className="border-t">
                  <td className="p-2">{usuario.nombre}</td>
                  <td className="p-2">{usuario.apellido}</td>
                  <td className="p-2">{usuario.telefono}</td>
                  <td className="p-2">{usuario.correo}</td>
                  <td className="p-2">{roles.find(r => r.id === usuario.id_rol)?.nombre_rol || ''}</td>
                  <td className="p-2 space-x-2">
                    <Button onClick={() => handleEdit(usuario)} disabled={isLoading}>
                      Editar
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => handleDelete(usuario.id)}
                      disabled={isLoading}
                    >
                      Eliminar
                    </Button>
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

export default UsuariosPage;
