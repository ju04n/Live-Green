# 🌱 Live Green

**Sistema web para la gestión y consulta de información relacionada con plantas y educación ambiental.**

Live Green es un proyecto de desarrollo de software realizado como parte del proceso de formación del programa **Análisis y Desarrollo de Software (ADSO) del SENA**.

El proyecto tiene como propósito desarrollar una aplicación web que permita organizar y administrar información relacionada con plantas, especies, cuidados, materiales de apoyo y usuarios, mediante una arquitectura basada en **Frontend, Backend y Base de Datos**.

---

## 📋 Descripción del proyecto

Live Green busca proporcionar una plataforma web orientada a la consulta y administración de información relacionada con el cuidado y conocimiento de las plantas.

El sistema cuenta con una interfaz desarrollada en **React**, un servidor backend construido con **Node.js y Express**, y una base de datos administrada mediante **MongoDB Atlas**.

La aplicación permite gestionar diferentes módulos del sistema mediante operaciones CRUD (**Crear, Consultar, Actualizar y Eliminar**), facilitando la administración de la información desde el sistema.

El proyecto se encuentra en proceso de desarrollo como parte de las actividades prácticas de formación del programa ADSO.

---

## 🎯 Objetivo general

Desarrollar una aplicación web que permita gestionar información relacionada con plantas y educación ambiental, utilizando tecnologías modernas de desarrollo web y una arquitectura cliente-servidor.

### Objetivos específicos

* Diseñar una interfaz web utilizando React.
* Implementar un backend utilizando Node.js y Express.
* Conectar la aplicación con una base de datos MongoDB Atlas.
* Implementar servicios API REST para la comunicación entre frontend y backend.
* Desarrollar operaciones CRUD para la administración de información.
* Implementar diferentes módulos de acuerdo con las necesidades del sistema.
* Aplicar buenas prácticas de desarrollo de software.
* Facilitar la administración y consulta de la información almacenada.

---

# 🏗️ Arquitectura del proyecto

Live Green utiliza una arquitectura separada en tres componentes principales:

```text
┌─────────────────────────┐
│       FRONTEND          │
│     React + Vite        │
│                         │
│ Interfaz de usuario     │
└────────────┬────────────┘
             │
             │ HTTP / API REST
             ▼
┌─────────────────────────┐
│        BACKEND          │
│    Node.js + Express    │
│                         │
│ Rutas y lógica de API   │
└────────────┬────────────┘
             │
             │ Mongoose
             ▼
┌─────────────────────────┐
│      BASE DE DATOS      │
│      MongoDB Atlas      │
│                         │
│ Información del sistema │
└─────────────────────────┘
```

### Flujo de funcionamiento

1. El usuario interactúa con la aplicación desde el frontend.
2. React realiza solicitudes HTTP al backend.
3. Express recibe y procesa las solicitudes.
4. Mongoose permite realizar las operaciones sobre MongoDB.
5. MongoDB Atlas almacena la información.
6. El backend devuelve una respuesta al frontend.
7. React actualiza la información mostrada al usuario.

---

# 🛠️ Tecnologías utilizadas

## Frontend

* **React**
* **Vite**
* JavaScript
* HTML
* CSS
* Fetch API

## Backend

* **Node.js**
* **Express**
* **Mongoose**
* **CORS**
* **dotenv**
* **Nodemon**

## Base de datos

* **MongoDB**
* **MongoDB Atlas**

## Control de versiones

* **Git**
* **GitHub**

---

# 📁 Estructura del proyecto

La estructura principal del proyecto es:

```text
Live-Green/
│
├── backend/
│   ├── node_modules/
│   ├── package.json
│   ├── package-lock.json
│   ├── server.js
│   └── .env
│
├── public/
│
├── src/
│   ├── assets/
│   ├── componentes/
│   ├── formatos/
│   └── pages/
│
├── package.json
├── package-lock.json
└── README.md
```

### `src/`

Contiene el código principal del frontend.

#### `assets/`

