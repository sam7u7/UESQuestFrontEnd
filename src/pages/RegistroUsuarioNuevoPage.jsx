import React, { useState, useEffect, useRef } from 'react';
import axiosClient from '../axiosClient';
import Card from '../components/Card';
import Button from '../components/Button';
import InputField from '../components/InputField';
import AlertMessage from '../components/AlertMessage';

function RegistroUsuarioNuevoPage() {
  const [alert, setAlert] = useState({ message: '', type: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [isEditing, setIsEditing] = useState(true);
  const [changePasswordMode, setChangePasswordMode] = useState(false);

  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    telefono: '',
    correo: '',
    password: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    id_rol: 1,
    created_by: 1,
  });

  const originalFormData = useRef({});

  const getAuthHeader = () => {
    const token = localStorage.getItem('authToken');
    return token ? { headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' } } : {};
  };

  useEffect(() => {
    fetchUsuarioActual();
  }, []);

  const fetchUsuarioActual = async () => {
    setIsLoading(true);
    try {
      const response = await axiosClient.get('/api/usuarios/me', getAuthHeader());
      const usuario = response.data;
      const initialData = {
        nombre: usuario.nombre || '',
        apellido: usuario.apellido || '',
        telefono: usuario.telefono || '',
        correo: usuario.correo || '',
        id_rol: usuario.id_rol || 1,
        created_by: usuario.created_by || 1,
      };
      setFormData(prev => ({ ...prev, ...initialData }));
      originalFormData.current = initialData;
      setEditingUser(usuario);
      setIsEditing(false);
    } catch (error) {
      console.log('No se encontró usuario actual, se asumirá que es nuevo registro.');
      setEditingUser(null);
      setIsEditing(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const isFormModified = () => {
    if (!editingUser) return true;
    for (const key of ['nombre', 'apellido', 'telefono', 'correo', 'id_rol']) {
      if (formData[key] !== originalFormData.current[key]) return true;
    }
    return false;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { nombre, apellido, telefono, correo, password } = formData;

    if (!nombre || !apellido || !telefono || !correo || (!editingUser && !password)) {
      setAlert({ message: 'Todos los campos son obligatorios.', type: 'error' });
      return;
    }

    setIsLoading(true);
    try {
      if (editingUser) {
        const updateData = {
          nombre,
          apellido,
          telefono,
          correo,
          created_by: formData.created_by,
        };

        await axiosClient.put(`/api/usuarios/usuario/${editingUser.id}`, updateData, getAuthHeader());
        setAlert({ message: 'Usuario actualizado exitosamente.', type: 'success' });
        setIsEditing(false);
        originalFormData.current = { ...updateData };
      } else {
        await axiosClient.post('/api/usuarios/usuario', formData, getAuthHeader());
        setAlert({ message: 'Usuario creado exitosamente.', type: 'success' });
        setIsEditing(false);
        setFormData({
          nombre: '',
          apellido: '',
          telefono: '',
          correo: '',
          password: '',
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
          id_rol: 1,
          created_by: 1,
        });
      }
    } catch (error) {
      console.error(error);
      setAlert({ message: 'Error al guardar usuario.', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordChange = async () => {
    const { currentPassword, newPassword, confirmPassword } = formData;

    if (!currentPassword || !newPassword || !confirmPassword) {
      setAlert({ message: 'Todos los campos de contraseña son obligatorios.', type: 'error' });
      return;
    }

    if (newPassword !== confirmPassword) {
      setAlert({ message: 'Las contraseñas nuevas no coinciden.', type: 'error' });
      return;
    }

    setIsLoading(true);
    try {
      await axiosClient.put(
        `/api/usuarios/${editingUser.id}/cambiar-password`,
        {
          password_actual: currentPassword,
          nueva_password: newPassword,
        },
        getAuthHeader()
      );

      setAlert({ message: 'Contraseña actualizada correctamente.', type: 'success' });
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      }));
      setChangePasswordMode(false);
    } catch (error) {
      console.error(error);
      if (error.response?.data?.error) {
        setAlert({ message: error.response.data.error, type: 'error' });
      } else {
        setAlert({ message: 'Error al cambiar la contraseña.', type: 'error' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setFormData(prev => ({ ...prev, ...originalFormData.current }));
    setIsEditing(false);
    setChangePasswordMode(false);
    setAlert({ message: '', type: '' });
  };

  const handleEditToggle = () => setIsEditing(true);

  const toggleChangePassword = () => {
    setChangePasswordMode(prev => !prev);
    setAlert({ message: '', type: '' });
  };

  return (
   <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
  <div className="w-full max-w-3xl">
    <h1 className="text-2xl font-bold mb-6 text-center">Mi Usuario</h1>

    <Card title={editingUser ? 'Editar Usuario' : 'Registrar Usuario'}>
      {alert.message && <AlertMessage message={alert.message} type={alert.type} />}

      <form onSubmit={handleSubmit} className="space-y-4 mb-6">
        <InputField label="Nombre" name="nombre" value={formData.nombre} onChange={handleChange} disabled={isLoading || !isEditing} required />
        <InputField label="Apellido" name="apellido" value={formData.apellido} onChange={handleChange} disabled={isLoading || !isEditing} required />
        <InputField label="Teléfono" name="telefono" value={formData.telefono} onChange={handleChange} disabled={isLoading || !isEditing} required />
        <InputField label="Correo Electrónico" type="email" name="correo" value={formData.correo} onChange={handleChange} disabled={isLoading || !isEditing} required />

        {!editingUser && (
          <InputField label="Contraseña" type="password" name="password" value={formData.password} onChange={handleChange} disabled={isLoading} required />
        )}

        {!editingUser && (
          <Button type="submit" disabled={isLoading}>
            Registrar
          </Button>
        )}

        {editingUser && !isEditing && (
          <Button type="button" onClick={handleEditToggle}>
            Editar
          </Button>
        )}

        {editingUser && isEditing && (
          <>
            <div className="flex flex-wrap gap-2">
              {!changePasswordMode && (
                <>
                  <Button type="button" onClick={toggleChangePassword}>
                    Cambiar contraseña
                  </Button>
                  <Button type="button" onClick={handleCancelEdit} color="red">
                    Cancelar
                  </Button>
                  {isFormModified() && (
                    <Button type="submit" disabled={isLoading}>
                      Guardar cambios
                    </Button>
                  )}
                </>
              )}
            </div>

            {changePasswordMode && (
              <div className="mt-4 p-4 border rounded bg-white">
                <InputField label="Contraseña actual" type="password" name="currentPassword" value={formData.currentPassword} onChange={handleChange} disabled={isLoading} required />
                <InputField label="Nueva contraseña" type="password" name="newPassword" value={formData.newPassword} onChange={handleChange} disabled={isLoading} required />
                <InputField label="Confirmar nueva contraseña" type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} disabled={isLoading} required />
                <div className="flex gap-2 mt-2">
                  <Button type="button" onClick={handlePasswordChange} disabled={isLoading}>
                    Actualizar Contraseña
                  </Button>
                  <Button type="button" onClick={toggleChangePassword} color="gray">
                    Cancelar cambio
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </form>
    </Card>
  </div>
</div>

  );
}

export default RegistroUsuarioNuevoPage;
