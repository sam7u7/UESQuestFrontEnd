import React, { useState, useEffect, useMemo } from 'react';
import axiosClient from '../axiosClient'; // Asegúrate de que la ruta a axiosClient sea correcta
import Card from '../components/Card'; // Asegúrate de que la ruta a Card sea correcta
import Button from '../components/Button'; // Asegúrate de que la ruta a Button sea correcta
import InputField from '../components/InputField'; // Asegúrate de que la ruta a InputField sea correcta
import AlertMessage from '../components/AlertMessage'; // Asegúrate de que la ruta a AlertMessage sea correcta
import { useNavigate } from 'react-router-dom';

// Componente principal de la aplicación CRUD de Usuarios
function UserManagementPage() {
    // Estado para almacenar la lista de usuarios
    const [users, setUsers] = useState([]);
    // Estado para almacenar la lista de roles
    const [roles, setRoles] = useState([]);

    // Estado para el usuario logueado
    const [loggedInUser, setLoggedInUser] = useState(null);
    
    // Estado para los datos del formulario de nuevo usuario/edición
    const [formData, setFormData] = useState({
        id: null, // Para manejar la edición (si es null, es un nuevo usuario)
        id_rol: '',
        nombre: '',
        apellido: '',
        telefono: '',
        correo: '',
        password: '',
        // 'created_by' se establecerá dinámicamente o se obtendrá del contexto de autenticación
        created_by: '',
    });
    // Estado para manejar los errores de validación del backend
    const [errors, setErrors] = useState({});
    // Estado para indicar si se está cargando información
    const [isLoading, setIsLoading] = useState(true);
    // Estado para el mensaje de éxito/error
    const [alert, setAlert] = useState({ message: '', type: '' });
    // Estado para el término de búsqueda de usuarios
    const [searchTerm, setSearchTerm] = useState('');

    const navigate = useNavigate(); // Para redireccionar si no hay sesión

    // Función para obtener el token de autenticación
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

    // Verificar autenticación y cargar datos al montar el componente
    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (!token) {
            navigate('/login'); // Redirigir a login si no está autenticado
        } else {
            fetchRoles();
            fetchUsers();
            fetchLoggedInUser();
        }
    }, []); // Se ejecuta una sola vez al montar el componente

    const fetchLoggedInUser = async () => {
        setIsLoading(true);
        setAlert({ message: '', type: '' });
        try {
            const response = await axiosClient.get('/api/me', getAuthHeader()); // Ajusta esta URL si es diferente
            // Asumiendo que la respuesta para un solo usuario es un objeto, no un array
            if (response.data && typeof response.data === 'object' && response.data.correo) {
                setLoggedInUser(response.data);
                // Actualizar formData.created_by con el correo del usuario logueado
                setFormData(prev => ({
                    ...prev,
                    created_by: response.data.correo // Usar el correo del usuario logueado
                }));
                setAlert({ message: 'Usuario logueado encontrado.', type: 'success' });
            } else if (response.data && response.data.data && typeof response.data.data === 'object' && response.data.data.correo) {
                // Si la respuesta viene anidada en 'data'
                setLoggedInUser(response.data.data);
                setFormData(prev => ({
                    ...prev,
                    created_by: response.data.data.correo
                }));
                setAlert({ message: 'Usuario logueado encontrado.', type: 'success' });
            }
            else {
                console.error('La respuesta del usuario logueado no tiene el formato esperado o falta el correo:', response.data);
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

    // Obtener lista de roles
    const fetchRoles = async () => {
        setIsLoading(true);
        setAlert({ message: '', type: '' }); // Limpiar alertas anteriores
        try {
            const response = await axiosClient.get('/api/roles', getAuthHeader()); // Ajusta esta URL
            //console.log(response.data); 	
            if (Array.isArray(response.data.data)) { // Asumiendo que los roles vienen en 'data'
                setRoles(response.data.data || response.data);
                setAlert({ message: 'Roles cargados correctamente.', type: 'success' });
            } else if (Array.isArray(response.data)) { // Si la respuesta es directamente el array
                setRoles(response.data || response.data);
                setAlert({ message: 'Roles cargados correctamente.', type: 'success' });
            }
             else {
                console.error('La respuesta de roles no es un array:', response.data);
                setRoles([]); // Asegura que roles sea un array vacío si la respuesta es inesperada
                setAlert({ message: 'Error: La respuesta de roles no tiene el formato esperado.', type: 'error' });
            }
        } catch (error) {
            console.error('Error al cargar roles:', error);
            setAlert({ message: 'Error al cargar los roles.', type: 'error' });
            setRoles([]); // En caso de error, asegúrate de que roles sea un array vacío
        } finally {
            setIsLoading(false);
        }
    };
    


    // Obtener lista de usuarios
    const fetchUsers = async () => {
        setIsLoading(true);
        setAlert({ message: '', type: '' }); // Limpiar alertas anteriores
        try {
            const response = await axiosClient.get('/api/usuarios', getAuthHeader()); 
            if (Array.isArray(response.data.data)) { // Asumiendo que los usuarios vienen en 'data'
                setUsers(response.data.data);
                setAlert({ message: 'Usuarios cargados correctamente.', type: 'success' });
            } else if (Array.isArray(response.data)) { // Si la respuesta es directamente el array
                setUsers(response.data);
                setAlert({ message: 'Usuarios cargados correctamente.', type: 'success' });
            } else {
                console.error('La respuesta de usuarios no es un array:', response.data);
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

    // Maneja los cambios en los campos del formulario
    const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "password") {
        // Expresión regular para validar:
        // - Que la contraseña inicie con una letra
        // - Que tenga al menos una mayúscula y una minúscula
        // - Que contenga al menos un símbolo especial
        const passwordRegex = /^[A-Za-z][A-Za-z0-9!@#$%^&*()_+=-]{7,}$/;
        const hasUpperCase = /[A-Z]/.test(value);
        const hasLowerCase = /[a-z]/.test(value);
        const hasSpecialChar = /[!@#$%^&*()_+=-]/.test(value);

            if (!passwordRegex.test(value) || !hasUpperCase || !hasLowerCase || !hasSpecialChar) {
                setErrors((prevErrors) => ({
                    ...prevErrors,
                    password: "La contraseña debe iniciar con una letra, contener mayúsculas, minúsculas y un símbolo especial.",
                }));
            } else {
                setErrors((prevErrors) => ({
                    ...prevErrors,
                    password: undefined, // Borra el error si es válida
                }));
            }
        }

        setFormData({ ...formData, [name]: value });
        setAlert({ message: '', type: '' }); // Limpiar alertas al cambiar el formulario
        };

    // Maneja el envío del formulario (crear o actualizar usuario)
    const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});
    setAlert({ message: '', type: '' });

    // Validación de contraseña antes de enviar la solicitud
    const passwordRegex = /^[A-Za-z][A-Za-z0-9!@#$%^&*()_+=-]{7,}$/;
    const hasUpperCase = /[A-Z]/.test(formData.password);
    const hasLowerCase = /[a-z]/.test(formData.password);
    const hasSpecialChar = /[!@#$%^&*()_+=-]/.test(formData.password);

    if (!passwordRegex.test(formData.password) || !hasUpperCase || !hasLowerCase || !hasSpecialChar) {
        setErrors((prevErrors) => ({
            ...prevErrors,
            password: "La contraseña debe iniciar con una letra, contener mayúsculas, minúsculas y un símbolo especial.",
        }));
        setAlert({ message: "La contraseña debe cumplir con lo siguiente:\n- Iniciar con una letra\n- Contener al menos una mayúscula\n- Contener al menos una minúscula\n- Incluir al menos un símbolo especial (!@#$%^&*()_+=-)\n - Longitud minima 8 caracteres", type: 'error' });
        setIsLoading(false);
        return; // Detiene la ejecución si la contraseña no es válida
    }

    try {
        if (formData.id) {
            const response = await axiosClient.put(`/api/usuarios/${formData.id}`, formData, getAuthHeader());
            setUsers(users.map(user => (user.id === formData.id ? response.data : user)));
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
            created_by: loggedInUser ? loggedInUser.correo : '',
        });
    } catch (error) {
        console.error('Error al guardar usuario:', error);
        if (error.response && error.response.status === 400) {
            setErrors(error.response.data);
            setAlert({ message: 'Errores de validación. Por favor, revisa los campos.', type: 'error' });
        } else if (error.response && error.response.status === 422) {
            setErrors(error.response.data);
            setAlert({ message: error.response.data.message || 'El correo ya se encuentra registrado.', type: 'error' });
        } else {
            setAlert({ message: 'Error al guardar el usuario. Inténtalo de nuevo.', type: 'error' });
        }
    } finally {
        setIsLoading(false);
    }
};


    // Carga los datos de un usuario en el formulario para edición
    const handleEdit = (user) => {
        setFormData({
            id: user.id,
            id_rol: user.id_rol,
            nombre: user.nombre,
            apellido: user.apellido,
            telefono: user.telefono,
            correo: user.correo,
            password: '', // No precargar la contraseña por seguridad
            created_by: user.created_by,
        });
        setErrors({}); // Limpiar errores al editar
        setAlert({ message: 'Editando usuario...', type: 'info' });
    };

    // Maneja la eliminación de un usuario
    const handleDelete = async (id) => {
        // NOTA: Para una aplicación real, reemplaza window.confirm con un modal de confirmación personalizado.
        if (!window.confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
            return;
        }

        setIsLoading(true);
        setAlert({ message: '', type: '' });
        try {
            await axiosClient.delete(`/api/usuarios/${id}`, getAuthHeader()); // Ajusta esta URL
            setUsers(users.filter(user => user.id !== id));
            setAlert({ message: 'Usuario eliminado exitosamente.', type: 'success' });
        } catch (error) {
            console.error('Error al eliminar usuario:', error);
            setAlert({ message: 'Error al eliminar el usuario. Inténtalo de nuevo.', type: 'error' });
        } finally {
            setIsLoading(false);
        }
    };

    // Filtrar usuarios
    const filteredUsers = useMemo(() => {
        return users.filter(user =>
            user.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.correo.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (user.telefono && user.telefono.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (roles.find(role => role.id === user.id_rol)?.nombre || 'desconocido').toLowerCase().includes(searchTerm.toLowerCase())
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
      {/* Campo de Rol */}
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

      {/* Campos de entrada */}
      <InputField label="Nombre" type="text" name="nombre" value={formData.nombre} onChange={handleChange} required disabled={isLoading} error={errors.nombre} />
      <InputField label="Apellido" type="text" name="apellido" value={formData.apellido} onChange={handleChange} required disabled={isLoading} error={errors.apellido} />
      <InputField label="Teléfono" type="text" name="telefono" value={formData.telefono} onChange={handleChange} disabled={isLoading} error={errors.telefono} />
      <InputField label="Correo" type="email" name="correo" value={formData.correo} onChange={handleChange} required disabled={isLoading} error={errors.correo} />
      <InputField label="Contraseña" type="password" name="password" value={formData.password} onChange={handleChange} required={!formData.id} disabled={isLoading} error={errors.password} />

      {/* Botones de acción */}
      <div className="md:col-span-2 flex justify-end space-x-2 mt-4">
        <Button type="submit" variant="primary" disabled={isLoading}>
            {isLoading ? "Cargando..." : formData.id ? 'Actualizar Usuario' : 'Crear Usuario'}
        </Button>
        {formData.id && (
            <Button type="button" variant="secondary" onClick={() => setFormData({ id: null, id_rol: '', nombre: '', apellido: '', telefono: '', correo: '', password: '' })} disabled={isLoading}>
            Cancelar
            </Button>
        )}
        </div>
    </form>

    {/* Buscador y tabla responsiva */}
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