Contiene recursos utilizados por la aplicación, como imágenes y otros archivos estáticos.

#### `componentes/`

Contiene los componentes reutilizables de React utilizados para construir la interfaz.

#### `formatos/`

Contiene elementos relacionados con formularios y estructuras utilizadas para la captura de información.

#### `pages/`

Contiene las diferentes páginas y vistas de la aplicación.

### `backend/`

Contiene el servidor y la lógica del backend.

El backend se encarga de recibir las solicitudes del frontend, procesar la información y comunicarse con MongoDB Atlas.

---

# 👥 Usuarios y roles

Live Green contempla diferentes tipos de usuarios dentro del sistema.

Entre los roles definidos se encuentran:

* **Estudiante**
* **Administrador**
* **Profesor**

Los roles permiten establecer diferentes tipos de participación dentro de la aplicación y sirven como base para la gestión de permisos y funcionalidades.

---

# 🌿 Módulos del sistema

El proyecto cuenta con diferentes módulos relacionados con la gestión de información.

Entre ellos se encuentran:

* Gestión de usuarios.
* Gestión de plantas.
* Gestión de especies.
* Gestión de cuidados.
* Materiales de apoyo.
* Administración de información.
* Formularios de registro y gestión.

Los módulos administrativos utilizan operaciones CRUD de acuerdo con las necesidades de cada entidad.

---

# 🔄 Operaciones CRUD

El sistema utiliza el concepto CRUD para la administración de información.

| Operación  | Descripción                    |
| ---------- | ------------------------------ |
| **Create** | Crear nuevos registros         |
| **Read**   | Consultar registros existentes |
| **Update** | Actualizar información         |
| **Delete** | Eliminar registros             |

Estas operaciones permiten administrar la información almacenada en la base de datos desde la aplicación.

---

# 🗄️ Base de datos

Live Green utiliza **MongoDB Atlas** como sistema de gestión de base de datos.

MongoDB es una base de datos orientada a documentos, mientras que Mongoose permite establecer la comunicación entre el backend desarrollado con Node.js y MongoDB.

La conexión se realiza mediante una variable de entorno para evitar almacenar directamente las credenciales de la base de datos dentro del código fuente.

Ejemplo:

```env
MONGODB_URI=TU_CADENA_DE_CONEXION
PORT=5000
```

> Por seguridad, las credenciales reales de MongoDB Atlas no deben publicarse en GitHub.

---

# 🔐 Variables de entorno

El backend utiliza un archivo `.env` para almacenar información de configuración.

Ejemplo:

```env
MONGODB_URI=mongodb+srv://usuario:contraseña@cluster.mongodb.net/LiveGreen
PORT=5000
```

El archivo `.env` debe mantenerse fuera del repositorio público mediante `.gitignore`.

Nunca se deben publicar:

* Contraseñas.
* Cadenas de conexión con credenciales.
* Tokens.
* Claves privadas.
* Información sensible.

---

# ⚙️ Instalación

Para ejecutar el proyecto en un equipo local es necesario tener instalado:

* Node.js
* npm
* Git
* Una cuenta de MongoDB Atlas

---

## 1. Clonar el repositorio

```bash
git clone https://github.com/ju04n/Live-Green.git
```

Ingresar al proyecto:

```bash
cd Live-Green
```

---

## 2. Instalar dependencias del frontend

Desde la carpeta principal:

```bash
npm install
```

---

## 3. Instalar dependencias del backend

Ingresar a la carpeta backend:

```bash
cd backend
```

Ejecutar:

```bash
npm install
```

---

## 4. Configurar MongoDB Atlas

Crear una base de datos en MongoDB Atlas y obtener la cadena de conexión.

Posteriormente crear el archivo:

```text
backend/.env
```

Con una configuración similar a:

```env
MONGODB_URI=TU_CADENA_DE_MONGODB_ATLAS
PORT=5000
```

---

# ▶️ Ejecución del proyecto

El frontend y el backend se ejecutan como procesos independientes.

