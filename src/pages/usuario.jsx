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
        setFormData({ ...formData, [name]: value });
        // Limpiar errores para el campo actual al escribir
        setErrors(prevErrors => ({ ...prevErrors, [name]: undefined }));
        setAlert({ message: '', type: '' }); // Limpiar alertas al cambiar el formulario
    };

    // Maneja el envío del formulario (crear o actualizar usuario)
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setErrors({}); // Limpiar errores anteriores
        setAlert({ message: '', type: '' }); // Limpiar mensajes anteriores

        try {
            if (formData.id) {
                // Lógica para actualizar usuario
                const response = await axiosClient.put(`/api/usuarios/${formData.id}`, formData, getAuthHeader()); // Ajusta esta URL
                setUsers(users.map(user => (user.id === formData.id ? response.data : user)));
                setAlert({ message: 'Usuario actualizado exitosamente.', type: 'success' });
            } else {
                // Lógica para crear nuevo usuario
                const response = await axiosClient.post('/api/usuarios', formData, getAuthHeader()); // Ajusta esta URL
                setUsers([...users, response.data]);
                setAlert({ message: 'Usuario creado exitosamente.', type: 'success' });
            }
            // Resetear el formulario después de la operación exitosa
            setFormData({
                id: null,
                id_rol: '',
                nombre: '',
                apellido: '',
                telefono: '',
                correo: '',
                password: '',
                created_by: loggedInUser ? loggedInUser.correo : '', // Mantener placeholder, en un entorno real sería dinámico
            });
        } catch (error) {
            console.error('Error al guardar usuario:', error);
            if (error.response && error.response.status === 400) {
                // Errores de validación del backend (ej. campos requeridos, formato incorrecto)
                setErrors(error.response.data);
                setAlert({ message: 'Errores de validación. Por favor, revisa los campos.', type: 'error' });
            } else if (error.response && error.response.status === 422) {
                // Errores específicos como correo ya registrado (si el backend lo envía así)
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
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <Card title="Gestión de Usuarios">
                {alert.message && <AlertMessage message={alert.message} type={alert.type} />}

                <h2 className="text-2xl font-semibold mb-6 text-gray-800">{formData.id ? 'Editar Usuario' : 'Crear Nuevo Usuario'}</h2>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    {/* Campo de Rol */}
                    <div>
                        <label htmlFor="id_rol" className="block text-sm font-medium text-gray-700 mb-1">Rol</label>
                        <select
                            id="id_rol"
                            name="id_rol"
                            value={formData.id_rol}
                            onChange={handleChange}
                            className={`mt-1 block w-full p-3 border ${errors.id_rol ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-gray-500 focus:border-gray-500 bg-gray-50 text-gray-900`}
                            required
                            disabled={isLoading}
                        >
                            <option value="">Selecciona un rol</option>
                            
                            {Array.isArray(roles) && roles.map(role => (
                                <option key={role.id} value={role.id}>{role.nombre_rol}</option> 
                            ))}
                        </select>
                        {errors.id_rol && <p className="mt-1 text-sm text-red-600">{errors.id_rol}</p>}
                    </div>

                    {/* Campo de Nombre */}
                    <InputField
                        label="Nombre"
                        type="text"
                        name="nombre"
                        value={formData.nombre}
                        onChange={handleChange}
                        required
                        disabled={isLoading}
                        error={errors.nombre}
                    />

                    {/* Campo de Apellido */}
                    <InputField
                        label="Apellido"
                        type="text"
                        name="apellido"
                        value={formData.apellido}
                        onChange={handleChange}
                        required
                        disabled={isLoading}
                        error={errors.apellido}
                    />

                    {/* Campo de Teléfono */}
                    <InputField
                        label="Teléfono"
                        type="text"
                        name="telefono"
                        value={formData.telefono}
                        onChange={handleChange}
                        disabled={isLoading}
                        error={errors.telefono}
                    />

                    {/* Campo de Correo */}
                    <InputField
                        label="Correo"
                        type="email"
                        name="correo"
                        value={formData.correo}
                        onChange={handleChange}
                        required
                        disabled={isLoading}
                        error={errors.correo}
                    />

                    {/* Campo de Contraseña */}
                    <InputField
                        label="Contraseña"
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required={!formData.id} // Requerida solo al crear
                        disabled={isLoading}
                        error={errors.password}
                    />

                    {/* Botones de acción */}
                    <div className="md:col-span-2 flex justify-end space-x-4 mt-4">
                        <Button type="submit" variant="primary" disabled={isLoading}>
                            {isLoading ? (
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            ) : (
                                formData.id ? 'Actualizar Usuario' : 'Crear Usuario'
                            )}
                        </Button>
                        {formData.id && (
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={() => {
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
                                    setErrors({});
                                    setAlert({ message: '', type: '' });
                                }}
                                disabled={isLoading}
                            >
                                Cancelar
                            </Button>
                        )}
                    </div>
                </form>

                <InputField
                    label="Buscar Usuario"
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    disabled={isLoading}
                />

                {isLoading && filteredUsers.length === 0 ? (
                    <p className="text-center text-gray-600 mt-4">Cargando usuarios...</p>
                ) : filteredUsers.length === 0 ? (
                    <p className="text-center text-gray-600 mt-4">No hay usuarios registrados que coincidan con la búsqueda.</p>
                ) : (
                    <div className="overflow-x-auto mt-6">
                        <table className="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-lg">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rol</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre Completo</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Teléfono</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Correo</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Creado Por</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredUsers.map((user) => (
                                    <tr key={user.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.id}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                            {Array.isArray(roles) && roles.find(role => role.id === user.id_rol)?.nombre_rol || 'Desconocido'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{user.nombre} {user.apellido}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{user.telefono}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{user.correo}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{user.created_by}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <Button onClick={() => handleEdit(user)} variant="tertiary" className="mr-2" disabled={isLoading}>
                                                Editar
                                            </Button>
                                            <Button onClick={() => handleDelete(user.id)} variant="danger" disabled={isLoading}>
                                                Eliminar
                                            </Button>
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

export default UserManagementPage;