## Iniciar el backend

Desde:

```text
Live-Green/backend
```

ejecutar:

```bash
npm run dev
```

El servidor estará disponible normalmente en:

```text
http://localhost:5000
```

---

## Iniciar el frontend

En otra terminal, regresar a la carpeta principal:

```bash
cd ..
```

Ejecutar:

```bash
npm run dev
```

Vite mostrará la dirección local de la aplicación, normalmente:

```text
http://localhost:5173
```

---

# 🔌 Comunicación entre Frontend y Backend

La comunicación entre ambas partes se realiza mediante solicitudes HTTP.

El frontend utiliza `fetch()` para consumir los endpoints proporcionados por el backend.

El flujo general es:

```text
Usuario
   │
   ▼
React
   │
   │ Fetch / HTTP
   ▼
Express
   │
   │ Mongoose
   ▼
MongoDB Atlas
   │
   ▼
Express
   │
   ▼
React
   │
   ▼
Información mostrada al usuario
```

Este modelo permite separar la interfaz de usuario de la lógica del servidor y de la persistencia de los datos.

---

# 🚀 Despliegue

El proyecto está preparado para separar los servicios de frontend y backend.

Para un despliegue en producción se deben configurar:

### Frontend

El proyecto React/Vite puede desplegarse en servicios compatibles con aplicaciones frontend, configurando el comando de construcción:

```bash
npm run build
```

El resultado generado por Vite se utiliza como versión de producción.

### Backend

El backend Node.js/Express debe desplegarse en un servicio que permita ejecutar aplicaciones Node.js.

Se deben configurar las variables de entorno del servidor, especialmente:

```env
MONGODB_URI=TU_CADENA_DE_CONEXION
PORT=5000
```

### MongoDB Atlas

MongoDB Atlas funciona como servicio de base de datos en la nube.

Para permitir la conexión desde el backend desplegado se debe configurar correctamente el acceso de red y las credenciales de la base de datos.

> Las URL definitivas de producción se deben agregar a esta sección cuando el frontend y backend sean desplegados.

---

# 🧪 Pruebas y calidad

Durante el desarrollo se realizan pruebas sobre las funcionalidades principales del sistema, especialmente sobre los procesos CRUD y la comunicación entre frontend, backend y base de datos.

Las pruebas permiten verificar:

* Creación de registros.
* Consulta de información.
* Actualización de registros.
* Eliminación de registros.
* Comunicación con la API.
* Conexión con MongoDB.
* Validación de formularios.
* Funcionamiento de los diferentes módulos.

---

# 🔒 Seguridad

El proyecto considera algunas prácticas básicas de seguridad:

* Uso de variables de entorno.
* No publicar credenciales de MongoDB.
* Separación del frontend y backend.
* Validación de información recibida.
* Configuración de CORS.
* Uso de `.gitignore` para excluir archivos sensibles.

Estas medidas forman parte del proceso de aprendizaje y pueden ampliarse durante las siguientes etapas del desarrollo.

---

# 📚 Contexto académico

**Proyecto de formación — SENA**

**Programa:** Análisis y Desarrollo de Software (ADSO)

Live Green hace parte del proceso de formación orientado al desarrollo de competencias relacionadas con:

* Análisis de requerimientos.
* Diseño de software.
* Desarrollo frontend.
* Desarrollo backend.
* Gestión de bases de datos.
* Desarrollo de APIs.
* Control de versiones.
* Pruebas de software.
* Implementación y despliegue de aplicaciones.

El proyecto permite aplicar de manera práctica los conocimientos adquiridos durante el proceso de formación.

---

# 📌 Estado del proyecto

**Estado:** En desarrollo.

El proyecto continúa evolucionando mediante la incorporación y mejora de funcionalidades, módulos, validaciones, procesos CRUD y características relacionadas con la administración de la información.

---

# 👨‍💻 Repositorio

Repositorio oficial:

**Live Green**

https://github.com/ju04n/Live-Green

---
